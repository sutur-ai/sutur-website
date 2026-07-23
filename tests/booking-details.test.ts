import { describe, expect, it } from 'vitest';
import {
  BOOKING_FIELD_LIMITS,
  validateBookingDetails,
} from '../src/lib/booking/details';

const completeDetails = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  location: 'Beirut, Lebanon',
  phone: '+961 70 123 456',
  email: 'ada@example.com',
  businessName: 'Analytical Engines',
  tellUsMore: '',
};

describe('booking details validation', () => {
  it('accepts and trims all required lead fields', () => {
    const result = validateBookingDetails({
      ...completeDetails,
      firstName: ' Ada ',
      businessName: ' Analytical Engines ',
    });

    expect(result.errors).toEqual({});
    expect(result.values.firstName).toBe('Ada');
    expect(result.values.businessName).toBe('Analytical Engines');
  });

  it.each([
    'firstName',
    'lastName',
    'location',
    'phone',
    'email',
    'businessName',
  ] as const)('requires %s', (field) => {
    const result = validateBookingDetails({
      ...completeDetails,
      [field]: '',
    });

    expect(result.errors[field]).toBeTruthy();
  });

  it('rejects an invalid email address', () => {
    const result = validateBookingDetails({
      ...completeDetails,
      email: 'ada.example.com',
    });

    expect(result.errors.email).toBe('Enter a valid email address.');
  });

  it('accepts common international phone formatting', () => {
    expect(validateBookingDetails(completeDetails).errors.phone).toBeUndefined();
  });

  it.each(['123', 'call me', '+961'])('rejects an invalid phone number: %s', (phone) => {
    const result = validateBookingDetails({ ...completeDetails, phone });

    expect(result.errors.phone).toBe('Enter a valid phone number.');
  });

  it('keeps tell us more optional and caps it at 1000 characters', () => {
    expect(validateBookingDetails(completeDetails).errors.tellUsMore).toBeUndefined();
    expect(
      validateBookingDetails({
        ...completeDetails,
        tellUsMore: 'x'.repeat(1001),
      }).errors.tellUsMore,
    ).toBe('Keep this under 1,000 characters.');
  });

  it.each([
    'firstName',
    'lastName',
    'location',
    'phone',
    'email',
    'businessName',
  ] as const)('caps %s before building external URLs', (field) => {
    const limit = BOOKING_FIELD_LIMITS[field];
    const result = validateBookingDetails({
      ...completeDetails,
      [field]: 'x'.repeat(limit + 1),
    });
    const formattedLimit = limit === 1000 ? '1,000' : String(limit);

    expect(result.errors[field]).toBe(
      `Keep this under ${formattedLimit} characters.`,
    );
  });
});
