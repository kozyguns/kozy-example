"use client";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import FileManager from "@/components/FileManager";  // Import the new component

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        className="mt-4 ut-button:bg-background ut-button:ut-readying:bg-purple-500/50"
        endpoint="fileUploader"
        onClientUploadComplete={(res) => {
          toast.success("File uploaded successfully!");
        }}
        onUploadError={(error: Error) => {
          console.error("Upload Error:", error.message);
          console.error("Error Stack:", error.stack);
          toast.error("Error uploading file: " + error.message);
        }}
      />
      <FileManager />  {/* Add the FileManager component here */}
    </main>
  );
}