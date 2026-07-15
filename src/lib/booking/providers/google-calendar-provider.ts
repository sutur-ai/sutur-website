import type { BookingProvider, BookingSlot, BookingResult } from "../types";
import type { BookingRequest } from "../schema";

/**
 * STUB — NOT OPERATIONAL
 *
 * This provider will be implemented when Google Cloud OAuth credentials,
 * a Calendar ID, and the manual-approval operating procedure are supplied.
 *
 * Required before production:
 * 1. Google Cloud project with Calendar API enabled
 * 2. OAuth 2.0 client ID and secret (stored as GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)
 * 3. Refresh token for the service account or authorized user (GOOGLE_REFRESH_TOKEN)
 * 4. Target calendar ID (GOOGLE_CALENDAR_ID)
 * 5. Defined manual-approval workflow (request → hold → approve → confirm)
 *
 * OAuth scopes needed:
 * - https://www.googleapis.com/auth/calendar.readonly (free/busy)
 * - https://www.googleapis.com/auth/calendar.events (create events)
 * - https://www.googleapis.com/auth/calendar (if full access needed)
 */

export function createGoogleCalendarProvider(): BookingProvider {
  return {
    async getAvailableSlots(_date: string): Promise<BookingSlot[]> {
      throw new Error(
        "Google Calendar provider is not configured. Set BOOKING_MODE=mock for local development."
      );
    },

    async submitRequest(_request: BookingRequest): Promise<BookingResult> {
      throw new Error(
        "Google Calendar provider is not configured. Set BOOKING_MODE=mock for local development."
      );
    },
  };
}
