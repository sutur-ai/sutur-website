"use client";

import { useState, useEffect } from "react";

interface AvailabilityPickerProps {
  onSelect: (slot: string) => void;
  selectedSlot: string;
  error?: string;
}

interface Slot {
  id: string;
  start: string;
  available: boolean;
}

type Status = "loading" | "ready" | "empty" | "error";

export default function AvailabilityPicker({
  onSelect,
  selectedSlot,
  error,
}: AvailabilityPickerProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState(() => {
    // Default to tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset to loading when date changes
    setStatus("loading");

    fetch(`/api/booking?date=${encodeURIComponent(date)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.slots && data.slots.length > 0) {
          setSlots(data.slots);
          setStatus("ready");
        } else {
          setSlots([]);
          setStatus("empty");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [date]);

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  // Construct tomorrow and +14 days for date range
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);

  return (
    <div>
      <label
        htmlFor="booking-date"
        className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
      >
        Select a date
      </label>
      <input
        id="booking-date"
        type="date"
        className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent"
        value={date}
        min={tomorrow.toISOString().split("T")[0]}
        max={maxDate.toISOString().split("T")[0]}
        onChange={(e) => {
          setDate(e.target.value);
          onSelect("");
        }}
      />

      <div className="mt-3">
        <span className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1">
          Available time slots
        </span>

        {status === "loading" && (
          <p className="text-sm text-[var(--muted-ink)] py-4">
            Loading available slots…
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-600 py-4">
            Could not load slots. Please try another date.
          </p>
        )}

        {status === "empty" && (
          <p className="text-sm text-[var(--muted-ink)] py-4">
            No slots available for this date. Try another day.
          </p>
        )}

        {status === "ready" && (
          <div className="grid grid-cols-3 gap-2 mt-1">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors min-h-[44px] ${
                  selectedSlot === slot.start
                    ? "border-[var(--sutur-active-orange)] bg-[var(--sutur-active-orange)]/10 text-[var(--sutur-active-orange)]"
                    : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--sutur-data-violet)] hover:bg-[var(--sutur-soft-signal)]"
                }`}
                onClick={() => onSelect(slot.start)}
              >
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}
