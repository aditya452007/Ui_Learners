"use client";

import { useState, useRef, useCallback } from "react";

type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
};

const FILE_TREE: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Button.tsx", type: "file" },
          { name: "Modal.tsx", type: "file" },
          { name: "Sidebar.tsx", type: "file" },
        ],
      },
      {
        name: "utils",
        type: "folder",
        children: [
          { name: "useAuth.ts", type: "file" },
          { name: "formatDate.ts", type: "file" },
          { name: "api.ts", type: "file" },
        ],
      },
      {
        name: "app",
        type: "folder",
        children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          { name: "globals.css", type: "file" },
        ],
      },
      { name: "index.ts", type: "file" },
    ],
  },
];

const FILE_CONTENTS: Record<string, string> = {
  "Button.tsx":
    `'use client';

import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={\`inline-flex items-center justify-center rounded-lg font-medium
        transition-colors focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-blue-500 disabled:pointer-events-none
        disabled:opacity-50 \${className}\`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size={size} /> : children}
    </button>
  );
}`,
  "useAuth.ts": `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUser(token).then(setUser).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const { token, user } = await res.json();
    localStorage.setItem('auth_token', token);
    setUser(user);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}`,
};

const ICONS: Record<string, string> = {
  folder: "📁",
  "folder-open": "📂",
  tsx: "⚛",
  ts: "🟦",
  css: "🎨",
};

function getFileIcon(name: string) {
  if (name.endsWith(".tsx")) return ICONS.tsx;
  if (name.endsWith(".ts")) return ICONS.ts;
  if (name.endsWith(".css")) return ICONS.css;
  return "📄";
}

function TreeNode({
  node,
  depth,
  selectedFile,
  expandedFolders,
  onSelect,
  onToggleFolder,
}: {
  node: FileNode;
  depth: number;
  selectedFile: string | null;
  expandedFolders: Set<string>;
  onSelect: (name: string) => void;
  onToggleFolder: (path: string) => void;
}) {
  const path = node.name;
  const isExpanded = expandedFolders.has(path);
  const isSelected = node.type === "file" && selectedFile === node.name;

  return (
    <div>
      <button
        onClick={() =>
          node.type === "folder"
            ? onToggleFolder(path)
            : onSelect(node.name)
        }
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors
          hover:bg-gray-100 ${
            isSelected
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700"
          }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <span className="w-4 text-center text-xs shrink-0">
          {node.type === "folder"
            ? isExpanded
              ? ICONS["folder-open"]
              : ICONS.folder
            : getFileIcon(node.name)}
        </span>
        <span className="truncate">{node.name}</span>
      </button>
      {node.type === "folder" &&
        isExpanded &&
        node.children?.map((child) => (
          <TreeNode
            key={child.name}
            node={child}
            depth={depth + 1}
            selectedFile={selectedFile}
            expandedFolders={expandedFolders}
            onSelect={onSelect}
            onToggleFolder={onToggleFolder}
          />
        ))}
    </div>
  );
}

function highlightSyntax(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const highlighted = line
      .replace(
        /\b(import|from|export|function|return|const|interface|extends|async|await|if|else|new|type)\b/g,
        '<span class="text-indigo-600 font-medium">$1</span>'
      )
      .replace(
        /\b(useState|useEffect|useCallback|useRef|console)\b/g,
        '<span class="text-amber-600">$1</span>'
      )
      .replace(
        /\b(string|number|boolean|null|true|false|void|any)\b/g,
        '<span class="text-emerald-600">$1</span>'
      )
      .replace(
        /(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g,
        '<span class="text-rose-500">$1$2$3</span>'
      )
      .replace(
        /(&lt;\/?[A-Z][a-zA-Z]*)/g,
        '<span class="text-sky-600">$1</span>'
      )
      .replace(
        /(\/\/.*$)/gm,
        '<span class="text-gray-400 italic">$1</span>'
      );

    return (
      <div key={i} className="flex">
        <span className="w-12 text-right pr-4 text-gray-300 select-none shrink-0 text-xs leading-6">
          {i + 1}
        </span>
        <span
          className="leading-6"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    );
  });
}

export default function CodeEditorScenario() {
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>("Button.tsx");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["src", "components", "utils"])
  );
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true;
      startX.current = e.clientX;
      startWidth.current = sidebarWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [sidebarWidth]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    const newWidth = Math.max(180, Math.min(500, startWidth.current + delta));
    setSidebarWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const content = selectedFile
    ? FILE_CONTENTS[selectedFile] || `// ${selectedFile} content`
    : "// Select a file from the sidebar";

  return (
    <div
      className="h-screen flex flex-col bg-white font-[family-name:var(--font-geist-sans)]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <header className="h-11 border-b border-gray-200 flex items-center px-4 gap-3 shrink-0 bg-gray-50/80">
        <span className="font-mono text-xs text-gray-500 tracking-wide">
          SPLIT VIEW
        </span>
        <span className="text-gray-300">·</span>
        <h1 className="text-sm font-medium text-gray-800">Code Editor</h1>
        <div className="ml-auto flex items-center gap-1">
          <button className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
            Save
          </button>
          <button className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
            Copy
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <div
          className={`shrink-0 border-r border-gray-200 flex flex-col bg-gray-50/50 transition-all duration-200 ${
            collapsed ? "w-10" : ""
          }`}
          style={collapsed ? {} : { width: sidebarWidth }}
        >
          <div className="h-9 flex items-center justify-between px-3 border-b border-gray-100 shrink-0">
            {!collapsed && (
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Explorer
              </span>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`transition-transform duration-200 ${
                  collapsed ? "rotate-180" : ""
                }`}
              >
                <path d="M10 4L6 8L10 12" />
              </svg>
            </button>
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-y-auto py-1">
              {FILE_TREE.map((node) => (
                <TreeNode
                  key={node.name}
                  node={node}
                  depth={0}
                  selectedFile={selectedFile}
                  expandedFolders={expandedFolders}
                  onSelect={setSelectedFile}
                  onToggleFolder={toggleFolder}
                />
              ))}
            </div>
          )}
        </div>

        {!collapsed && (
          <div
            className="w-1 bg-transparent hover:bg-blue-400 active:bg-blue-500 cursor-col-resize shrink-0 transition-colors"
            onMouseDown={handleMouseDown}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-9 flex items-center gap-2 px-4 border-b border-gray-200 shrink-0 bg-white">
            <span className="text-sm font-mono text-gray-700">
              {selectedFile || "untitled"}
            </span>
            <span className="ml-auto text-xs text-gray-400">
              {selectedFile?.endsWith(".tsx") ? "TypeScript React" : "TypeScript"}
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-6 text-gray-800 bg-white">
            {highlightSyntax(content)}
          </div>
        </div>
      </div>

      <footer className="h-8 border-t border-gray-200 flex items-center px-4 bg-gray-50/80 shrink-0">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <a
            href="/"
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            ← Back to Split View Hub
          </a>
          <span>·</span>
          <a
            href="/scenarios/email-client"
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            Email Client →
          </a>
        </div>
      </footer>
    </div>
  );
}
