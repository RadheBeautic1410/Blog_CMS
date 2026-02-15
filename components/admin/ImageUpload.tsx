"use client";

import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "blogs",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${folder}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, filename);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Failed to upload image. Please try again.");
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Save media record to database
          try {
            // Get image dimensions
            const getImageDimensions = (): Promise<{ width: number; height: number } | null> => {
              return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                
                img.onload = () => {
                  resolve({ width: img.width, height: img.height });
                };
                
                img.onerror = () => {
                  resolve(null);
                };
                
                img.src = downloadURL;
              });
            };

            const dimensions = await getImageDimensions();

            // Create media record
            try {
              await fetch("/api/admin/media", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: file.name,
                  url: downloadURL,
                  mimeType: file.type,
                  size: file.size,
                  width: dimensions?.width || null,
                  height: dimensions?.height || null,
                  folder: folder || "blogs",
                }),
              });
            } catch (err) {
              console.error("Error saving media record:", err);
              // Continue even if media record creation fails
            }
          } catch (err) {
            console.error("Error processing image:", err);
            // Continue even if media record creation fails
          }

          onChange(downloadURL);
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Choose Image"}
          </button>
        </div>
        {value && (
          <div className="flex-1">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or enter image URL"
              className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
            />
          </div>
        )}
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#2563EB] h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {value && !uploading && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#E5E7EB] bg-gray-100">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
