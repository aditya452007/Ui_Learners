"use client";

import { useState, useRef, useEffect } from "react";
import { Alert } from "@/app/components/Alert";
import Link from "next/link";

export default function UnsavedChangesScenario() {
  const [content, setContent] = useState(`# Project Proposal

## Overview
This document outlines the proposed features for Q4.

## Goals
- Improve user onboarding flow
- Reduce checkout friction by 40%
- Launch dark mode support

## Timeline
- **Week 1-2**: Research & wireframes
- **Week 3-4**: High-fidelity designs
- **Week 5-8**: Implementation
- **Week 9**: QA & launch

## Notes
- Need stakeholder approval by Friday
- Budget: $15,000 allocated
- Team: 2 designers, 3 engineers`);

  const [hasChanges, setHasChanges] = useState(false);
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    action: "new" | "open" | "close" | null;
  }>({ isOpen: false, action: null });
  const [toasts, setToasts] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  const triggerAlert = (action: "new" | "open" | "close") => {
    if (!hasChanges) {
      performAction(action);
      return;
    }
    setAlertState({ isOpen: true, action });
  };

  const handleSave = () => {
    setHasChanges(false);
    setAlertState({ isOpen: false, action: null });
    setToasts(prev => [...prev, "Document saved"]);
    setTimeout(() => setToasts(prev => prev.slice(1)), 2000);
  };

  const handleDontSave = () => {
    setHasChanges(false);
    performAction(alertState.action);
    setAlertState({ isOpen: false, action: null });
    setToasts(prev => [...prev, "Changes discarded"]);
    setTimeout(() => setToasts(prev => prev.slice(1)), 2000);
  };

  const handleCancelAction = () => {
    setAlertState({ isOpen: false, action: null });
  };

  const performAction = (action: "new" | "open" | "close" | null) => {
    if (!action) return;
    switch (action) {
      case "new":
        setContent(`# New Document\n\nStart writing...`);
        break;
      case "open":
        setContent(`# Opened Document\n\nContent loaded from file...`);
        break;
      case "close":
        setContent("");
        break;
    }
    setHasChanges(false);
  };

  const alertButtons = [
    { title: "Cancel", isCancel: true, onClick: handleCancelAction },
    { title: "Don't Save", onClick: handleDontSave },
    { title: "Save", isDefault: true, onClick: handleSave },
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
                <h1 className="text-xl font-bold text-gray-900">Scenario 2: Unsaved Changes</h1>
                <p className="text-sm text-gray-500">Text editor — informational style with three buttons</p>
              </div>
            </div>
            <nav className="flex gap-3 text-sm">
              <Link href="/scenarios/delete-confirmation" className="text-gray-600 hover:text-gray-700">
                ← Previous: Delete Confirmation
              </Link>
              <Link href="/scenarios/critical-error" className="text-gray-600 hover:text-gray-700">
                Next: Critical Error →
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
            Closing a document with unsaved work is a <strong>decision with three valid paths</strong> — not a binary yes/no.
            The <strong>informational style</strong> (blue icon) fits because this isn't a warning or error; it's a routine
            checkpoint. Three buttons map to three user intents: <strong>Save</strong> (default, blue, Enter — the
            constructive path), <strong>Don't Save</strong> (explicit discard), <strong>Cancel</strong> (Escape — go back
            to editing). This is the classic "Save changes?" dialog pattern used by every major editor.
          </p>
        </section>

        {/* Editor UI */}
        <section className="mb-8">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition" title="New" onClick={() => triggerAlert("new")}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m-6 4v4m0 0h4" />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition" title="Open" onClick={() => triggerAlert("open")}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded transition ${hasChanges ? "text-blue-600 bg-blue-50" : "text-gray-400 cursor-not-allowed"}`}
                  title="Save"
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-1M9 5v2m0 0v10m0-10h10m-10 0a2 2 0 012-2h4a2 2 0 012 2" />
                  </svg>
                </button>
              </div>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <div className="flex items-center gap-1">
                <select className="text-sm px-2 py-1 border border-gray-300 rounded bg-white" defaultValue="Markdown">
                  <option>Markdown</option>
                  <option>Plain Text</option>
                  <option>Rich Text</option>
                </select>
              </div>
              <div className="flex-1"></div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{content.split("\n").length} lines</span>
                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                {hasChanges && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Unsaved</span>
                )}
              </div>
            </div>

            {/* Editor */}
            <div className="p-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                className="w-full h-96 font-mono text-sm leading-relaxed text-gray-900 bg-white border-0 focus:outline-none resize-none"
                placeholder="Start writing... (try typing, then click New/Open/Close tab)"
                spellCheck={false}
              />
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
          onClose={handleCancelAction}
          style="informational"
          messageText={alertState.action === "close"
            ? "Close this document?"
            : alertState.action === "new"
            ? "Create new document?"
            : "Open another document?"}
          informativeText={
            alertState.action === "close"
              ? "You have unsaved changes. Choose Save to keep them, Don't Save to discard, or Cancel to continue editing."
              : "You have unsaved changes in the current document. What would you like to do?"
          }
          buttons={alertButtons}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex justify-between text-sm">
            <Link href="/scenarios/delete-confirmation" className="text-blue-600 hover:underline">
              ← Previous: Delete Confirmation
            </Link>
            <Link href="/scenarios/critical-error" className="text-blue-600 hover:underline font-medium">
              Next: Critical Error →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}