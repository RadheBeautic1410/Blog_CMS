"use client";

import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface MediaUploadButtonProps {
  folder?: string;
}

export default function MediaUploadButton({ folder = "media" }: MediaUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setError("");
    setSuccess("");
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
          setTimeout(() => setError(""), 5000);
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
            const response = await fetch("/api/admin/media", {
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
                folder: folder || "media",
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to save media record");
            }

            setSuccess("Image uploaded successfully!");
            setUploading(false);
            setUploadProgress(0);
            
            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            // Refresh the page after a short delay to show the new image
            setTimeout(() => {
              router.refresh();
            }, 1000);
          } catch (err) {
            console.error("Error saving media record:", err);
            setError("Image uploaded but failed to save record. Please refresh the page.");
            setUploading(false);
            setTimeout(() => {
              setError("");
              router.refresh();
            }, 3000);
          }
        }
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      setUploading(false);
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
        multiple
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <svg
              className="mr-2 h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Image
          </>
        )}
      </button>

      {uploading && (
        <div className="absolute top-full left-0 right-0 mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-[#2563EB] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 whitespace-nowrap z-10">
          {error}
        </div>
      )}

      {success && (
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 whitespace-nowrap z-10">
          {success}
        </div>
      )}
    </div>
  );
}
