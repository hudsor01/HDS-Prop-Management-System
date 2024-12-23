import { loadStripe } from "@stripe/stripe-js";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  console.warn("Stripe publishable key not found");
}

export const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export async function createPaymentIntent({
  amount,
  paymentMethodId,
  propertyId,
  tenantId,
}: {
  amount: number;
  paymentMethodId: string;
  propertyId: string;
  tenantId: string;
}) {
  const response = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      payment_method_id: paymentMethodId,
      property_id: propertyId,
      tenant_id: tenantId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
