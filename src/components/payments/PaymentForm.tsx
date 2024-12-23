import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createPaymentIntent } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

interface PaymentFormProps {
  amount: number;
  propertyId: string;
  tenantId: string;
  onSuccess?: () => void;
}

export function PaymentForm({
  amount,
  propertyId,
  tenantId,
  onSuccess,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement)!,
        });

      if (stripeError) throw stripeError;

      const { clientSecret } = await createPaymentIntent({
        amount,
        paymentMethodId: paymentMethod.id,
        propertyId,
        tenantId,
      });

      const { error: confirmError } =
        await stripe.confirmCardPayment(clientSecret);
      if (confirmError) throw confirmError;

      // Record payment in database
      const { error: dbError } = await supabase.from("payments").insert([
        {
          property_id: propertyId,
          tenant_id: tenantId,
          amount,
          status: "completed",
          payment_method: "card",
          due_date: new Date().toISOString(),
          paid_date: new Date().toISOString(),
        },
      ]);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Payment processed successfully",
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Payment failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded-md bg-background">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  );
}
