import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Check } from "lucide-react";
import {
  getTenantReferences,
  createTenantReference,
  verifyTenantReference,
} from "@/lib/api";
import type { TenantReference } from "@/types/database";

interface TenantReferencesProps {
  tenantId: string;
}

const TenantReferences = ({ tenantId }: TenantReferencesProps) => {
  const [references, setReferences] = useState<TenantReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchReferences();
  }, [tenantId]);

  const fetchReferences = async () => {
    try {
      const data = await getTenantReferences(tenantId);
      setReferences(data);
    } catch (error) {
      console.error("Error fetching references:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTenantReference({
        tenant_id: tenantId,
        name: formData.name,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email,
        verified: false,
      });
      fetchReferences();
      setFormData({
        name: "",
        relationship: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      console.error("Error adding reference:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (referenceId: string) => {
    try {
      await verifyTenantReference(referenceId);
      fetchReferences();
    } catch (error) {
      console.error("Error verifying reference:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>References</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {references.map((reference) => (
            <div
              key={reference.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <h3 className="font-semibold">{reference.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {reference.relationship}
                </p>
                <div className="text-sm space-y-1">
                  {reference.phone && <p>Phone: {reference.phone}</p>}
                  {reference.email && <p>Email: {reference.email}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={reference.verified ? "default" : "secondary"}
                  className="mr-2"
                >
                  {reference.verified ? "Verified" : "Pending"}
                </Badge>
                {!reference.verified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(reference.id)}
                  >
                    <Check className="h-4 w-4 mr-1" /> Verify
                  </Button>
                )}
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Relationship</Label>
                <Input
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                  placeholder="e.g., Previous Landlord, Employer"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reference
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantReferences;
