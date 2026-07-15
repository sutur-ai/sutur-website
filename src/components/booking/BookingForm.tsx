"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingRequestSchema,
  type BookingRequest,
  companySizes,
  helpAreas,
} from "@/lib/booking/schema";
import AvailabilityPicker from "./AvailabilityPicker";
import Button from "@/components/ui/Button";

type FormState = "idle" | "submitting" | "success" | "error";

export default function BookingForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingRequest>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: {
      companySize: "2-10",
      helpArea: "not-sure",
    },
  });

  const onSubmit = async (data: BookingRequest) => {
    setFormState("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, preferredSlot: selectedSlot }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormState("success");
        setServerMessage(result.message);
      } else {
        setFormState("error");
        setServerMessage(
          result.error || "Something went wrong. Please try again."
        );
      }
    } catch {
      setFormState("error");
      setServerMessage(
        "Network error. Please check your connection and try again."
      );
    }
  };

  // Sync slot to form
  useEffect(() => {
    setValue("preferredSlot", selectedSlot);
  }, [selectedSlot, setValue]);

  if (formState === "success") {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--sutur-deep-interface)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--sutur-deep-interface)]">
          Request received
        </h3>
        <p className="mt-2 text-sm text-[var(--muted-ink)] max-w-sm mx-auto">
          {serverMessage}
        </p>
        <p className="mt-4 text-xs text-[var(--muted-ink)]/70 bg-[var(--sutur-soft-signal)]/40 inline-block px-3 py-1 rounded-full">
          Mock mode — no email has been sent
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
        >
          Full name *
        </label>
        <input
          id="fullName"
          type="text"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Work Email */}
      <div>
        <label
          htmlFor="workEmail"
          className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
        >
          Work email *
        </label>
        <input
          id="workEmail"
          type="email"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent"
          {...register("workEmail")}
        />
        {errors.workEmail && (
          <p className="text-sm text-red-600 mt-1">
            {errors.workEmail.message}
          </p>
        )}
      </div>

      {/* Company */}
      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
        >
          Company *
        </label>
        <input
          id="companyName"
          type="text"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent"
          {...register("companyName")}
        />
        {errors.companyName && (
          <p className="text-sm text-red-600 mt-1">
            {errors.companyName.message}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
        >
          Your role *
        </label>
        <input
          id="role"
          type="text"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent"
          {...register("role")}
        />
        {errors.role && (
          <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
        >
          Phone *
        </label>
        <input
          id="phone"
          type="tel"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Company Size */}
      <div>
        <label
          htmlFor="companySize"
          className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
        >
          Company size *
        </label>
        <select
          id="companySize"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent"
          {...register("companySize")}
        >
          {companySizes.map((size) => (
            <option key={size} value={size}>
              {size === "1" ? "1 person" : `${size} employees`}
            </option>
          ))}
        </select>
        {errors.companySize && (
          <p className="text-sm text-red-600 mt-1">
            {errors.companySize.message}
          </p>
        )}
      </div>

      {/* Help Area */}
      <div>
        <label
          htmlFor="helpArea"
          className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
        >
          What do you need help with? *
        </label>
        <select
          id="helpArea"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent"
          {...register("helpArea")}
        >
          <option value="erp">ERP implementation</option>
          <option value="agents">AI agents</option>
          <option value="both">Both ERP and agents</option>
          <option value="not-sure">Not sure yet</option>
        </select>
        {errors.helpArea && (
          <p className="text-sm text-red-600 mt-1">
            {errors.helpArea.message}
          </p>
        )}
      </div>

      {/* Availability Picker */}
      <AvailabilityPicker
        onSelect={(slot) => {
          setSelectedSlot(slot);
          setValue("preferredSlot", slot);
        }}
        selectedSlot={selectedSlot}
        error={errors.preferredSlot?.message}
      />
      <input type="hidden" {...register("preferredSlot")} />

      {/* Additional Context */}
      <div>
        <label
          htmlFor="additionalContext"
          className="block text-sm font-semibold text-[var(--sutur-deep-interface)] mb-1"
        >
          Anything else we should know? (optional)
        </label>
        <textarea
          id="additionalContext"
          rows={3}
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--sutur-active-orange)] focus:border-transparent resize-y"
          {...register("additionalContext")}
        />
        {errors.additionalContext && (
          <p className="text-sm text-red-600 mt-1">
            {errors.additionalContext.message}
          </p>
        )}
      </div>

      {/* Server error */}
      {formState === "error" && serverMessage && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {serverMessage}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={formState === "submitting"}
        disabled={!selectedSlot}
      >
        Submit request
      </Button>

      <p className="text-xs text-center text-[var(--muted-ink)]/70">
        Mock mode — your request will be recorded but no calendar invite or
        email will be sent.
      </p>
    </form>
  );
}
