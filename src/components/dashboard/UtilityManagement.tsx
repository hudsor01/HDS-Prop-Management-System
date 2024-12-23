import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

interface UtilityManagementProps {
  propertyId: string;
}

const UtilityManagement = ({ propertyId }: UtilityManagementProps) => {
  const [utilities, setUtilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    utilityType: "",
    provider: "",
    accountNumber: "",
    monthlyAverage: "",
    lastReading: "",
    lastReadingDate: "",
    nextReadingDate: "",
    autoPay: false,
  });

  useEffect(() => {
    fetchUtilities();
  }, [propertyId]);

  const fetchUtilities = async () => {
    try {
      const { data, error } = await supabase
        .from("utilities")
        .select("*")
        .eq("property_id", propertyId);

      if (error) throw error;
      setUtilities(data || []);
    } catch (error) {
      console.error("Error fetching utilities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("utilities").insert([
        {
          property_id: propertyId,
          utility_type: formData.utilityType,
          provider: formData.provider,
          account_number: formData.accountNumber,
          monthly_average: parseFloat(formData.monthlyAverage),
          last_reading: parseFloat(formData.lastReading),
          last_reading_date: formData.lastReadingDate,
          next_reading_date: formData.nextReadingDate,
          auto_pay: formData.autoPay,
        },
      ]);

      if (error) throw error;
      fetchUtilities();
      setFormData({
        utilityType: "",
        provider: "",
        accountNumber: "",
        monthlyAverage: "",
        lastReading: "",
        lastReadingDate: "",
        nextReadingDate: "",
        autoPay: false,
      });
    } catch (error) {
      console.error("Error adding utility:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utility Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {utilities.map((utility: any) => (
            <div key={utility.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{utility.utility_type}</h3>
                  <p className="text-sm text-muted-foreground">
                    {utility.provider}
                  </p>
                </div>
                <Badge variant={utility.auto_pay ? "default" : "secondary"}>
                  {utility.auto_pay ? "Auto Pay" : "Manual Pay"}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Account Number:</span>
                  <p>{utility.account_number}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Monthly Average:
                  </span>
                  <p>${utility.monthly_average}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Reading:</span>
                  <p>{utility.last_reading}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Reading:</span>
                  <p>
                    {new Date(utility.next_reading_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Utility Type</Label>
                <Input
                  value={formData.utilityType}
                  onChange={(e) =>
                    setFormData({ ...formData, utilityType: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Provider</Label>
                <Input
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Account Number</Label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Monthly Average</Label>
                <Input
                  type="number"
                  value={formData.monthlyAverage}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyAverage: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Last Reading</Label>
                <Input
                  type="number"
                  value={formData.lastReading}
                  onChange={(e) =>
                    setFormData({ ...formData, lastReading: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Last Reading Date</Label>
                <Input
                  type="date"
                  value={formData.lastReadingDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastReadingDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Next Reading Date</Label>
                <Input
                  type="date"
                  value={formData.nextReadingDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextReadingDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Auto Pay</Label>
                <Switch
                  checked={formData.autoPay}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, autoPay: checked })
                  }
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Utility"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilityManagement;
