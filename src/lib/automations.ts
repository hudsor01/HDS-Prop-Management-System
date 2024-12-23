import { supabase } from "./supabase";
import { sendNotification } from "./notifications";

export async function setupAutomatedReminders() {
  // Check for upcoming payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("status", "pending")
    .gte("due_date", new Date().toISOString());

  payments?.forEach((payment) => {
    const dueDate = new Date(payment.due_date);
    const today = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
    );

    if (daysUntilDue <= 3) {
      sendNotification("Payment Reminder", {
        body: `Payment of $${payment.amount} is due in ${daysUntilDue} days`,
        icon: "/icon-192.png",
        tag: `payment-${payment.id}`,
      });
    }
  });

  // Check maintenance requests
  const { data: maintenance } = await supabase
    .from("maintenance_requests")
    .select("*")
    .in("status", ["Pending", "In Progress"]);

  maintenance?.forEach((request) => {
    if (request.status === "Pending") {
      sendNotification("Maintenance Request", {
        body: `New maintenance request: ${request.title}`,
        icon: "/icon-192.png",
        tag: `maintenance-${request.id}`,
      });
    }
  });
}

// Set up periodic checks
setInterval(setupAutomatedReminders, 1000 * 60 * 60); // Check every hour
