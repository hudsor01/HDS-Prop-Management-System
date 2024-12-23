import React, { useState } from "react";
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
import { Upload, File } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DocumentUploadProps {
  propertyId?: string;
  tenantId?: string;
  leaseId?: string;
  onUploadComplete?: () => void;
}

const DocumentUpload = ({
  propertyId,
  tenantId,
  leaseId,
  onUploadComplete,
}: DocumentUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("lease");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      // Create document record
      const { error: dbError } = await supabase.from("documents").insert([
        {
          property_id: propertyId,
          tenant_id: tenantId,
          lease_id: leaseId,
          name: file.name,
          type: file.type,
          url: publicUrl,
          category,
          size: file.size,
        },
      ]);

      if (dbError) throw dbError;

      setFile(null);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      setError("Failed to upload document. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Document Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lease">Lease Agreement</SelectItem>
              <SelectItem value="maintenance">Maintenance Record</SelectItem>
              <SelectItem value="inspection">Property Inspection</SelectItem>
              <SelectItem value="insurance">Insurance Document</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="document">Upload Document</Label>
          <Input
            id="document"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full"
      >
        {loading ? (
          "Uploading..."
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </>
        )}
      </Button>

      {file && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <File className="h-4 w-4" />
          <span className="text-sm truncate">{file.name}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
