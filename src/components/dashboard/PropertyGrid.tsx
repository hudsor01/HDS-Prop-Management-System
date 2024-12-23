import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { List, LayoutGrid } from "lucide-react";
import PropertyCard from "./PropertyCard";
import { toast } from "@/components/ui/use-toast";
import PropertyCreateDialog from "./PropertyCreateDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getProperties } from "@/lib/api";
import type { Property } from "@/types/database";

interface PropertyGridProps {
  onEdit?: (id: string) => void;
  onScheduleMaintenance?: (id: string) => void;
  onContactTenant?: (id: string) => void;
}

const PropertyGrid = ({
  onEdit = () => {},
  onScheduleMaintenance = () => {},
  onContactTenant = () => {},
}: PropertyGridProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedPropertyId, setSelectedPropertyId] =
    React.useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await getProperties(
          searchQuery,
          undefined,
          statusFilter !== "all" ? { status: statusFilter } : undefined,
        );
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          variant: "destructive",
          description: "Failed to load properties. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProperties, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, statusFilter]);

  const handleDeleteProperty = async (id: string) => {
    try {
      await supabase.from("properties").delete().eq("id", id);
      setProperties(properties.filter((p) => p.id !== id));
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete property",
      });
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>

          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="Occupied">Occupied</SelectItem>
                <SelectItem value="Vacant">Vacant</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                image={property.image_url}
                address={property.address}
                status={property.status}
                revenue={property.revenue}
                occupancyRate={property.occupancy_rate}
                maintenanceRequests={property.maintenance_requests}
                onEdit={() => onEdit(property.id)}
                onDelete={() => {
                  setSelectedPropertyId(property.id);
                  setDeleteDialogOpen(true);
                }}
                onScheduleMaintenance={() => onScheduleMaintenance(property.id)}
                onContactTenant={() => onContactTenant(property.id)}
              />
            ))
          )}
        </div>

        <PropertyCreateDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSave={() => window.location.reload()}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                property and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteProperty(selectedPropertyId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PropertyGrid;
