"use client";

import { useRef, useEffect, useState } from "react";
import MediaLibraryModal from "./MediaLibraryModal";
import LinkModal from "./LinkModal";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState<"text" | "bg" | null>(null);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedFontFamily, setSelectedFontFamily] = useState("");
  const [selectedFontSize, setSelectedFontSize] = useState("");
  const [selectedListType, setSelectedListType] = useState("");
  const [selectedBulletStyle, setSelectedBulletStyle] = useState("");
  const [selectedNumberStyle, setSelectedNumberStyle] = useState("");
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkModalUrl, setLinkModalUrl] = useState("");
  const [linkModalText, setLinkModalText] = useState("");
  const [activeButtons, setActiveButtons] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    superscript: false,
    subscript: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !htmlMode) {
      editorRef.current.innerHTML = value;
    }
  }, [value, htmlMode]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showColorPicker) {
        const target = event.target as HTMLElement;
        if (!target.closest('.color-picker-container')) {
          setShowColorPicker(null);
        }
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  const handleInput = () => {
    if (editorRef.current && !htmlMode) {
      onChange(editorRef.current.innerHTML);
      updateSelectedValues();
    }
  };

  const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana",
    "Georgia", "Palatino", "Garamond", "Comic Sans MS", "Trebuchet MS",
  ];

  const fontSizes = ["8", "10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"];

  const updateSelectedValues = () => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let node = range.commonAncestorContainer;
      
      // Reset values first
      setSelectedFormat("");
      setSelectedFontFamily("");
      setSelectedFontSize("");
      setSelectedListType("");
      setSelectedBulletStyle("");
      setSelectedNumberStyle("");
      
      // Check active formatting states
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isStrikethrough = document.queryCommandState('strikeThrough');
      const isSuperscript = document.queryCommandState('superscript');
      const isSubscript = document.queryCommandState('subscript');
      
      setActiveButtons({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strikethrough: isStrikethrough,
        superscript: isSuperscript,
        subscript: isSubscript,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
        justifyFull: false,
      });
      
      // Check text alignment
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const textAlign = window.getComputedStyle(el).textAlign;
        setActiveButtons(prev => ({
          ...prev,
          justifyLeft: textAlign === 'left',
          justifyCenter: textAlign === 'center',
          justifyRight: textAlign === 'right',
          justifyFull: textAlign === 'justify',
        }));
      }
      
      // Find the block element
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          const tagName = el.tagName.toLowerCase();
          
          // Check format
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'blockquote'].includes(tagName)) {
            setSelectedFormat(tagName);
          }
          
          // Check text alignment from block element
          const textAlign = window.getComputedStyle(el).textAlign;
          setActiveButtons(prev => ({
            ...prev,
            justifyLeft: textAlign === 'left',
            justifyCenter: textAlign === 'center',
            justifyRight: textAlign === 'right',
            justifyFull: textAlign === 'justify',
          }));
          
          // Check font family
          const fontFamily = window.getComputedStyle(el).fontFamily;
          if (fontFamily) {
            const matchedFont = fontFamilies.find(f => fontFamily.includes(f));
            if (matchedFont) setSelectedFontFamily(matchedFont);
          }
          
          // Check font size
          const fontSize = window.getComputedStyle(el).fontSize;
          if (fontSize) {
            const sizeMatch = fontSize.match(/(\d+)px/);
            if (sizeMatch) {
              const size = sizeMatch[1];
              if (fontSizes.includes(size)) setSelectedFontSize(size);
            }
          }
          
          // Check list type
          if (tagName === 'ul') {
            setSelectedListType('ul');
            const listStyle = window.getComputedStyle(el).listStyleType;
            if (listStyle && listStyle !== 'disc') {
              setSelectedBulletStyle(listStyle);
            } else {
              setSelectedBulletStyle('disc');
            }
          } else if (tagName === 'ol') {
            setSelectedListType('ol');
            const listStyle = window.getComputedStyle(el).listStyleType;
            if (listStyle && listStyle !== 'decimal') {
              setSelectedNumberStyle(listStyle);
            } else {
              setSelectedNumberStyle('decimal');
            }
          }
        }
        const parent = node.parentNode;
        if (!parent) break;
        node = parent;
      }
    }
  };

  // Update selected values when selection changes
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleSelectionChange = () => {
      updateSelectedValues();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    editor.addEventListener('mouseup', handleSelectionChange);
    editor.addEventListener('keyup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      editor.removeEventListener('mouseup', handleSelectionChange);
      editor.removeEventListener('keyup', handleSelectionChange);
    };
  }, []);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleImageSelect = (url: string, alt?: string) => {
    console.log('handleImageSelect called with:', url, alt);
    if (!editorRef.current) {
      console.error('Editor ref is null');
      return;
    }
    
    // Ensure editor has focus
    editorRef.current.focus();
    
    // Wait a bit for focus to be established
    setTimeout(() => {
      if (!editorRef.current) {
        console.error('Editor ref is null in timeout');
        return;
      }
      
      const selection = window.getSelection();
      let range: Range | null = null;
      
      // Try to get existing selection
      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        // Check if range is within the editor
        if (!editorRef.current.contains(range.commonAncestorContainer)) {
          console.log('Range not in editor, creating new range');
          range = null;
        }
      }
      
      // If no valid range, create one at the end of editor content
      if (!range) {
        range = document.createRange();
        const editor = editorRef.current;
        
        // Try to find the last text node or create a range at the end
        if (editor.lastChild) {
          range.setStartAfter(editor.lastChild);
          range.setEndAfter(editor.lastChild);
        } else {
          range.setStart(editor, 0);
          range.setEnd(editor, 0);
        }
        
        // Update selection
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      
      // Create image element
      const img = document.createElement("img");
      img.src = url;
      if (alt) {
        img.alt = alt;
      }
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.display = "block";
      img.style.margin = "10px 0";
      
      // Insert image
      try {
        range.deleteContents();
        range.insertNode(img);
        console.log('Image inserted successfully');
        
        // Add a line break after image for better editing
        const br = document.createElement("br");
        range.setStartAfter(img);
        range.collapse(true);
        range.insertNode(br);
        
        // Move cursor after the line break
        range.setStartAfter(br);
        range.collapse(true);
        
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch (error) {
        console.error("Error inserting image:", error);
        // Fallback: append to editor
        editorRef.current.appendChild(img);
        const br = document.createElement("br");
        editorRef.current.appendChild(br);
      }
      
      editorRef.current.focus();
      handleInput();
    }, 100);
  };

  const toggleHtmlMode = () => {
    if (!htmlMode) {
      // Switch to HTML mode
      setHtmlContent(editorRef.current?.innerHTML || "");
      setHtmlMode(true);
    } else {
      // Switch back to visual mode
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent;
        onChange(htmlContent);
      }
      setHtmlMode(false);
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(e.target.value);
    if (editorRef.current) {
      editorRef.current.innerHTML = e.target.value;
      onChange(e.target.value);
    }
  };

  const insertTable = () => {
    const rows = prompt("Number of rows:", "3");
    const cols = prompt("Number of columns:", "3");
    if (rows && cols && editorRef.current) {
      const rowCount = parseInt(rows);
      const colCount = parseInt(cols);
      
      if (isNaN(rowCount) || isNaN(colCount) || rowCount < 1 || colCount < 1) {
        alert("Please enter valid numbers for rows and columns");
        return;
      }

      let table = "<table border='1' style='border-collapse: collapse; width: 100%; margin: 10px 0;'>";
      for (let i = 0; i < rowCount; i++) {
        table += "<tr>";
        for (let j = 0; j < colCount; j++) {
          table += "<td style='padding: 8px; border: 1px solid #ddd;'>&nbsp;</td>";
        }
        table += "</tr>";
      }
      table += "</table>";

      // Insert HTML directly at cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = table;
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        range.insertNode(fragment);
        
        // Move cursor after the table
        range.setStartAfter(fragment.lastChild || fragment);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // If no selection, append to end
        if (editorRef.current) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = table;
          while (tempDiv.firstChild) {
            editorRef.current.appendChild(tempDiv.firstChild);
          }
        }
      }
      
      editorRef.current?.focus();
      handleInput();
    }
  };

  const insertVideo = () => {
    const url = prompt("Enter video URL (YouTube, Vimeo, etc.):");
    if (url) {
      const videoHtml = `<iframe width="560" height="315" src="${url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      execCommand("insertHTML", videoHtml);
    }
  };

  const handleOpenLinkModal = () => {
    const selection = window.getSelection();
    let url = "";
    let text = "";

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Get selected text
      text = selection.toString();

      // Check if selection is inside an existing link
      let node = range.commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode as Node;
      }
      
      const linkElement = (node as Element).closest?.("a");
      if (linkElement) {
        url = linkElement.getAttribute("href") || "";
        // If no text was selected, use the link's text content
        if (!text) {
          text = linkElement.textContent || "";
        }
      }
    }

    setLinkModalUrl(url);
    setLinkModalText(text);
    setShowLinkModal(true);
  };

  const handleInsertLink = (url: string, text?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      // If no selection, insert link at cursor
      const linkText = text || url;
      const linkHtml = `<a href="${url}">${linkText}</a>`;
      execCommand("insertHTML", linkHtml);
      handleInput();
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    // Check if selection is inside an existing link
    let node = range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode as Node;
    }
    
    const linkElement = (node as Element).closest?.("a");
    if (linkElement) {
      // Update existing link
      linkElement.setAttribute("href", url);
      if (text) {
        linkElement.textContent = text;
      }
      handleInput();
      return;
    }

    // If there's selected text, wrap it in a link
    if (selectedText) {
      const linkText = text || selectedText;
      const linkHtml = `<a href="${url}">${linkText}</a>`;
      
      try {
        range.deleteContents();
        execCommand("insertHTML", linkHtml);
        handleInput();
      } catch (e) {
        // Fallback: use createLink and then update text if needed
        execCommand("createLink", url);
        if (text && text !== selectedText) {
          // Update the link text if different
          setTimeout(() => {
            const newSelection = window.getSelection();
            if (newSelection && newSelection.rangeCount > 0) {
              const newRange = newSelection.getRangeAt(0);
              let linkNode = newRange.commonAncestorContainer;
              if (linkNode.nodeType === Node.TEXT_NODE) {
                linkNode = linkNode.parentNode as Node;
              }
              const newLinkElement = (linkNode as Element).closest?.("a");
              if (newLinkElement) {
                newLinkElement.textContent = linkText;
                handleInput();
              }
            }
          }, 0);
        } else {
          handleInput();
        }
      }
    } else {
      // No selected text, insert link with provided text or URL
      const linkText = text || url;
      const linkHtml = `<a href="${url}">${linkText}</a>`;
      execCommand("insertHTML", linkHtml);
      handleInput();
    }
  };

  const ToolbarButton = ({
    onClick,
    title,
    children,
    active = false,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active 
          ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]" 
          : "hover:bg-gray-200"
      }`}
      title={title}
    >
      {children}
    </button>
  );

  const ColorPicker = ({ type }: { type: "text" }) => {
    const colors = [
      "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
      "#FF0000", "#FF6600", "#FFCC00", "#33CC00", "#0066FF", "#6600FF",
      "#FF00FF", "#FF0099", "#FF3366", "#FF9900", "#FFFF00", "#99FF00",
      "#00FF00", "#00FF99", "#00FFFF", "#0099FF", "#0066FF", "#3300FF",
      "#9900FF", "#FF00CC", "#FF0066", "#FF3300", "#FF9933", "#FFCC33",
    ];

    return (
      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 z-50 grid grid-cols-6 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => {
              execCommand("foreColor", color);
              setShowColorPicker(null);
            }}
            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="rich-text-editor border border-[#E5E7EB] rounded-md overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
        {/* First Row */}
        <div className="flex items-center gap-1 p-2 flex-wrap border-b border-[#E5E7EB]">
          {/* Undo/Redo */}
          <ToolbarButton onClick={() => execCommand("undo")} title="Undo">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("redo")} title="Redo">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </ToolbarButton>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />
          
          {/* Format Block Dropdown */}
          <div className="relative">
            <select
              value={selectedFormat || ""}
              onChange={(e) => {
                if (e.target.value) {
                  execCommand("formatBlock", e.target.value);
                  setSelectedFormat(e.target.value);
                }
              }}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50"
              title="Format"
            >
              <option value="">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="h5">Heading 5</option>
              <option value="h6">Heading 6</option>
              <option value="p">Paragraph</option>
              <option value="pre">Preformatted</option>
            </select>
          </div>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* Font Family */}
          <div className="relative">
            <select
              value={selectedFontFamily || ""}
              onChange={(e) => {
                if (e.target.value) {
                  execCommand("fontName", e.target.value);
                  setSelectedFontFamily(e.target.value);
                }
              }}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 min-w-[120px]"
              title="Font Family"
            >
              <option value="">Font Family</option>
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div className="relative">
            <select
              value={selectedFontSize || ""}
              onChange={(e) => {
                if (e.target.value) {
                  execCommand("fontSize", e.target.value);
                  setSelectedFontSize(e.target.value);
                }
              }}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50"
              title="Font Size"
            >
              <option value="">Size</option>
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* Text Color */}
          <div className="relative color-picker-container">
            <ToolbarButton
              onClick={() => setShowColorPicker(showColorPicker === "text" ? null : "text")}
              title="Text Color"
              active={showColorPicker === "text"}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </ToolbarButton>
            {showColorPicker === "text" && <ColorPicker type="text" />}
          </div>

          {/* Background Color */}
          <div className="relative color-picker-container">
            <ToolbarButton
              onClick={() => setShowColorPicker(showColorPicker === "bg" ? null : "bg")}
              title="Background Color"
              active={showColorPicker === "bg"}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </ToolbarButton>
            {showColorPicker === "bg" && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 z-50 grid grid-cols-6 gap-1">
                {[
                  "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
                  "#FF0000", "#FF6600", "#FFCC00", "#33CC00", "#0066FF", "#6600FF",
                  "#FF00FF", "#FF0099", "#FF3366", "#FF9900", "#FFFF00", "#99FF00",
                  "#00FF00", "#00FF99", "#00FFFF", "#0099FF", "#0066FF", "#3300FF",
                  "#9900FF", "#FF00CC", "#FF0066", "#FF3300", "#FF9933", "#FFCC33",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      // Apply background color by wrapping in a span
                      const selection = window.getSelection();
                      if (selection && selection.rangeCount > 0 && editorRef.current) {
                        const range = selection.getRangeAt(0);
                        if (!range.collapsed) {
                          // If text is selected, wrap it in a span with background color
                          const span = document.createElement("span");
                          span.style.backgroundColor = color;
                          span.style.padding = "2px 4px";
                          try {
                            range.surroundContents(span);
                          } catch (e) {
                            // If surroundContents fails, extract and wrap
                            const contents = range.extractContents();
                            span.appendChild(contents);
                            range.insertNode(span);
                          }
                        } else {
                          // If no selection, insert a span at cursor
                          const span = document.createElement("span");
                          span.style.backgroundColor = color;
                          span.style.padding = "2px 4px";
                          span.innerHTML = "&nbsp;";
                          range.insertNode(span);
                          range.setStartAfter(span);
                          range.collapse(true);
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        editorRef.current.focus();
                        handleInput();
                      } else {
                        // Fallback to execCommand
                        execCommand("backColor", color);
                      }
                      setShowColorPicker(null);
                    }}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* Text Formatting */}
          <ToolbarButton 
            onClick={() => {
              execCommand("bold");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Bold"
            active={activeButtons.bold}
          >
            <strong className="text-sm">B</strong>
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              execCommand("italic");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Italic"
            active={activeButtons.italic}
          >
            <em className="text-sm">I</em>
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              execCommand("underline");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Underline"
            active={activeButtons.underline}
          >
            <u className="text-sm">U</u>
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              execCommand("strikeThrough");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Strikethrough"
            active={activeButtons.strikethrough}
          >
            <span className="text-sm line-through">S</span>
          </ToolbarButton>
        </div>

        {/* Second Row */}
        <div className="flex items-center gap-1 p-2 flex-wrap">
          {/* Superscript/Subscript */}
          <ToolbarButton 
            onClick={() => {
              execCommand("superscript");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Superscript"
            active={activeButtons.superscript}
          >
            <span className="text-xs">X²</span>
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              execCommand("subscript");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Subscript"
            active={activeButtons.subscript}
          >
            <span className="text-xs">X₂</span>
          </ToolbarButton>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* Code */}
          <ToolbarButton onClick={() => execCommand("formatBlock", "pre")} title="Code">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </ToolbarButton>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* Link */}
          <ToolbarButton
            onClick={handleOpenLinkModal}
            title="Insert Link"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </ToolbarButton>

          {/* Image */}
          <ToolbarButton
            onClick={() => setShowMediaModal(true)}
            title="Insert Image"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </ToolbarButton>

          {/* Video */}
          <ToolbarButton onClick={insertVideo} title="Insert Video">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </ToolbarButton>

          {/* Table */}
          <ToolbarButton onClick={insertTable} title="Insert Table">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </ToolbarButton>

          {/* Quote */}
          <ToolbarButton onClick={() => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0 && editorRef.current) {
              const range = selection.getRangeAt(0);
              
              // Check if we're already in a blockquote
              let blockquote = range.commonAncestorContainer;
              while (blockquote && blockquote !== editorRef.current) {
                if (blockquote.nodeType === Node.ELEMENT_NODE && (blockquote as Element).tagName === 'BLOCKQUOTE') {
                  // Unwrap blockquote
                  const parent = blockquote.parentNode;
                  if (parent) {
                    while (blockquote.firstChild) {
                      parent.insertBefore(blockquote.firstChild, blockquote);
                    }
                    parent.removeChild(blockquote);
                  }
                  editorRef.current?.focus();
                  handleInput();
                  return;
                }
                const parent = blockquote.parentNode;
                if (!parent) break;
                blockquote = parent;
              }
              
              // Wrap in blockquote
              try {
                // If there's selected text, wrap it
                if (!range.collapsed) {
                  const blockquote = document.createElement("blockquote");
                  blockquote.style.margin = "10px 0";
                  blockquote.style.padding = "10px 20px";
                  blockquote.style.borderLeft = "4px solid #2563EB";
                  blockquote.style.backgroundColor = "#F9FAFB";
                  blockquote.style.fontStyle = "italic";
                  
                  try {
                    range.surroundContents(blockquote);
                  } catch (e) {
                    // If surroundContents fails, extract and wrap
                    const contents = range.extractContents();
                    blockquote.appendChild(contents);
                    range.insertNode(blockquote);
                  }
                } else {
                  // If no selection, insert a new blockquote
                  const blockquote = document.createElement("blockquote");
                  blockquote.style.margin = "10px 0";
                  blockquote.style.padding = "10px 20px";
                  blockquote.style.borderLeft = "4px solid #2563EB";
                  blockquote.style.backgroundColor = "#F9FAFB";
                  blockquote.style.fontStyle = "italic";
                  blockquote.innerHTML = "<br>";
                  
                  range.insertNode(blockquote);
                  range.setStart(blockquote, 0);
                  range.collapse(true);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
                editorRef.current?.focus();
                handleInput();
              } catch (e) {
                // Fallback to execCommand
                execCommand("formatBlock", "blockquote");
              }
            } else {
              // Fallback if no selection
              execCommand("formatBlock", "blockquote");
            }
          }} title="Quote">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </ToolbarButton>

          {/* Code Block */}
          <ToolbarButton onClick={() => execCommand("formatBlock", "pre")} title="Code Block">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </ToolbarButton>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* HTML View */}
          <ToolbarButton onClick={toggleHtmlMode} title="HTML View" active={htmlMode}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </ToolbarButton>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* Alignment */}
          <ToolbarButton 
            onClick={() => {
              execCommand("justifyLeft");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Align Left"
            active={activeButtons.justifyLeft}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 6h18M3 18h18" />
            </svg>
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              execCommand("justifyCenter");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Align Center"
            active={activeButtons.justifyCenter}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M6 14h12M3 6h18M3 18h18" />
            </svg>
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              execCommand("justifyRight");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Align Right"
            active={activeButtons.justifyRight}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M9 14h12M3 6h18M3 18h18" />
            </svg>
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              execCommand("justifyFull");
              setTimeout(updateSelectedValues, 10);
            }} 
            title="Justify"
            active={activeButtons.justifyFull}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 6h18M3 18h18" />
            </svg>
          </ToolbarButton>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* Lists */}
          <div className="relative">
            <select
              value={selectedListType || ""}
              onChange={(e) => {
                if (!e.target.value) return;
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0 && editorRef.current) {
                  const range = selection.getRangeAt(0);
                  const listType = e.target.value;
                  
                  // Check if we're in a list
                  let listElement = range.commonAncestorContainer;
                  while (listElement && listElement !== editorRef.current) {
                    if (listElement.nodeType === Node.ELEMENT_NODE) {
                      const el = listElement as Element;
                      if (el.tagName === 'UL' || el.tagName === 'OL') {
                        // Change list type
                        if (listType === 'none') {
                          // Remove list
                          const parent = el.parentNode;
                          if (parent) {
                            while (el.firstChild) {
                              const li = el.firstChild;
                              const p = document.createElement('p');
                              p.appendChild(li.cloneNode(true));
                              parent.insertBefore(p, el);
                              el.removeChild(li);
                            }
                            parent.removeChild(el);
                          }
                          setSelectedListType("");
                          setSelectedBulletStyle("");
                          setSelectedNumberStyle("");
                        } else {
                          // Change to new list type
                          const newList = document.createElement(listType === 'ul' ? 'ul' : 'ol');
                          while (el.firstChild) {
                            newList.appendChild(el.firstChild);
                          }
                          el.parentNode?.replaceChild(newList, el);
                          setSelectedListType(listType);
                        }
                        editorRef.current.focus();
                        handleInput();
                        return;
                      }
                    }
                    const parent = listElement.parentNode;
                    if (!parent) break;
                    listElement = parent;
                  }
                  
                  // Not in a list, create new one
                  if (listType !== 'none') {
                    execCommand(listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
                    setSelectedListType(listType);
                  }
                } else {
                  if (e.target.value !== 'none') {
                    execCommand(e.target.value === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
                    setSelectedListType(e.target.value);
                  }
                }
              }}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50"
              title="List Type"
            >
              <option value="">List</option>
              <option value="ul">Bullet List</option>
              <option value="ol">Numbered List</option>
              <option value="none">Remove List</option>
            </select>
          </div>
          
          {/* List Style (for bullet lists) */}
          <div className="relative">
            <select
              value={selectedBulletStyle || ""}
              onChange={(e) => {
                if (!e.target.value) return;
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0 && editorRef.current) {
                  const range = selection.getRangeAt(0);
                  let listElement = range.commonAncestorContainer;
                  while (listElement && listElement !== editorRef.current) {
                    if (listElement.nodeType === Node.ELEMENT_NODE) {
                      const el = listElement as HTMLElement;
                      if (el.tagName === 'UL') {
                        el.style.listStyleType = e.target.value;
                        setSelectedBulletStyle(e.target.value);
                        editorRef.current.focus();
                        handleInput();
                        return;
                      }
                    }
                    const parent = listElement.parentNode;
                    if (!parent) break;
                    listElement = parent;
                  }
                }
              }}
              disabled={selectedListType !== "ul"}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Bullet Style"
            >
              <option value="">Bullet Style</option>
              <option value="disc">● Disc</option>
              <option value="circle">○ Circle</option>
              <option value="square">■ Square</option>
              <option value="none">None</option>
            </select>
          </div>
          
          {/* Numbered List Style */}
          <div className="relative">
            <select
              value={selectedNumberStyle || ""}
              onChange={(e) => {
                if (!e.target.value) return;
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0 && editorRef.current) {
                  const range = selection.getRangeAt(0);
                  let listElement = range.commonAncestorContainer;
                  while (listElement && listElement !== editorRef.current) {
                    if (listElement.nodeType === Node.ELEMENT_NODE) {
                      const el = listElement as HTMLElement;
                      if (el.tagName === 'OL') {
                        el.style.listStyleType = e.target.value;
                        setSelectedNumberStyle(e.target.value);
                        editorRef.current.focus();
                        handleInput();
                        return;
                      }
                    }
                    const parent = listElement.parentNode;
                    if (!parent) break;
                    listElement = parent;
                  }
                }
              }}
              disabled={selectedListType !== "ol"}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Number Style"
            >
              <option value="">Number Style</option>
              <option value="decimal">1, 2, 3</option>
              <option value="lower-alpha">a, b, c</option>
              <option value="upper-alpha">A, B, C</option>
              <option value="lower-roman">i, ii, iii</option>
              <option value="upper-roman">I, II, III</option>
            </select>
          </div>
          <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

          {/* Indent/Outdent */}
          <ToolbarButton onClick={() => execCommand("outdent")} title="Decrease Indent">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12H3m18 0l-4-4m4 4l-4 4" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("indent")} title="Increase Indent">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18m-18 0l4 4m-4-4l4-4" />
            </svg>
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      {htmlMode ? (
        <textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          className="w-full min-h-[300px] p-4 border-0 focus:outline-none font-mono text-sm"
          placeholder="HTML code..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[300px] p-4 focus:outline-none"
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      )}

      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelect={handleImageSelect}
      />
      <LinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsert={handleInsertLink}
        initialUrl={linkModalUrl}
        initialText={linkModalText}
      />
    </div>
  );
}
