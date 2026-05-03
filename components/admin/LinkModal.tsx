"use client";

import { useState, useEffect } from "react";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
}

export default function LinkModal({
  isOpen,
  onClose,
  onInsert,
  initialUrl = "",
  initialText = "",
}: LinkModalProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setError("");
    } else {
      // Reset state when modal closes
      setUrl("");
      setText("");
      setError("");
    }
  }, [isOpen, initialUrl, initialText]);

  /** Must not use a nested <form> — this modal lives inside the blog <form> and would break submit / insert. */
  const handleApply = () => {
    setError("");

    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.match(/^https?:\/\//i)) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      new URL(finalUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    onInsert(finalUrl, text.trim() || undefined);
    onClose();
  };

  const stopEnterSubmittingParentForm = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Insert Link</h2>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-1">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="link-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={stopEnterSubmittingParentForm}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="link-text" className="block text-sm font-medium text-gray-700 mb-1">
                Link Text (optional)
              </label>
              <input
                type="text"
                id="link-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={stopEnterSubmittingParentForm}
                placeholder="Link text (leave empty to use selected text)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                If left empty, the selected text will be used as the link text
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Insert Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
