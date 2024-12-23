import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface TenantScreeningProps {
  tenantId: string;
}

const TenantScreening = ({ tenantId }: TenantScreeningProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    creditScore: "",
    backgroundStatus: "Pending",
    incomeStatus: "Pending",
    employmentStatus: "",
    rentalHistory: "",
    referenceList: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("tenant_screening").insert([
        {
          tenant_id: tenantId,
          credit_score: parseInt(formData.creditScore),
          background_check_status: formData.backgroundStatus,
          income_verification_status: formData.incomeStatus,
          employment_status: formData.employmentStatus,
          rental_history: formData.rentalHistory,
          reference_list: formData.referenceList.split(","),
          notes: formData.notes,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error submitting screening:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Screening</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Credit Score</Label>
              <Input
                type="number"
                value={formData.creditScore}
                onChange={(e) =>
                  setFormData({ ...formData, creditScore: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Background Check Status</Label>
              <Badge
                variant={
                  formData.backgroundStatus === "Approved"
                    ? "default"
                    : "secondary"
                }
              >
                {formData.backgroundStatus}
              </Badge>
            </div>

            <div className="grid gap-2">
              <Label>Income Verification</Label>
              <Badge
                variant={
                  formData.incomeStatus === "Verified" ? "default" : "secondary"
                }
              >
                {formData.incomeStatus}
              </Badge>
            </div>

            <div className="grid gap-2">
              <Label>Employment Status</Label>
              <Input
                value={formData.employmentStatus}
                onChange={(e) =>
                  setFormData({ ...formData, employmentStatus: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Rental History</Label>
              <Textarea
                value={formData.rentalHistory}
                onChange={(e) =>
                  setFormData({ ...formData, rentalHistory: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>References (comma-separated)</Label>
              <Input
                value={formData.referenceList}
                onChange={(e) =>
                  setFormData({ ...formData, referenceList: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Screening"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TenantScreening;
