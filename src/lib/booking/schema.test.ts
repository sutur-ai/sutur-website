import { describe, it, expect } from "vitest";
import { bookingRequestSchema } from "./schema";

describe("bookingRequestSchema", () => {
  const validRequest = {
    fullName: "Alex Johnson",
    workEmail: "alex@example.com",
    companyName: "Acme Corp",
    role: "CEO",
    phone: "+1-555-123-4567",
    companySize: "11-50" as const,
    helpArea: "erp" as const,
    preferredSlot: "2026-08-01T10:00:00.000Z",
    additionalContext: "We need help with manufacturing.",
  };

  it("accepts a valid booking request", () => {
    const result = bookingRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("rejects missing fullName", () => {
    const { fullName, ...rest } = validRequest;
    const result = bookingRequestSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing workEmail", () => {
    const { workEmail, ...rest } = validRequest;
    const result = bookingRequestSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = bookingRequestSchema.safeParse({
      ...validRequest,
      workEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing companyName", () => {
    const { companyName, ...rest } = validRequest;
    const result = bookingRequestSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing role", () => {
    const { role, ...rest } = validRequest;
    const result = bookingRequestSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing phone", () => {
    const { phone, ...rest } = validRequest;
    const result = bookingRequestSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid companySize", () => {
    const result = bookingRequestSchema.safeParse({
      ...validRequest,
      companySize: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid helpArea", () => {
    const result = bookingRequestSchema.safeParse({
      ...validRequest,
      helpArea: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing preferredSlot", () => {
    const { preferredSlot, ...rest } = validRequest;
    const result = bookingRequestSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("accepts request without additionalContext", () => {
    const { additionalContext, ...rest } = validRequest;
    const result = bookingRequestSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("rejects additionalContext exceeding 2000 characters", () => {
    const result = bookingRequestSchema.safeParse({
      ...validRequest,
      additionalContext: "x".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid companySize values", () => {
    const sizes = ["1", "2-10", "11-50", "51-200", "201-1000", "1000+"] as const;
    for (const size of sizes) {
      const result = bookingRequestSchema.safeParse({
        ...validRequest,
        companySize: size,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid helpArea values", () => {
    const areas = ["erp", "agents", "both", "not-sure"] as const;
    for (const area of areas) {
      const result = bookingRequestSchema.safeParse({
        ...validRequest,
        helpArea: area,
      });
      expect(result.success).toBe(true);
    }
  });
});
