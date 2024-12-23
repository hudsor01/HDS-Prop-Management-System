import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";

export async function setupNotifications() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });

      const { error } = await supabase.from("notification_preferences").upsert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        push_enabled: true,
        push_subscription: subscription,
      });

      if (error) throw error;
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error setting up notifications:", error);
    return false;
  }
}

export async function sendNotification({
  userId,
  title,
  message,
  type,
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}) {
  try {
    const { error } = await supabase.from("notifications").insert([
      {
        user_id: userId,
        title,
        message,
        type,
        link,
        read: false,
      },
    ]);

    if (error) throw error;

    // Send push notification if enabled
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (prefs?.push_enabled && prefs.push_subscription) {
      await fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: prefs.push_subscription,
          title,
          message,
          link,
        }),
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    toast({
      title: "Error",
      description: "Failed to send notification",
      variant: "destructive",
    });
  }
}

export async function getUnreadNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("read", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw error;
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}
