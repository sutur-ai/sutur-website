import type { BookingProvider, BookingSlot, BookingResult } from "../types";
import type { BookingRequest } from "../schema";

export function createMockBookingProvider(): BookingProvider {
  function generateSlotsForDate(dateStr: string): BookingSlot[] {
    const date = new Date(dateStr + "T00:00:00");
    // No slots on weekends
    if (date.getDay() === 0 || date.getDay() === 6) return [];

    const slots: BookingSlot[] = [];
    const hours = [9, 10, 11, 14, 15, 16]; // business hours
    for (const hour of hours) {
      const startHour = hour.toString().padStart(2, "0");
      const endHour = (hour + 1).toString().padStart(2, "0");
      slots.push({
        id: `${dateStr}T${startHour}:00`,
        start: `${dateStr}T${startHour}:00:00.000Z`,
        end: `${dateStr}T${endHour}:00:00.000Z`,
        available: true,
      });
    }
    return slots;
  }

  return {
    async getAvailableSlots(date: string): Promise<BookingSlot[]> {
      return generateSlotsForDate(date);
    },

    async submitRequest(request: BookingRequest): Promise<BookingResult> {
      const requestId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return {
        success: true,
        message:
          "Your request was received. We'll confirm your preferred time by email.",
        requestId,
      };
    },
  };
}
