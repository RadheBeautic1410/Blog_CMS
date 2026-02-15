"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Media {
  id: string;
  name: string;
  url: string;
  alt?: string;
  caption?: string;
  description?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  folder?: string;
}

interface MediaFormProps {
  media: Media;
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaForm({ media }: MediaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: media.name,
    alt: media.alt || "",
    caption: media.caption || "",
    description: media.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: any = {
        name: formData.name,
        alt: formData.alt || null,
        caption: formData.caption || null,
        description: formData.description || null,
      };

      const response = await fetch(`/api/admin/media/${media.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update media");
      }

      router.push("/admin/media");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg bg-white border border-[#E5E7EB] p-6 space-y-6">
            <h3 className="text-lg font-semibold text-[#111827]">Media Information</h3>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#111827] mb-2"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                placeholder="Image name"
              />
            </div>

            {/* Alt Text */}
            <div>
              <label
                htmlFor="alt"
                className="block text-sm font-medium text-[#111827] mb-2"
              >
                Alt Text
              </label>
              <input
                type="text"
                id="alt"
                value={formData.alt}
                onChange={(e) =>
                  setFormData({ ...formData, alt: e.target.value })
                }
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                placeholder="Alternative text for accessibility"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used for screen readers and when the image cannot be displayed
              </p>
            </div>

            {/* Caption */}
            <div>
              <label
                htmlFor="caption"
                className="block text-sm font-medium text-[#111827] mb-2"
              >
                Caption
              </label>
              <input
                type="text"
                id="caption"
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                placeholder="Image caption"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#111827] mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                placeholder="Detailed description of the image"
              />
            </div>
          </div>

          {/* File Information */}
          <div className="rounded-lg bg-white border border-[#E5E7EB] p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#111827]">File Information</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">File Size</dt>
                <dd className="mt-1 text-sm text-[#111827]">
                  {formatFileSize(media.size)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                <dd className="mt-1 text-sm text-[#111827]">
                  {media.width && media.height
                    ? `${media.width} × ${media.height} px`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">MIME Type</dt>
                <dd className="mt-1 text-sm text-[#111827]">
                  {media.mimeType || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Folder</dt>
                <dd className="mt-1 text-sm text-[#111827]">
                  {media.folder || "root"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">URL</dt>
                <dd className="mt-1 text-sm text-[#111827] break-all">
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] hover:underline"
                  >
                    {media.url}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white border border-[#E5E7EB] p-6 space-y-4 sticky top-6">
            <h3 className="text-lg font-semibold text-[#111827]">Preview</h3>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#E5E7EB] bg-gray-100">
              <Image
                src={media.url}
                alt={formData.alt || media.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            {formData.caption && (
              <p className="text-sm text-gray-600 italic text-center">
                {formData.caption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F9FAFB] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Update Media"}
        </button>
      </div>
    </form>
  );
}
