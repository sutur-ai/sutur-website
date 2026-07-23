export type BookingDetails = {
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
  email: string;
  businessName: string;
  tellUsMore: string;
};

export type BookingDetailErrors = Partial<Record<keyof BookingDetails, string>>;

const requiredMessages: Record<
  Exclude<keyof BookingDetails, 'tellUsMore'>,
  string
> = {
  firstName: 'Enter your first name.',
  lastName: 'Enter your last name.',
  location: 'Enter your location.',
  phone: 'Enter your phone number.',
  email: 'Enter your email address.',
  businessName: 'Enter your business name.',
};

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

  if (
    values.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  ) {
    errors.email = 'Enter a valid email address.';
  }

  if (values.phone) {
    const digits = values.phone.replace(/\D/g, '');
    const usesPhoneCharacters = /^[+\d][\d\s().-]*$/.test(values.phone);
    if (!usesPhoneCharacters || digits.length < 7 || digits.length > 15) {
      errors.phone = 'Enter a valid phone number.';
    }
  }

  if (values.tellUsMore.length > 1000) {
    errors.tellUsMore = 'Keep this under 1,000 characters.';
  }

  return { values, errors };
}
