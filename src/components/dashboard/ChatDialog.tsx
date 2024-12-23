import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface ChatDialogProps {
  propertyId: string;
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const ChatDialog = ({
  propertyId,
  tenantId,
  open,
  onOpenChange,
}: ChatDialogProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      initializeChat();
    }
  }, [open, propertyId, tenantId]);

  useEffect(() => {
    if (roomId) {
      const subscription = supabase
        .channel("chat_messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            setMessages((current) => [...current, payload.new as Message]);
          },
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    try {
      // Get or create chat room
      let { data: room } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("property_id", propertyId)
        .eq("tenant_id", tenantId)
        .single();

      if (!room) {
        const { data: newRoom } = await supabase
          .from("chat_rooms")
          .insert({
            property_id: propertyId,
            tenant_id: tenantId,
            landlord_id: user?.id,
          })
          .select()
          .single();
        room = newRoom;
      }

      if (room) {
        setRoomId(room.id);
        // Fetch messages
        const { data: messages } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("room_id", room.id)
          .order("created_at", { ascending: true });
        setMessages(messages || []);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || !user) return;

    try {
      await supabase.from("chat_messages").insert({
        room_id: roomId,
        sender_id: user.id,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[500px]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.sender_id === user?.id ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender_id}`}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${message.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
