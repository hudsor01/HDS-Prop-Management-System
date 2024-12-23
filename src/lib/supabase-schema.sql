-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'property_manager', 'tenant');
    CREATE TYPE property_status AS ENUM ('Occupied', 'Vacant', 'Maintenance');
    CREATE TYPE property_type AS ENUM ('Residential', 'Commercial', 'Industrial');
    CREATE TYPE maintenance_status AS ENUM ('Pending', 'Scheduled', 'In Progress', 'Completed');
    CREATE TYPE maintenance_priority AS ENUM ('Low', 'Medium', 'High');
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
    CREATE TYPE message_direction AS ENUM ('Incoming', 'Outgoing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'tenant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address TEXT NOT NULL,
    status property_status DEFAULT 'Vacant',
    revenue DECIMAL,
    occupancy_rate INTEGER,
    maintenance_requests INTEGER DEFAULT 0,
    tenant_id UUID REFERENCES users(id),
    image_url TEXT,
    property_type property_type DEFAULT 'Residential',
    last_updated TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leases table
CREATE TABLE IF NOT EXISTS leases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) NOT NULL,
    tenant_id UUID REFERENCES users(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL NOT NULL,
    security_deposit DECIMAL NOT NULL,
    status TEXT NOT NULL,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) NOT NULL,
    tenant_id UUID REFERENCES users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status maintenance_status DEFAULT 'Pending',
    priority maintenance_priority DEFAULT 'Medium',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) NOT NULL,
    tenant_id UUID REFERENCES users(id) NOT NULL,
    amount DECIMAL NOT NULL,
    status payment_status DEFAULT 'pending',
    payment_method TEXT,
    stripe_payment_intent_id TEXT,
    due_date DATE NOT NULL,
    paid_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) UNIQUE NOT NULL,
    late_fee_amount DECIMAL,
    grace_period_days INTEGER,
    payment_methods TEXT[],
    auto_reminders BOOLEAN DEFAULT true,
    reminder_days INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) NOT NULL,
    tenant_id UUID REFERENCES users(id) NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    direction message_direction NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    tenant_id UUID REFERENCES users(id),
    lease_id UUID REFERENCES leases(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON properties FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON leases FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON maintenance_requests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON payments FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON payment_settings FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON documents FOR SELECT USING (true);
