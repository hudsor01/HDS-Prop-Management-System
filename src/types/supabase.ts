export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          created_at: string | null
          id: string
          lease_id: string | null
          name: string
          property_id: string | null
          tenant_id: string | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lease_id?: string | null
          name: string
          property_id?: string | null
          tenant_id?: string | null
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lease_id?: string | null
          name?: string
          property_id?: string | null
          tenant_id?: string | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          created_at: string | null
          document_url: string | null
          end_date: string
          id: string
          monthly_rent: number
          property_id: string
          security_deposit: number
          start_date: string
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          document_url?: string | null
          end_date: string
          id?: string
          monthly_rent: number
          property_id: string
          security_deposit: number
          start_date: string
          status: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          document_url?: string | null
          end_date?: string
          id?: string
          monthly_rent?: number
          property_id?: string
          security_deposit?: number
          start_date?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leases_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leases_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          completed_date: string | null
          created_at: string
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id: string
          scheduled_date: string | null
          status: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id: string
          title: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id: string
          title: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id?: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["message_direction"]
          id: string
          message: string
          property_id: string
          subject: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["message_direction"]
          id?: string
          message: string
          property_id: string
          subject: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["message_direction"]
          id?: string
          message?: string
          property_id?: string
          subject?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          auto_reminders: boolean | null
          created_at: string
          grace_period_days: number | null
          id: string
          late_fee_amount: number | null
          payment_methods: string[] | null
          property_id: string
          reminder_days: number[] | null
        }
        Insert: {
          auto_reminders?: boolean | null
          created_at?: string
          grace_period_days?: number | null
          id?: string
          late_fee_amount?: number | null
          payment_methods?: string[] | null
          property_id: string
          reminder_days?: number[] | null
        }
        Update: {
          auto_reminders?: boolean | null
          created_at?: string
          grace_period_days?: number | null
          id?: string
          late_fee_amount?: number | null
          payment_methods?: string[] | null
          property_id?: string
          reminder_days?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_settings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          paid_date: string | null
          payment_method: string | null
          property_id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string | null
          tenant_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          paid_date?: string | null
          payment_method?: string | null
          property_id: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          tenant_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          paid_date?: string | null
          payment_method?: string | null
          property_id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          created_at: string
          id: string
          image_url: string | null
          last_updated: string | null
          maintenance_requests: number | null
          occupancy_rate: number | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          revenue: number | null
          status: Database["public"]["Enums"]["property_status"] | null
          tenant_id: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_updated?: string | null
          maintenance_requests?: number | null
          occupancy_rate?: number | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          revenue?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          tenant_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_updated?: string | null
          maintenance_requests?: number | null
          occupancy_rate?: number | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          revenue?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      maintenance_priority: "Low" | "Medium" | "High"
      maintenance_status: "Pending" | "Scheduled" | "In Progress" | "Completed"
      message_direction: "Incoming" | "Outgoing"
      payment_status: "pending" | "completed" | "failed"
      property_status: "Occupied" | "Vacant" | "Maintenance"
      property_type: "Residential" | "Commercial" | "Industrial"
      user_role: "admin" | "property_manager" | "tenant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
