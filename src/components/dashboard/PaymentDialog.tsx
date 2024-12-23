import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { QRCode } from "react-qr-code";

interface PaymentDialogProps {
  propertyId: string;
  tenantId: string;
  amount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PaymentDialog = ({
  propertyId,
  tenantId,
  amount,
  open,
  onOpenChange,
  onSuccess,
}: PaymentDialogProps) => {
  const alternativePayments = {
    venmo: {
      handle: "@your-property-venmo",
      qrValue: "venmo://users/your-property-venmo",
    },
    cashapp: {
      handle: "$yourpropertycash",
      qrValue: "https://cash.app/$yourpropertycash",
    },
    zelle: {
      handle: "payments@yourproperty.com",
      qrValue: "upi://pay?pa=payments@yourproperty.com",
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="text-2xl font-bold">${amount}</div>
          </div>

          <Tabs defaultValue="card">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="other">Other Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="card">
              <PaymentForm
                amount={amount}
                propertyId={propertyId}
                tenantId={tenantId}
                onSuccess={onSuccess}
              />
            </TabsContent>

            <TabsContent value="other">
              <Tabs defaultValue="venmo">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="venmo">Venmo</TabsTrigger>
                  <TabsTrigger value="cashapp">Cash App</TabsTrigger>
                  <TabsTrigger value="zelle">Zelle</TabsTrigger>
                </TabsList>

                {Object.entries(alternativePayments).map(
                  ([method, details]) => (
                    <TabsContent
                      key={method}
                      value={method}
                      className="space-y-4"
                    >
                      <div className="p-4 border rounded-lg space-y-4">
                        <p className="text-sm font-medium">{details.handle}</p>
                        <div className="flex justify-center p-2 bg-white">
                          <QRCode value={details.qrValue} size={150} />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          Scan to pay with{" "}
                          {method.charAt(0).toUpperCase() + method.slice(1)}
                        </p>
                      </div>
                    </TabsContent>
                  ),
                )}
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
