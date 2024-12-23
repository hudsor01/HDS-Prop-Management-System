import { supabase } from "./supabase";

export async function logAuditEvent({
  userId,
  action,
  entityType,
  entityId,
  oldValues,
  newValues,
}: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
}) {
  try {
    const { error } = await supabase.from("audit_logs").insert([
      {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: window.clientInformation?.userAgent,
        user_agent: window.navigator?.userAgent,
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.error("Error logging audit event:", error);
  }
}

export async function getAuditLogs({
  userId,
  entityType,
  entityId,
  startDate,
  endDate,
}: {
  userId?: string;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) query = query.eq("user_id", userId);
    if (entityType) query = query.eq("entity_type", entityType);
    if (entityId) query = query.eq("entity_id", entityId);
    if (startDate) query = query.gte("created_at", startDate.toISOString());
    if (endDate) query = query.lte("created_at", endDate.toISOString());

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
}
