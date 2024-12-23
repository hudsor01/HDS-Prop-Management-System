import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface InsuranceTrackingProps {
  propertyId: string;
  tenantId: string;
}

const InsuranceTracking = ({
  propertyId,
  tenantId,
}: InsuranceTrackingProps) => {
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState<any>(null);
  const [formData, setFormData] = useState({
    policyNumber: "",
    provider: "",
    coverageAmount: "",
    premiumAmount: "",
    startDate: "",
    endDate: "",
    policyType: "Renters",
    status: "Active",
  });

  useEffect(() => {
    fetchInsurance();
  }, [propertyId, tenantId]);

  const fetchInsurance = async () => {
    try {
      const { data, error } = await supabase.rpc("get_insurance_status", {
        property_id_param: propertyId,
        tenant_id_param: tenantId,
      });

      if (error) throw error;
      if (data) setPolicy(data[0]);
    } catch (error) {
      console.error("Error fetching insurance:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("insurance_policies").insert([
        {
          property_id: propertyId,
          tenant_id: tenantId,
          policy_number: formData.policyNumber,
          provider: formData.provider,
          coverage_amount: parseFloat(formData.coverageAmount),
          premium_amount: parseFloat(formData.premiumAmount),
          start_date: formData.startDate,
          end_date: formData.endDate,
          policy_type: formData.policyType,
          status: formData.status,
        },
      ]);

      if (error) throw error;
      fetchInsurance();
    } catch (error) {
      console.error("Error submitting insurance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {policy && (
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Current Policy</h3>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span>Policy Number:</span>
                <span>{policy.policy_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Provider:</span>
                <span>{policy.provider}</span>
              </div>
              <div className="flex justify-between">
                <span>Coverage:</span>
                <span>${policy.coverage_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge
                  variant={policy.status === "Active" ? "default" : "secondary"}
                >
                  {policy.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Expires in:</span>
                <span>{policy.days_until_expiration} days</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Policy Number</Label>
              <Input
                value={formData.policyNumber}
                onChange={(e) =>
                  setFormData({ ...formData, policyNumber: e.target.value })
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
              <Label>Coverage Amount</Label>
              <Input
                type="number"
                value={formData.coverageAmount}
                onChange={(e) =>
                  setFormData({ ...formData, coverageAmount: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Premium Amount</Label>
              <Input
                type="number"
                value={formData.premiumAmount}
                onChange={(e) =>
                  setFormData({ ...formData, premiumAmount: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Insurance Policy"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InsuranceTracking;
