import { z } from 'zod';
export const bookingSchema = z.object({ name: z.string().trim().min(2, 'Please enter your name.'), email: z.string().email('Please enter a valid email.'), company: z.string().trim().min(2, 'Please enter your company.'), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.'), note: z.string().trim().max(1000).optional() });
export type BookingInput = z.infer<typeof bookingSchema>;
