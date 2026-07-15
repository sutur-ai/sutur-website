import { describe, it, expect, beforeEach, vi } from "vitest";

// We will test the mock provider directly
import { createMockBookingProvider } from "./providers/mock-provider";

describe("MockBookingProvider", () => {
  const provider = createMockBookingProvider();

  describe("getAvailableSlots", () => {
    it("returns slots for a given date", async () => {
      const slots = await provider.getAvailableSlots("2026-08-03"); // Monday
      expect(slots.length).toBeGreaterThan(0);
      for (const slot of slots) {
        expect(slot).toHaveProperty("id");
        expect(slot).toHaveProperty("start");
        expect(slot).toHaveProperty("end");
        expect(slot.available).toBe(true);
      }
    });

    it("returns slots that all fall on the requested date", async () => {
      const slots = await provider.getAvailableSlots("2026-08-03"); // Monday
      for (const slot of slots) {
        expect(slot.start).toContain("2026-08-03");
      }
    });

    it("returns empty array for weekend dates", async () => {
      // 2026-08-02 is a Sunday
      const slots = await provider.getAvailableSlots("2026-08-02");
      expect(slots).toEqual([]);
    });
  });

  describe("submitRequest", () => {
    it("returns success for a valid booking request", async () => {
      const result = await provider.submitRequest({
        fullName: "Test User",
        workEmail: "test@example.com",
        companyName: "Test Co",
        role: "CEO",
        phone: "+1-555-0000",
        companySize: "11-50",
        helpArea: "erp",
        preferredSlot: "2026-08-01T10:00:00.000Z",
      });
      expect(result.success).toBe(true);
      expect(result.requestId).toBeDefined();
      expect(result.message).toContain("received");
    });

    it("never sends real emails", async () => {
      const result = await provider.submitRequest({
        fullName: "Test User",
        workEmail: "test@example.com",
        companyName: "Test Co",
        role: "CTO",
        phone: "+1-555-0000",
        companySize: "2-10",
        helpArea: "both",
        preferredSlot: "2026-08-01T14:00:00.000Z",
      });
      // Mock mode should not claim to send emails
      expect(result.message).not.toContain("email sent");
      expect(result.message).not.toContain("sent to");
    });
  });
});
