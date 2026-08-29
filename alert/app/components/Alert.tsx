"use client";

import { useState, useEffect, useRef } from "react";

export type AlertStyle = "warning" | "informational" | "critical";

export interface AlertButton {
  title: string;
  isDefault?: boolean;
  isCancel?: boolean;
  onClick: () => void;
}

export interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  style?: AlertStyle;
  messageText: string;
  informativeText?: string;
  buttons: AlertButton[];
  showsSuppressionButton?: boolean;
  suppressionLabel?: string;
  onSuppressionChange?: (checked: boolean) => void;
  icon?: React.ReactNode;
}

const styleConfigs: Record<AlertStyle, { borderColor: string; bgColor: string; iconBg: string; iconColor: string }> = {
  warning: {
    borderColor: "border-amber-300",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  informational: {
    borderColor: "border-blue-300",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  critical: {
    borderColor: "border-red-300",
    bgColor: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-700",
  },
};

const defaultIcons: Record<AlertStyle, React.ReactNode> = {
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  informational: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  critical: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

export function Alert({
  isOpen,
  onClose,
  style = "warning",
  messageText,
  informativeText,
  buttons,
  showsSuppressionButton = false,
  suppressionLabel = "Don't ask me again",
  onSuppressionChange,
  icon,
}: AlertProps) {
  const [suppressionChecked, setSuppressionChecked] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstButtonRef.current?.focus(), 0);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          const cancelBtn = buttons.find(b => b.isCancel);
          if (cancelBtn) {
            cancelBtn.onClick();
          } else {
            onClose();
          }
        }
        if (e.key === "Enter") {
          const defaultBtn = buttons.find(b => b.isDefault) || buttons[0];
          if (defaultBtn && document.activeElement !== cancelButtonRef.current) {
            e.preventDefault();
            defaultBtn.onClick();
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, buttons, onClose]);

  if (!isOpen) return null;

  const config = styleConfigs[style];
  const customIcon = icon || defaultIcons[style];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSuppressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSuppressionChecked(checked);
    onSuppressionChange?.(checked);
  };

  const handleButtonClick = (btn: AlertButton) => {
    btn.onClick();
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-message"
      aria-describedby={informativeText ? "alert-informative" : undefined}
    >
      <div
        ref={dialogRef}
        className={`relative w-full max-w-md rounded-xl border shadow-xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 ${config.borderColor} ${config.bgColor}`}
      >
        <div className="p-6">
          <div className="flex gap-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${config.iconBg} ${config.iconColor}`}
              aria-hidden="true"
            >
              {customIcon}
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="alert-message"
                className="text-lg font-semibold text-gray-900 leading-snug"
              >
                {messageText}
              </h2>
              {informativeText && (
                <p
                  id="alert-informative"
                  className="mt-2 text-sm text-gray-600 leading-relaxed"
                >
                  {informativeText}
                </p>
              )}
            </div>
          </div>

          {showsSuppressionButton && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  checked={suppressionChecked}
                  onChange={handleSuppressionChange}
                />
                <span className="text-sm text-gray-700">{suppressionLabel}</span>
              </label>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            {buttons.map((btn, index) => (
              <button
                key={btn.title}
                ref={btn.isDefault ? firstButtonRef : btn.isCancel ? cancelButtonRef : undefined}
                onClick={() => handleButtonClick(btn)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  btn.isDefault
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400"
                }`}
              >
                {btn.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}