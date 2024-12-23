import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown } from "lucide-react";
import { getProperties } from "@/lib/api";
import type { Property } from "@/types/database";

const PropertyTable = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    column: keyof Property;
    ascending: boolean;
  }>();
  const [loading, setLoading] = useState(false);

  const statusColors = {
    Occupied: "bg-green-500",
    Vacant: "bg-red-500",
    Maintenance: "bg-yellow-500",
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await getProperties(searchQuery, sortConfig);
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProperties, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, sortConfig]);

  const handleSort = (column: keyof Property) => {
    setSortConfig((current) => ({
      column,
      ascending: current?.column === column ? !current.ascending : true,
    }));
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search properties..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("address")}
                  className="flex items-center gap-1"
                >
                  Address
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1"
                >
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("revenue")}
                  className="flex items-center gap-1"
                >
                  Revenue
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("occupancy_rate")}
                  className="flex items-center gap-1"
                >
                  Occupancy
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("maintenance_requests")}
                  className="flex items-center gap-1"
                >
                  Maintenance
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("last_updated")}
                  className="flex items-center gap-1"
                >
                  Last Updated
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    {property.address}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusColors[property.status]} text-white`}
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${property.revenue}/mo
                  </TableCell>
                  <TableCell className="text-right">
                    {property.occupancy_rate}%
                  </TableCell>
                  <TableCell className="text-right">
                    {property.maintenance_requests} requests
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(property.last_updated).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PropertyTable;
