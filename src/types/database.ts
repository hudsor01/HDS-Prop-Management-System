export interface TenantReference {
  id: string;
  tenant_id: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  verified: boolean;
  verification_date?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "property_manager" | "tenant";
  phone?: string;
  created_at: string;
}

export interface Property {
  id: string;
  address: string;
  status: "Occupied" | "Vacant" | "Maintenance";
  revenue: number;
  occupancy_rate: number;
  maintenance_requests: number;
  tenant_id?: string;
  image_url?: string;
  property_type: "Residential" | "Commercial" | "Industrial";
  last_updated: string;
  created_at: string;
}

export interface Tenant {
  id: string;
  user_id: string;
  property_id: string;
  move_in_date: string;
  lease_end_date: string;
  rent_amount: number;
  security_deposit: number;
  background_check_status: string;
  credit_score: number;
  employment_verified: boolean;
  references_verified: boolean;
  status: string;
  created_at: string;
  user?: User;
  property?: Property;
}

export interface Vendor {
  id: string;
  name: string;
  service_type: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  rate_type?: string;
  rate_amount?: number;
  insurance_expiry?: string;
  license_number?: string;
  status: "Active" | "Inactive";
  created_at: string;
}

export interface Lease {
  id: string;
  property_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  status: "Active" | "Pending" | "Expired" | "Terminated";
  document_url?: string;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  tenant_id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High";
  scheduled_date?: string;
  completed_date?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  lease_id: string;
  tenant_id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  payment_method?: string;
  stripe_payment_intent_id?: string;
  due_date: string;
  paid_date?: string;
  created_at: string;
}

export interface PaymentSettings {
  id: string;
  property_id: string;
  late_fee_amount: number;
  grace_period_days: number;
  payment_methods: string[];
  auto_reminders: boolean;
  reminder_days: number[];
  created_at: string;
}

export interface Communication {
  id: string;
  property_id: string;
  tenant_id: string;
  subject: string;
  message: string;
  direction: "Incoming" | "Outgoing";
  read: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  property_id?: string;
  tenant_id?: string;
  lease_id?: string;
  name: string;
  type: string;
  url: string;
  created_at: string;
}

export interface SystemSettings {
  id: string;
  maintenance_auto_assign: boolean;
  payment_reminders: boolean;
  email_notifications: boolean;
  max_maintenance_requests: number;
  default_grace_period: number;
  created_at: string;
}
