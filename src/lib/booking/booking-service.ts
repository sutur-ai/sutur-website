import type { BookingProvider, BookingResult, BookingSlot } from "./types";
import type { BookingRequest } from "./schema";
import { createMockBookingProvider } from "./providers/mock-provider";
import { createGoogleCalendarProvider } from "./providers/google-calendar-provider";

function getBookingProvider(): BookingProvider {
  const mode = process.env.BOOKING_MODE || "mock";
  if (mode === "google") {
    return createGoogleCalendarProvider();
  }
  return createMockBookingProvider();
}

const provider = getBookingProvider();

export async function getAvailableSlots(date: string): Promise<BookingSlot[]> {
  return provider.getAvailableSlots(date);
}

export async function submitBookingRequest(
  request: BookingRequest
): Promise<BookingResult> {
  return provider.submitRequest(request);
}
