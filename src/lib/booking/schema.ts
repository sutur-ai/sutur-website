import { z } from "zod";

export const companySizes = [
  "1",
  "2-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
] as const;

export const helpAreas = ["erp", "agents", "both", "not-sure"] as const;

export const bookingRequestSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  workEmail: z.string().email("A valid work email is required"),
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  phone: z.string().min(1, "Phone number is required"),
  companySize: z.enum(companySizes),
  helpArea: z.enum(helpAreas),
  preferredSlot: z.string().min(1, "Preferred time slot is required"),
  additionalContext: z.string().max(2000).optional(),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
