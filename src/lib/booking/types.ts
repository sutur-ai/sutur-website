import type { BookingRequest } from "./schema";

export interface BookingSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

export interface BookingResult {
  success: boolean;
  message: string;
  requestId?: string;
}

export interface BookingProvider {
  getAvailableSlots(date: string): Promise<BookingSlot[]>;
  submitRequest(request: BookingRequest): Promise<BookingResult>;
}

export type BookingMode = "mock" | "google";
