import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface VendorManagementProps {
  propertyId?: string;
}

const VendorManagement = ({ propertyId }: VendorManagementProps) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    serviceType: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    rateType: "",
    rateAmount: "",
    insuranceExpiry: "",
    licenseNumber: "",
    rating: "",
    status: "Active",
  });

  useEffect(() => {
    fetchVendors();
  }, [propertyId]);

  const fetchVendors = async () => {
    try {
      let query = supabase.from("vendors").select("*");

      if (propertyId) {
        query = query.eq("property_id", propertyId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("vendors").insert([
        {
          name: formData.name,
          service_type: formData.serviceType,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          rate_type: formData.rateType,
          rate_amount: parseFloat(formData.rateAmount),
          insurance_expiry: formData.insuranceExpiry,
          license_number: formData.licenseNumber,
          rating: parseInt(formData.rating),
          status: formData.status,
        },
      ]);

      if (error) throw error;
      fetchVendors();
      setFormData({
        name: "",
        serviceType: "",
        contactName: "",
        email: "",
        phone: "",
        address: "",
        rateType: "",
        rateAmount: "",
        insuranceExpiry: "",
        licenseNumber: "",
        rating: "",
        status: "Active",
      });
    } catch (error) {
      console.error("Error adding vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {vendors.map((vendor: any) => (
            <div key={vendor.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {vendor.service_type}
                  </p>
                </div>
                <Badge
                  variant={vendor.status === "Active" ? "default" : "secondary"}
                >
                  {vendor.status}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Contact:</span>
                  <p>{vendor.contact_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p>{vendor.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p>{vendor.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rate:</span>
                  <p>
                    ${vendor.rate_amount}/{vendor.rate_type}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Vendor Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Service Type</Label>
                <Input
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Contact Name</Label>
                <Input
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
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

              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Address</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Rate Type</Label>
                <Input
                  value={formData.rateType}
                  onChange={(e) =>
                    setFormData({ ...formData, rateType: e.target.value })
                  }
                  placeholder="hourly/fixed/project"
                />
              </div>

              <div className="grid gap-2">
                <Label>Rate Amount</Label>
                <Input
                  type="number"
                  value={formData.rateAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, rateAmount: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Insurance Expiry</Label>
                <Input
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      insuranceExpiry: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>License Number</Label>
                <Input
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Vendor"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorManagement;
