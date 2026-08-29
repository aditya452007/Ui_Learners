"use client";

import { useState } from "react";
import { Alert } from "@/app/components/Alert";
import Link from "next/link";

const mockFiles = [
  { id: 1, name: "Project Alpha", type: "folder", size: "2.4 GB", modified: "Aug 28, 2026" },
  { id: 2, name: "Q3 Budget.xlsx", type: "spreadsheet", size: "1.2 MB", modified: "Aug 27, 2026" },
  { id: 3, name: "Design System.fig", type: "design", size: "45 MB", modified: "Aug 25, 2026" },
  { id: 4, name: "Old Archives", type: "folder", size: "12 GB", modified: "Jan 15, 2025" },
  { id: 5, name: "README.md", type: "document", size: "4 KB", modified: "Aug 29, 2026" },
];

export default function DeleteConfirmationScenario() {
  const [files] = useState(mockFiles);
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    targetFile: typeof mockFiles[0] | null;
    suppressed: boolean;
  }>({ isOpen: false, targetFile: null, suppressed: false });
  const [toasts, setToasts] = useState<string[]>([]);

  const openDeleteAlert = (file: typeof mockFiles[0]) => {
    if (alertState.suppressed) {
      deleteFile(file);
      return;
    }
    setAlertState({ isOpen: true, targetFile: file, suppressed: false });
  };

  const handleConfirmDelete = () => {
    if (alertState.targetFile) {
      deleteFile(alertState.targetFile);
    }
    setAlertState({ isOpen: false, targetFile: null, suppressed: alertState.suppressed });
  };

  const handleCancel = () => {
    setAlertState({ isOpen: false, targetFile: null, suppressed: alertState.suppressed });
  };

  const handleSuppressionChange = (checked: boolean) => {
    setAlertState(prev => ({ ...prev, suppressed: checked }));
  };

  const deleteFile = (file: typeof mockFiles[0]) => {
    setToasts(prev => [...prev, `Deleted "${file.name}"`]);
    setTimeout(() => setToasts(prev => prev.slice(1)), 3000);
  };

  const demoButtons = [
    { title: "Cancel", isCancel: true, onClick: handleCancel },
    { title: "Delete", isDefault: true, onClick: handleConfirmDelete },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                ← Back to Alert Hub
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Scenario 1: Delete Confirmation</h1>
                <p className="text-sm text-gray-500">File manager — warning style with suppression checkbox</p>
              </div>
            </div>
            <nav className="flex gap-3 text-sm">
              <Link href="/scenarios/unsaved-changes" className="text-gray-600 hover:text-gray-700">
                Next: Unsaved Changes →
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Why it fits */}
        <section className="mb-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Why it fits here</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Deleting files is destructive and irreversible. The <strong>warning style</strong> (yellow badge) signals
            caution without panic. The <strong>suppression checkbox</strong> respects power users who delete frequently —
            they check "Don't ask me again" once, and the app remembers via localStorage/UserDefaults.
            The <strong>default button</strong> is "Delete" (blue, Enter key) because the user initiated the action;
            "Cancel" gets Escape. This matches macOS conventions exactly.
          </p>
        </section>

        {/* File Manager UI */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Files</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{files.length} items</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Cloud synced</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg transition">
                  New Folder
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg transition">
                  Upload
                </button>
              </div>
              <div className="flex-1"></div>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search files..."
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* File list */}
            <div className="divide-y divide-gray-200">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
                    {file.type === "folder" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
                      </svg>
                    )}
                    {file.type === "spreadsheet" && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path stroke="white" strokeWidth="0.5" d="M8 10h8M8 14h8M8 18h5" />
                      </svg>
                    )}
                    {file.type === "design" && (
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l7 7-7 7-7-7 7-7zm0 2.5L17.5 12 12 17.5 6.5 12 12 6.5z" />
                      </svg>
                    )}
                    {file.type === "document" && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path stroke="white" strokeWidth="0.5" d="M8 10h8M8 14h8M8 18h5" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size} • Modified {file.modified}</p>
                  </div>
                  <button
                    onClick={() => openDeleteAlert(file)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    aria-label={`Delete ${file.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Toast notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {toasts.map((toast, i) => (
            <div
              key={i}
              className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right fade-in"
            >
              {toast}
            </div>
          ))}
        </div>

        {/* Live Alert */}
        <Alert
          isOpen={alertState.isOpen}
          onClose={handleCancel}
          style="warning"
          messageText={`Delete "${alertState.targetFile?.name}"?`}
          informativeText="This will permanently remove the file from your library. You can't undo this action."
          buttons={demoButtons}
          showsSuppressionButton={true}
          onSuppressionChange={handleSuppressionChange}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="text-sm text-gray-500 text-center">
            <Link href="/scenarios/unsaved-changes" className="text-blue-600 hover:underline font-medium">
              Next Scenario: Unsaved Changes →
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}