import React, { useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendMessage, getMessages } from "@/lib/api";
import type { Communication } from "@/types/database";

interface TenantCommunicationDialogProps {
  propertyId: string;
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TenantCommunicationDialog = ({
  propertyId,
  tenantId,
  open,
  onOpenChange,
}: TenantCommunicationDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Communication[]>([]);
  const [newMessage, setNewMessage] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (open) {
      fetchMessages();
    }
  }, [open, propertyId, tenantId]);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(propertyId, tenantId);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendMessage({
        property_id: propertyId,
        tenant_id: tenantId,
        subject: newMessage.subject,
        message: newMessage.message,
        direction: "Outgoing",
      });
      setNewMessage({ subject: "", message: "" });
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tenant Communication</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[500px]">
          <ScrollArea className="flex-1 border rounded-md p-4 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 p-3 rounded-lg ${
                  msg.direction === "Outgoing"
                    ? "bg-primary/10 ml-auto"
                    : "bg-muted"
                } max-w-[80%]`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{msg.subject}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newMessage.message}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, message: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantCommunicationDialog;
