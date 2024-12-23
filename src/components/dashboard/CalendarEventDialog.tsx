import React from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/calendar";
import type { CalendarEvent } from "@/lib/calendar";

interface CalendarEventDialogProps {
  propertyId?: string;
  tenantId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  selectedEvent?: CalendarEvent;
}

const CalendarEventDialog = ({
  propertyId,
  tenantId,
  open,
  onOpenChange,
  selectedEvent,
  onSave = () => {},
}: CalendarEventDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    eventType: "Maintenance",
    startTime: "",
    endTime: "",
  });

  React.useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        eventType: selectedEvent.event_type,
        startTime: selectedEvent.start_time,
        endTime: selectedEvent.end_time,
      });
    }
  }, [selectedEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !tenantId) return;

    setLoading(true);
    try {
      if (selectedEvent) {
        await updateCalendarEvent(selectedEvent.id, {
          title: formData.title,
          description: formData.description,
          event_type: formData.eventType,
          start_time: formData.startTime,
          end_time: formData.endTime,
        });
      } else {
        await createCalendarEvent({
          property_id: propertyId,
          tenant_id: tenantId,
          title: formData.title,
          description: formData.description,
          event_type: formData.eventType,
          start_time: formData.startTime,
          end_time: formData.endTime,
          status: "Scheduled",
          attendees: [tenantId],
        });
      }
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error with event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setLoading(true);
    try {
      await deleteCalendarEvent(selectedEvent.id);
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "Create Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value) =>
                  setFormData({ ...formData, eventType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Showing">Showing</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            {selectedEvent && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : selectedEvent ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEventDialog;
