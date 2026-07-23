import { COUNTRIES } from './countries';

export type BookingDetails = {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  businessName: string;
  tellUsMore: string;
};

export type BookingDetailErrors = Partial<Record<keyof BookingDetails, string>>;

export const BOOKING_FIELD_LIMITS: Readonly<
  Record<keyof BookingDetails, number>
> = {
  firstName: 80,
  lastName: 80,
  country: 80,
  city: 120,
  phone: 32,
  email: 254,
  businessName: 160,
  tellUsMore: 1000,
};

const requiredMessages: Record<
  Exclude<keyof BookingDetails, 'tellUsMore'>,
  string
> = {
  firstName: 'Enter your first name.',
  lastName: 'Enter your last name.',
  country: 'Select your country.',
  city: 'Enter your city.',
  phone: 'Enter your phone number.',
  email: 'Enter your email address.',
  businessName: 'Enter your business name.',
};

const COUNTRY_SET = new Set<string>(COUNTRIES);

export function validateBookingDetails(details: BookingDetails) {
  const values = Object.fromEntries(
    Object.entries(details).map(([key, value]) => [key, value.trim()]),
  ) as BookingDetails;
  const errors: BookingDetailErrors = {};

  for (const [field, message] of Object.entries(requiredMessages) as [
    keyof typeof requiredMessages,
    string,
  ][]) {
    if (!values[field]) errors[field] = message;
  }

  for (const [field, limit] of Object.entries(BOOKING_FIELD_LIMITS) as [
    keyof BookingDetails,
    number,
  ][]) {
    if (values[field].length > limit) {
      const formattedLimit = limit === 1000 ? '1,000' : String(limit);
      errors[field] = `Keep this under ${formattedLimit} characters.`;
    }
  }

  if (values.country && !errors.country && !COUNTRY_SET.has(values.country)) {
    errors.country = 'Select a valid country.';
  }

  if (
    values.email &&
    !errors.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  ) {
    errors.email = 'Enter a valid email address.';
  }

  if (values.phone && !errors.phone) {
    const digits = values.phone.replace(/\D/g, '');
    const usesPhoneCharacters = /^[+\d][\d\s().-]*$/.test(values.phone);
    if (!usesPhoneCharacters || digits.length < 7 || digits.length > 15) {
      errors.phone = 'Enter a valid phone number.';
    }
  }

  return { values, errors };
}
