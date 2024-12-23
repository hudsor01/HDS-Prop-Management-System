import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceAutoAssign: false,
    paymentReminders: true,
    emailNotifications: true,
    maxMaintenanceRequests: 10,
    defaultGracePeriod: 5,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          maintenanceAutoAssign: data.maintenance_auto_assign,
          paymentReminders: data.payment_reminders,
          emailNotifications: data.email_notifications,
          maxMaintenanceRequests: data.max_maintenance_requests,
          defaultGracePeriod: data.default_grace_period,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("system_settings").upsert({
        maintenance_auto_assign: settings.maintenanceAutoAssign,
        payment_reminders: settings.paymentReminders,
        email_notifications: settings.emailNotifications,
        max_maintenance_requests: settings.maxMaintenanceRequests,
        default_grace_period: settings.defaultGracePeriod,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "System settings updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Maintenance Assignment</Label>
              <p className="text-sm text-muted-foreground">
                Automatically assign maintenance requests to available staff
              </p>
            </div>
            <Switch
              checked={settings.maintenanceAutoAssign}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceAutoAssign: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Send automatic payment reminders to tenants
              </p>
            </div>
            <Switch
              checked={settings.paymentReminders}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, paymentReminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for important updates
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Maximum Maintenance Requests</Label>
            <Input
              type="number"
              value={settings.maxMaintenanceRequests}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxMaintenanceRequests: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Default Grace Period (Days)</Label>
            <Input
              type="number"
              value={settings.defaultGracePeriod}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultGracePeriod: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <Button className="w-full" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
