import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import type { PaymentSettings } from "@/types/database";

interface PaymentSettingsProps {
  propertyId: string;
}

const PaymentSettings = ({ propertyId }: PaymentSettingsProps) => {
  const [settings, setSettings] = useState<PaymentSettings>({
    id: "",
    property_id: propertyId,
    late_fee_amount: 0,
    grace_period_days: 0,
    payment_methods: ["card"],
    auto_reminders: true,
    reminder_days: [7, 3, 1],
    created_at: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [propertyId]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .eq("property_id", propertyId)
        .single();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error("Error fetching payment settings:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("payment_settings").upsert({
        property_id: propertyId,
        ...settings,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving payment settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethod = (method: string) => {
    setSettings((prev) => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter((m) => m !== method)
        : [...prev.payment_methods, method],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Late Fee Amount</Label>
            <Input
              type="number"
              value={settings.late_fee_amount}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  late_fee_amount: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Grace Period (Days)</Label>
            <Input
              type="number"
              value={settings.grace_period_days}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  grace_period_days: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Payment Methods</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "card",
                "venmo",
                "cashapp",
                "zelle",
                "chime",
                "bank_transfer",
              ].map((method) => (
                <Badge
                  key={method}
                  variant={
                    settings.payment_methods.includes(method)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => togglePaymentMethod(method)}
                >
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Automatic Payment Reminders</Label>
            <Switch
              checked={settings.auto_reminders}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, auto_reminders: checked })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Reminder Days (Before Due Date)</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 3, 5, 7, 14].map((days) => (
                <Badge
                  key={days}
                  variant={
                    settings.reminder_days.includes(days)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      reminder_days: prev.reminder_days.includes(days)
                        ? prev.reminder_days.filter((d) => d !== days)
                        : [...prev.reminder_days, days].sort((a, b) => b - a),
                    }))
                  }
                >
                  {days} {days === 1 ? "day" : "days"}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
