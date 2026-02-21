"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface TableStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (styles: {
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    backgroundColor?: string;
    headerBackgroundColor?: string;
    applyTo: "table" | "row" | "cell";
  }) => void;
  currentStyles?: {
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    backgroundColor?: string;
  };
}

export default function TableStyleModal({
  isOpen,
  onClose,
  onApply,
  currentStyles = {},
}: TableStyleModalProps) {
  const [borderColor, setBorderColor] = useState("#ddd");
  const [borderWidth, setBorderWidth] = useState("1px");
  const [borderRadius, setBorderRadius] = useState("0px");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("");
  const [applyTo, setApplyTo] = useState<"table" | "row" | "cell">("table");

  // Only reset state when modal opens, not when currentStyles changes
  useEffect(() => {
    if (isOpen) {
      setBorderColor(currentStyles.borderColor || "#ddd");
      setBorderWidth(currentStyles.borderWidth || "1px");
      setBorderRadius(currentStyles.borderRadius || "0px");
      setBackgroundColor(currentStyles.backgroundColor || "");
      setHeaderBackgroundColor("");
      setApplyTo("table");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = () => {
    onApply({
      borderColor,
      borderWidth,
      borderRadius,
      backgroundColor,
      headerBackgroundColor,
      applyTo,
    });
    onClose();
  };

  const presetBorderWidths = ["1px", "2px", "3px", "4px", "5px"];
  const presetBorderRadius = ["0px", "4px", "8px", "12px", "16px"];

  const commonColors = [
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
    "#FF0000", "#FF6600", "#FFCC00", "#33CC00", "#0066FF", "#6600FF",
    "#FF00FF", "#FF0099", "#FF3366", "#FF9900", "#FFFF00", "#99FF00",
    "#00FF00", "#00FF99", "#00FFFF", "#0099FF", "#0066FF", "#3300FF",
  ];

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Style Table</h2>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-6">
            {/* Apply To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apply Style To
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setApplyTo("table")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    applyTo === "table"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Entire Table
                </button>
                <button
                  type="button"
                  onClick={() => setApplyTo("row")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    applyTo === "row"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Selected Row
                </button>
                <button
                  type="button"
                  onClick={() => setApplyTo("cell")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    applyTo === "cell"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Selected Cell
                </button>
              </div>
            </div>

            {/* Border Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  placeholder="#ddd"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-2 grid grid-cols-6 gap-1">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setBorderColor(color)}
                    className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Border Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Width
              </label>
              <div className="flex gap-2 flex-wrap">
                {presetBorderWidths.map((width) => (
                  <button
                    key={width}
                    type="button"
                    onClick={() => setBorderWidth(width)}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                      borderWidth === width
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {width}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={borderWidth}
                onChange={(e) => setBorderWidth(e.target.value)}
                placeholder="e.g., 2px, 3px"
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Radius
              </label>
              <div className="flex gap-2 flex-wrap">
                {presetBorderRadius.map((radius) => (
                  <button
                    key={radius}
                    type="button"
                    onClick={() => setBorderRadius(radius)}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                      borderRadius === radius
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {radius === "0px" ? "None" : radius}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                placeholder="e.g., 8px, 12px"
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={backgroundColor || "#ffffff"}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="Leave empty for transparent"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setBackgroundColor("")}
                  className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Clear
                </button>
              </div>
              <div className="mt-2 grid grid-cols-6 gap-1">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setBackgroundColor(color)}
                    className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Header Background Color (only for table) */}
            {applyTo === "table" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Row Background Color (Optional)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={headerBackgroundColor || "#ffffff"}
                    onChange={(e) => setHeaderBackgroundColor(e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={headerBackgroundColor}
                    onChange={(e) => setHeaderBackgroundColor(e.target.value)}
                    placeholder="Leave empty to use table background"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setHeaderBackgroundColor("")}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>
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
              Apply Styles
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}
