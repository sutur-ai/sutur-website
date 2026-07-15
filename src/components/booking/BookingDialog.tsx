"use client";

import { useEffect, useRef } from "react";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function BookingDialog({
  open,
  onClose,
  children,
}: BookingDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Close on backdrop click
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose();
    };
    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, [onClose]);

  // Close on Escape (built into dialog, but ensure state sync)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-0 shadow-2xl backdrop:bg-[var(--ink)]/40 backdrop:backdrop-blur-sm open:flex open:flex-col"
      aria-label="Book a discovery call"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
        <h2 className="text-lg font-bold text-[var(--sutur-deep-interface)]">
          Book a free discovery call
        </h2>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-[var(--muted-ink)] hover:text-[var(--sutur-deep-interface)] hover:bg-[var(--sutur-soft-signal)]"
          aria-label="Close dialog"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 5L15 15M5 15L15 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
    </dialog>
  );
}
