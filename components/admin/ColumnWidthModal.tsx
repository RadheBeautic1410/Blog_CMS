"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ColumnWidthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (width: string) => void;
  currentWidth?: string;
}

export default function ColumnWidthModal({
  isOpen,
  onClose,
  onApply,
  currentWidth = "auto",
}: ColumnWidthModalProps) {
  const [width, setWidth] = useState("auto");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setWidth(currentWidth || "auto");
      setError("");
    }
  }, [isOpen, currentWidth]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError("");

    const trimmedWidth = width.trim();
    
    if (!trimmedWidth) {
      setError("Please enter a width value");
      return;
    }

    // Validate width format (px, %, em, rem, or auto)
    if (trimmedWidth !== "auto" && !trimmedWidth.match(/^\d+(\.\d+)?(px|%|em|rem)$/)) {
      setError("Please enter a valid width (e.g., 100px, 20%, 10em, auto)");
      return;
    }

    onApply(trimmedWidth);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Change Column Width</h2>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="column-width" className="block text-sm font-medium text-gray-700 mb-1">
                Column Width <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="column-width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="e.g., 100px, 20%, auto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter width in pixels (px), percentage (%), em, rem, or "auto" for automatic width
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWidth("auto")}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setWidth("100px")}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                100px
              </button>
              <button
                type="button"
                onClick={() => setWidth("150px")}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                150px
              </button>
              <button
                type="button"
                onClick={() => setWidth("200px")}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                200px
              </button>
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
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal to avoid nested form issues
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}
