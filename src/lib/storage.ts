import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";

export async function uploadFile(
  file: File,
  bucket: "documents" | "properties",
  path?: string,
) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast({
      title: "Error",
      description: "Failed to upload file",
      variant: "destructive",
    });
    throw error;
  }
}

export async function deleteFile(
  path: string,
  bucket: "documents" | "properties",
) {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting file:", error);
    toast({
      title: "Error",
      description: "Failed to delete file",
      variant: "destructive",
    });
    throw error;
  }
}
