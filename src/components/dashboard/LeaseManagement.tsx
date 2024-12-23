import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";
import { getLeases } from "@/lib/api";
import type { Lease } from "@/types/database";
import LeaseDialog from "./LeaseDialog";
import DocumentUpload from "./DocumentUpload";

interface LeaseManagementProps {
  propertyId?: string;
  tenantId?: string;
}

const LeaseManagement = ({ propertyId, tenantId }: LeaseManagementProps) => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);

  useEffect(() => {
    fetchLeases();
  }, [propertyId, tenantId]);

  const fetchLeases = async () => {
    try {
      const { data, error } = await getLeases(propertyId, tenantId);
      if (error) throw error;
      setLeases(data || []);
    } catch (error) {
      console.error("Error fetching leases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLease = () => {
    setSelectedLease(null);
    setDialogOpen(true);
  };

  const handleEditLease = (lease: Lease) => {
    setSelectedLease(lease);
    setDialogOpen(true);
  };

  const statusColors = {
    Active: "bg-green-500",
    Pending: "bg-yellow-500",
    Expired: "bg-red-500",
    Terminated: "bg-gray-500",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lease Management</CardTitle>
        <Button onClick={handleCreateLease}>
          <Plus className="h-4 w-4 mr-2" />
          Create Lease
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Document</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                leases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell>
                      {new Date(lease.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(lease.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${lease.monthly_rent}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[lease.status]} text-white`}
                      >
                        {lease.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lease.document_url ? (
                        <a
                          href={lease.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </a>
                      ) : (
                        <DocumentUpload
                          propertyId={propertyId}
                          tenantId={tenantId}
                          leaseId={lease.id}
                          onUploadComplete={fetchLeases}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLease(lease)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <LeaseDialog
          lease={selectedLease}
          propertyId={propertyId}
          tenantId={tenantId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={fetchLeases}
        />
      </CardContent>
    </Card>
  );
};

export default LeaseManagement;
