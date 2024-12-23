import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { getCalendarEvents, type CalendarEvent } from "@/lib/calendar";
import { format } from "date-fns";
import CalendarEventDialog from "./CalendarEventDialog";

interface CalendarViewProps {
  propertyId?: string;
  tenantId?: string;
}

const CalendarView = ({ propertyId, tenantId }: CalendarViewProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  useEffect(() => {
    fetchEvents();
  }, [propertyId, tenantId, selectedDate]);

  const fetchEvents = async () => {
    try {
      const startDate = new Date(selectedDate);
      startDate.setDate(1);
      const endDate = new Date(selectedDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

      const data = await getCalendarEvents({
        propertyId,
        tenantId,
        startDate,
        endDate,
      });
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDayEvents = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Maintenance":
        return "bg-yellow-500";
      case "Inspection":
        return "bg-blue-500";
      case "Showing":
        return "bg-green-500";
      case "Meeting":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />

          <div className="space-y-4">
            <h3 className="font-semibold">
              Events for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            {loading ? (
              <div>Loading events...</div>
            ) : (
              <div className="space-y-2">
                {getDayEvents(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleEventClick(event)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{event.title}</h4>
                      <Badge
                        className={`${getEventTypeColor(event.event_type)} text-white`}
                      >
                        {event.event_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(event.start_time), "h:mm a")} -{" "}
                      {format(new Date(event.end_time), "h:mm a")}
                    </p>
                    {event.description && (
                      <p className="text-sm mt-2">{event.description}</p>
                    )}
                  </div>
                ))}
                {getDayEvents(selectedDate).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No events scheduled for this day
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CalendarEventDialog
        propertyId={propertyId}
        tenantId={tenantId}
        open={dialogOpen}
        selectedEvent={selectedEvent || undefined}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setTimeout(() => {
              setSelectedEvent(null);
            }, 300);
          }
        }}
        onSave={fetchEvents}
      />
    </Card>
  );
};

export default CalendarView;
