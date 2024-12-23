import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTenant, updateTenant } from "@/lib/api";
import type { Tenant } from "@/types/database";

interface TenantDialogProps {
  tenant?: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

const TenantDialog = ({
  tenant,
  open,
  onOpenChange,
  onSave = () => {},
}: TenantDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Tenant>>(
    tenant || {
      status: "Active",
      employment_verified: false,
      references_verified: false,
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tenant) {
        await updateTenant(tenant.id, formData);
      } else {
        await createTenant(formData as Omit<Tenant, "id" | "created_at">);
      }
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving tenant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tenant ? "Edit Tenant" : "Add Tenant"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user_id">User ID</Label>
              <Input
                id="user_id"
                value={formData.user_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, user_id: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="property_id">Property ID</Label>
              <Input
                id="property_id"
                value={formData.property_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, property_id: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="move_in_date">Move In Date</Label>
              <Input
                id="move_in_date"
                type="date"
                value={formData.move_in_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, move_in_date: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lease_end_date">Lease End Date</Label>
              <Input
                id="lease_end_date"
                type="date"
                value={formData.lease_end_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lease_end_date: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rent_amount">Monthly Rent</Label>
              <Input
                id="rent_amount"
                type="number"
                value={formData.rent_amount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rent_amount: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="security_deposit">Security Deposit</Label>
              <Input
                id="security_deposit"
                type="number"
                value={formData.security_deposit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    security_deposit: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="background_check_status">Background Check</Label>
              <Select
                value={formData.background_check_status || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, background_check_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="credit_score">Credit Score</Label>
              <Input
                id="credit_score"
                type="number"
                value={formData.credit_score || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credit_score: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : tenant ? "Save changes" : "Add tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenantDialog;
