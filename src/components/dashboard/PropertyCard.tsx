import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Calendar, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface PropertyCardProps {
  image?: string;
  address?: string;
  status?: "Occupied" | "Vacant" | "Maintenance";
  revenue?: number;
  occupancyRate?: number;
  maintenanceRequests?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
  onScheduleMaintenance?: () => void;
  onContactTenant?: () => void;
}

const PropertyCard = ({
  image = "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  address = "123 Example Street, City, State 12345",
  status = "Occupied",
  revenue = 2500,
  occupancyRate = 100,
  maintenanceRequests = 2,
  onEdit = () => {},
  onDelete = () => {},
  onViewDetails = () => {},
  onScheduleMaintenance = () => {},
  onContactTenant = () => {},
}: PropertyCardProps) => {
  const statusColors = {
    Occupied: "bg-green-500",
    Vacant: "bg-red-500",
    Maintenance: "bg-yellow-500",
  };

  return (
    <Card className="w-96 h-[280px] bg-white shadow-lg hover:shadow-xl transition-all duration-200 group">
      <CardHeader className="p-0 h-36 relative">
        <img
          src={image}
          alt="Property"
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                aria-label="Open menu"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                Edit Property
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewDetails}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onScheduleMaintenance}>
                Schedule Maintenance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onContactTenant}>
                Contact Tenant
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                Delete Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg truncate">{address}</h3>
          <Badge
            className={`${statusColors[status]} text-white transition-colors`}
          >
            {status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>Revenue: ${revenue}/mo</div>
          <div>Occupancy: {occupancyRate}%</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 transition-colors"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 transition-colors"
          onClick={onScheduleMaintenance}
        >
          <Calendar className="h-4 w-4" /> Schedule
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 transition-colors"
          onClick={onContactTenant}
        >
          <MessageSquare className="h-4 w-4" /> Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
