import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";
import type {
  MaintenanceRequest,
  Property,
  Lease,
  Vendor,
  Tenant,
} from "@/types/database";

// Properties
export const getProperties = async (
  search?: string,
  sortBy?: { column: keyof Property; ascending: boolean },
  filters?: { status?: string; propertyType?: string },
): Promise<Property[]> => {
  try {
    let query = supabase.from("properties").select("*");

    if (search) {
      query = query.ilike("address", `%${search}%`);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (sortBy) {
      query = query.order(sortBy.column, { ascending: sortBy.ascending });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    toast({
      title: "Error",
      description: "Failed to fetch properties",
      variant: "destructive",
    });
    return [];
  }
};

export const createProperty = async (
  property: Partial<Property>,
  image?: File | null,
): Promise<void> => {
  try {
    let image_url = "";

    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("properties")
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("properties").getPublicUrl(fileName);

      image_url = publicUrl;
    }

    const { error } = await supabase.from("properties").insert([
      {
        ...property,
        image_url,
        last_updated: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Property created successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    toast({
      title: "Error",
      description: "Failed to create property",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateProperty = async (
  id: string,
  updates: Partial<Property>,
) => {
  try {
    const { error } = await supabase
      .from("properties")
      .update({ ...updates, last_updated: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Property updated successfully",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    toast({
      title: "Error",
      description: "Failed to update property",
      variant: "destructive",
    });
    throw error;
  }
};

// Tenants
export const getTenants = async (
  search?: string,
  filters?: { status?: string; propertyId?: string },
): Promise<Tenant[]> => {
  try {
    let query = supabase
      .from("tenants")
      .select(`*, users!inner(*), properties(*)`);

    if (search) {
      query = query.or(
        `users.full_name.ilike.%${search}%,users.email.ilike.%${search}%`,
      );
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.propertyId) {
      query = query.eq("property_id", filters.propertyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching tenants:", error);
    toast({
      title: "Error",
      description: "Failed to fetch tenants",
      variant: "destructive",
    });
    return [];
  }
};

export const createTenant = async (
  tenant: Omit<Tenant, "id" | "created_at">,
) => {
  try {
    const { error } = await supabase.from("tenants").insert([tenant]);
    if (error) throw error;

    toast({
      title: "Success",
      description: "Tenant created successfully",
    });
  } catch (error) {
    console.error("Error creating tenant:", error);
    toast({
      title: "Error",
      description: "Failed to create tenant",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateTenant = async (id: string, updates: Partial<Tenant>) => {
  try {
    const { error } = await supabase
      .from("tenants")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Tenant updated successfully",
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    toast({
      title: "Error",
      description: "Failed to update tenant",
      variant: "destructive",
    });
    throw error;
  }
};

// Vendors
export const getVendors = async (
  search?: string,
  filters?: { status?: string; serviceType?: string },
): Promise<Vendor[]> => {
  try {
    let query = supabase.from("vendors").select("*");

    if (search) {
      query = query.or(`name.ilike.%${search}%,service_type.ilike.%${search}%`);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.serviceType) {
      query = query.eq("service_type", filters.serviceType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    toast({
      title: "Error",
      description: "Failed to fetch vendors",
      variant: "destructive",
    });
    return [];
  }
};

export const createVendor = async (
  vendor: Omit<Vendor, "id" | "created_at">,
) => {
  try {
    const { error } = await supabase.from("vendors").insert([vendor]);
    if (error) throw error;

    toast({
      title: "Success",
      description: "Vendor created successfully",
    });
  } catch (error) {
    console.error("Error creating vendor:", error);
    toast({
      title: "Error",
      description: "Failed to create vendor",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateVendor = async (id: string, updates: Partial<Vendor>) => {
  try {
    const { error } = await supabase
      .from("vendors")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Vendor updated successfully",
    });
  } catch (error) {
    console.error("Error updating vendor:", error);
    toast({
      title: "Error",
      description: "Failed to update vendor",
      variant: "destructive",
    });
    throw error;
  }
};

// Maintenance
export const createMaintenanceRequest = async (
  request: Omit<MaintenanceRequest, "id" | "created_at">,
) => {
  try {
    const { error } = await supabase
      .from("maintenance_requests")
      .insert([request]);

    if (error) throw error;

    // Update the property's maintenance_requests count and status
    const { data: property } = await supabase
      .from("properties")
      .select("maintenance_requests")
      .eq("id", request.property_id)
      .single();

    if (property) {
      await supabase
        .from("properties")
        .update({
          maintenance_requests: (property.maintenance_requests || 0) + 1,
          status: "Maintenance",
          last_updated: new Date().toISOString(),
        })
        .eq("id", request.property_id);
    }
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    throw error;
  }
};

export const getMaintenanceRequests = async (
  propertyId?: string,
  tenantId?: string,
) => {
  try {
    let query = supabase
      .from("maintenance_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (propertyId) query = query.eq("property_id", propertyId);
    if (tenantId) query = query.eq("tenant_id", tenantId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    return [];
  }
};

// Messages
export const sendMessage = async (message: any) => {
  try {
    const { error } = await supabase.from("messages").insert([message]);
    if (error) throw error;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getMessages = async (propertyId: string, tenantId: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("property_id", propertyId)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
