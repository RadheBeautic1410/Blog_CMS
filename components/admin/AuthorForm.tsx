"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUpload from "./ImageUpload";

interface Author {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
  };
}

interface AuthorFormProps {
  author?: Author;
}

export default function AuthorForm({ author }: AuthorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: author?.name || "",
    email: author?.email || "",
    bio: author?.bio || "",
    avatar: author?.avatar || "",
    website: author?.website || "",
    twitter: author?.socialLinks?.twitter || "",
    linkedin: author?.socialLinks?.linkedin || "",
    github: author?.socialLinks?.github || "",
    facebook: author?.socialLinks?.facebook || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const socialLinks: any = {};
      if (formData.twitter) socialLinks.twitter = formData.twitter;
      if (formData.linkedin) socialLinks.linkedin = formData.linkedin;
      if (formData.github) socialLinks.github = formData.github;
      if (formData.facebook) socialLinks.facebook = formData.facebook;

      const payload: any = {
        name: formData.name,
        email: formData.email || null,
        bio: formData.bio || null,
        avatar: formData.avatar || null,
        website: formData.website || null,
        socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : null,
      };

      const url = author
        ? `/api/admin/authors/${author.id}`
        : "/api/admin/authors";
      const method = author ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save author");
      }

      router.push("/admin/authors");
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
            <h3 className="text-lg font-semibold text-[#111827]">Basic Information</h3>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#111827] mb-2"
              >
                Full Name *
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
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#111827] mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                placeholder="author@example.com"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-[#111827] mb-2"
              >
                Biography
              </label>
              <textarea
                id="bio"
                rows={5}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                placeholder="Write a brief biography about the author..."
              />
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-[#111827] mb-2"
              >
                Website
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-lg bg-white border border-[#E5E7EB] p-6 space-y-6">
            <h3 className="text-lg font-semibold text-[#111827]">Social Links</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-[#111827] mb-2"
                >
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-[#111827] mb-2"
                >
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label
                  htmlFor="github"
                  className="block text-sm font-medium text-[#111827] mb-2"
                >
                  GitHub
                </label>
                <input
                  type="url"
                  id="github"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label
                  htmlFor="facebook"
                  className="block text-sm font-medium text-[#111827] mb-2"
                >
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) =>
                    setFormData({ ...formData, facebook: e.target.value })
                  }
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-[#2563EB]"
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white border border-[#E5E7EB] p-6 space-y-6">
            <h3 className="text-lg font-semibold text-[#111827]">Profile Picture</h3>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Avatar
              </label>
              <ImageUpload
                value={formData.avatar || ""}
                onChange={(url) => setFormData({ ...formData, avatar: url })}
                folder="authors"
              />
              {formData.avatar && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border border-[#E5E7EB] bg-gray-100">
                    <Image
                      src={formData.avatar}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
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
          {loading ? "Saving..." : author ? "Update Author" : "Create Author"}
        </button>
      </div>
    </form>
  );
}
