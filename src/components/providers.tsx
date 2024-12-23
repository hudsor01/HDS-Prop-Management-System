import { AuthProvider } from "@/components/auth/AuthProvider";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster } from "@/components/ui/toaster";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          {children}
          <Toaster />
        </Elements>
      ) : (
        <>
          {children}
          <Toaster />
        </>
      )}
    </AuthProvider>
  );
}
