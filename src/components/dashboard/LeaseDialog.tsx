import React, { useState } from "react";
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
import { createLease } from "@/lib/api";
import type { Lease } from "@/types/database";

interface LeaseDialogProps {
  lease?: Lease | null;
  propertyId?: string;
  tenantId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

const LeaseDialog = ({
  lease,
  propertyId,
  tenantId,
  open,
  onOpenChange,
  onSave = () => {},
}: LeaseDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lease>>(
    lease || {
      property_id: propertyId,
      tenant_id: tenantId,
      status: "Pending",
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !tenantId) return;

    setLoading(true);
    try {
      await createLease({
        ...formData,
        property_id: propertyId,
        tenant_id: tenantId,
      } as Omit<Lease, "id" | "created_at">);
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating lease:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{lease ? "Edit Lease" : "Create Lease"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthly_rent">Monthly Rent</Label>
              <Input
                id="monthly_rent"
                type="number"
                value={formData.monthly_rent || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthly_rent: Number(e.target.value),
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
                    security_deposit: Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Lease["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Lease"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaseDialog;
