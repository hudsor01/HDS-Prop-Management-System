import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";
import type { Payment } from "@/types/database";

export async function createPayment(
  payment: Omit<Payment, "id" | "created_at">,
) {
  try {
    const { data, error } = await supabase
      .from("payments")
      .insert([payment])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating payment:", error);
    toast({
      title: "Error",
      description: "Failed to create payment",
      variant: "destructive",
    });
    throw error;
  }
}

export async function processStripePayment(
  paymentMethodId: string,
  amount: number,
  payment: Omit<Payment, "id" | "created_at" | "stripe_payment_intent_id">,
) {
  try {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_method_id: paymentMethodId,
        amount,
        payment_data: payment,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing payment:", error);
    toast({
      title: "Error",
      description: "Failed to process payment",
      variant: "destructive",
    });
    throw error;
  }
}

export async function getPaymentHistory(tenantId?: string, leaseId?: string) {
  try {
    let query = supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (tenantId) query = query.eq("tenant_id", tenantId);
    if (leaseId) query = query.eq("lease_id", leaseId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
}
