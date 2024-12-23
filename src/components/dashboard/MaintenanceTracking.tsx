import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface MaintenanceTrackingProps {
  propertyId: string;
}

const MaintenanceTracking = ({ propertyId }: MaintenanceTrackingProps) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    maintenanceType: "",
    lastServiceDate: "",
    nextServiceDate: "",
    serviceInterval: "",
    serviceNotes: "",
    cost: "",
    vendorId: "",
    status: "Active",
  });

  useEffect(() => {
    fetchRecords();
  }, [propertyId]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("maintenance_tracking")
        .select("*, vendors(name)")
        .eq("property_id", propertyId);

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("maintenance_tracking").insert([
        {
          property_id: propertyId,
          maintenance_type: formData.maintenanceType,
          last_service_date: formData.lastServiceDate,
          next_service_date: formData.nextServiceDate,
          service_interval: parseInt(formData.serviceInterval),
          service_notes: formData.serviceNotes,
          cost: parseFloat(formData.cost),
          vendor_id: formData.vendorId,
          status: formData.status,
        },
      ]);

      if (error) throw error;
      fetchRecords();
      setFormData({
        maintenanceType: "",
        lastServiceDate: "",
        nextServiceDate: "",
        serviceInterval: "",
        serviceNotes: "",
        cost: "",
        vendorId: "",
        status: "Active",
      });
    } catch (error) {
      console.error("Error adding maintenance record:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {records.map((record: any) => (
            <div key={record.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{record.maintenance_type}</h3>
                  <p className="text-sm text-muted-foreground">
                    Vendor: {record.vendors?.name}
                  </p>
                </div>
                <Badge
                  variant={record.status === "Active" ? "default" : "secondary"}
                >
                  {record.status}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Last Service:</span>
                  <p>
                    {new Date(record.last_service_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Service:</span>
                  <p>
                    {new Date(record.next_service_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Interval:</span>
                  <p>{record.service_interval} days</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span>
                  <p>${record.cost}</p>
                </div>
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Maintenance Type</Label>
                <Input
                  value={formData.maintenanceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceType: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Last Service Date</Label>
                <Input
                  type="date"
                  value={formData.lastServiceDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastServiceDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Next Service Date</Label>
                <Input
                  type="date"
                  value={formData.nextServiceDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextServiceDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Service Interval (days)</Label>
                <Input
                  type="number"
                  value={formData.serviceInterval}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceInterval: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Cost</Label>
                <Input
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Service Notes</Label>
                <Textarea
                  value={formData.serviceNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceNotes: e.target.value })
                  }
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Maintenance Record"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceTracking;
