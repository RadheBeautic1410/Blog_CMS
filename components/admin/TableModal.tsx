"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number) => void;
}

export default function TableModal({
  isOpen,
  onClose,
  onInsert,
}: TableModalProps) {
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("3");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRows("3");
      setCols("3");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError("");

    const rowCount = parseInt(rows);
    const colCount = parseInt(cols);

    if (isNaN(rowCount) || isNaN(colCount) || rowCount < 1 || colCount < 1) {
      setError("Please enter valid numbers (1 or greater) for rows and columns");
      return;
    }

    if (rowCount > 20 || colCount > 20) {
      setError("Maximum 20 rows and 20 columns allowed");
      return;
    }

    onInsert(rowCount, colCount);
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
          <h2 className="text-xl font-semibold text-gray-900">Insert Table</h2>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="table-rows" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rows <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="table-rows"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="table-cols" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Columns <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="table-cols"
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
              Insert Table
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
