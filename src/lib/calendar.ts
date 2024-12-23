import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";

export interface CalendarEvent {
  id: string;
  property_id: string;
  tenant_id: string;
  title: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string;
  status: string;
  attendees: string[];
  created_at: string;
}

export async function createCalendarEvent(
  event: Omit<CalendarEvent, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("calendar_events")
    .insert([event]);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to create event",
      variant: "destructive",
    });
    throw error;
  }
  return data;
}

export async function updateCalendarEvent(
  id: string,
  event: Partial<Omit<CalendarEvent, "id" | "created_at">>,
) {
  const { error } = await supabase
    .from("calendar_events")
    .update(event)
    .eq("id", id);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to update event",
      variant: "destructive",
    });
    throw error;
  }
}

export async function deleteCalendarEvent(id: string) {
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to delete event",
      variant: "destructive",
    });
    throw error;
  }
}

export async function getCalendarEvents({
  propertyId,
  tenantId,
  startDate,
  endDate,
}: {
  propertyId?: string;
  tenantId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  let query = supabase
    .from("calendar_events")
    .select("*")
    .order("start_time", { ascending: true });

  if (propertyId) query = query.eq("property_id", propertyId);
  if (tenantId) query = query.eq("tenant_id", tenantId);
  if (startDate) query = query.gte("start_time", startDate.toISOString());
  if (endDate) query = query.lte("end_time", endDate.toISOString());

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
