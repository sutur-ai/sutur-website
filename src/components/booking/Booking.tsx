'use client';

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { SignalDot } from '../ui/SignalDot';
import { getCalendlyEmbedUrl } from '../../lib/booking/calendly';
import { COUNTRIES } from '../../lib/booking/countries';
import styles from './Booking.module.css';
import {
  BOOKING_FIELD_LIMITS,
  type BookingDetailErrors,
  type BookingDetails,
  validateBookingDetails,
} from '../../lib/booking/details';

// ponytail: public event URL, safe to ship in the bundle; env var stays as an override.
const calendlyEventUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  'https://calendly.com/elias-chaptini-sutur/30min';

const emptyDetails: BookingDetails = {
  firstName: '',
  lastName: '',
  country: '',
  city: '',
  phone: '',
  email: '',
  businessName: '',
  tellUsMore: '',
};

export function Booking({ children }: { children?: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const calendarRef = useRef<HTMLElement>(null);
  const baseCalendarUrl = getCalendlyEmbedUrl(calendlyEventUrl);
  const [details, setDetails] = useState(emptyDetails);
  const [errors, setErrors] = useState<BookingDetailErrors>({});
  const [calendarUrl, setCalendarUrl] = useState(baseCalendarUrl);
  const [step, setStep] = useState<1 | 2>(1);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => setIsHydrated(true), []);

  useEffect(() => {
    const card = cardRef.current;
    const section = card?.closest<HTMLElement>('#book');
    const heading = card?.querySelector('h2');
    if (!card || !section || !heading) return;

    const update = () => {
      const zoom = Number(getComputedStyle(card).getPropertyValue('--page-zoom')) || 1;
      // Both rectangles include the same reveal transform; their difference removes it.
      const offset = (heading.getBoundingClientRect().top - card.getBoundingClientRect().top) / zoom;
      section.style.setProperty('--book-heading-offset', `${offset}px`);
    };
    update();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    observer?.observe(card);
    observer?.observe(heading);
    if (heading.parentElement) observer?.observe(heading.parentElement);
    window.addEventListener('resize', update);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      section.style.removeProperty('--book-heading-offset');
    };
  }, [children]);

  function updateDetail(field: keyof BookingDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { values, errors: nextErrors } = validateBookingDetails(details);
    setDetails(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

    const prefilledUrl = getCalendlyEmbedUrl(calendlyEventUrl, values);
    if (!prefilledUrl) return;

    setCalendarUrl(prefilledUrl);
    setStep(2);
    window.requestAnimationFrame(() => {
      calendarRef.current?.focus();
    });
  }

  return (
    <div ref={cardRef} className={`${styles.cta} rv`} data-step={step}>
      {children && <div className={styles.heading}>{children}</div>}
      <div className={`booking-flow ${styles.flow}`}>
      {step === 1 ? (
      <form
        ref={formRef}
        className={`booking-lead-form ${styles.form}`}
        action="#book"
        method="post"
        onSubmit={submit}
        noValidate
      >
        <div className={styles.step}>Step 1 of 2 · Your details</div>

        <label className={styles.field}>
          First name
          <input
            name="firstName"
            required
            maxLength={BOOKING_FIELD_LIMITS.firstName}
            autoComplete="given-name"
            value={details.firstName}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby="booking-first-name-error"
            onChange={(event) => updateDetail('firstName', event.target.value)}
          />
          <em id="booking-first-name-error" aria-live="polite">
            {errors.firstName}
          </em>
        </label>

        <label className={styles.field}>
          Last name
          <input
            name="lastName"
            required
            maxLength={BOOKING_FIELD_LIMITS.lastName}
            autoComplete="family-name"
            value={details.lastName}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby="booking-last-name-error"
            onChange={(event) => updateDetail('lastName', event.target.value)}
          />
          <em id="booking-last-name-error" aria-live="polite">
            {errors.lastName}
          </em>
        </label>

        <label className={styles.field}>
          Country
          <select
            name="country"
            required
            autoComplete="country-name"
            value={details.country}
            aria-invalid={Boolean(errors.country)}
            aria-describedby="booking-country-error"
            onChange={(event) => updateDetail('country', event.target.value)}
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <em id="booking-country-error" aria-live="polite">
            {errors.country}
          </em>
        </label>

        <label className={styles.field}>
          City
          <input
            name="city"
            required
            maxLength={BOOKING_FIELD_LIMITS.city}
            autoComplete="address-level2"
            placeholder="Beirut"
            value={details.city}
            aria-invalid={Boolean(errors.city)}
            aria-describedby="booking-city-error"
            onChange={(event) => updateDetail('city', event.target.value)}
          />
          <em id="booking-city-error" aria-live="polite">
            {errors.city}
          </em>
        </label>

        <label className={styles.field}>
          Phone number
          <input
            name="phone"
            required
            maxLength={BOOKING_FIELD_LIMITS.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+961 70 123 456"
            value={details.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby="booking-phone-error"
            onChange={(event) => updateDetail('phone', event.target.value)}
          />
          <em id="booking-phone-error" aria-live="polite">
            {errors.phone}
          </em>
        </label>

        <label className={`${styles.field} ${styles.full}`}>
          Work email
          <input
            name="email"
            required
            maxLength={BOOKING_FIELD_LIMITS.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={details.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="booking-email-error"
            onChange={(event) => updateDetail('email', event.target.value)}
          />
          <em id="booking-email-error" aria-live="polite">
            {errors.email}
          </em>
        </label>

        <label className={`${styles.field} ${styles.full}`}>
          <span className={styles.labelText}>
            Company <small>(optional)</small>
          </span>
          <input
            name="businessName"
            maxLength={BOOKING_FIELD_LIMITS.businessName}
            autoComplete="organization"
            value={details.businessName}
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby="booking-business-error"
            onChange={(event) =>
              updateDetail('businessName', event.target.value)
            }
          />
          <em id="booking-business-error" aria-live="polite">
            {errors.businessName}
          </em>
        </label>

        <label className={`${styles.field} ${styles.full}`}>
          <span className={styles.labelText}>
            Tell us more <small>(optional)</small>
          </span>
          <textarea
            name="tellUsMore"
            rows={3}
            maxLength={BOOKING_FIELD_LIMITS.tellUsMore}
            placeholder="What would you like to improve?"
            value={details.tellUsMore}
            aria-invalid={Boolean(errors.tellUsMore)}
            aria-describedby="booking-tell-more-error"
            onChange={(event) =>
              updateDetail('tellUsMore', event.target.value)
            }
          />
          <em id="booking-tell-more-error" aria-live="polite">
            {errors.tellUsMore}
          </em>
        </label>

        <button
          className={`btn booking-continue ${styles.continue}`}
          type="submit"
          disabled={!isHydrated || !baseCalendarUrl}
        >
          {baseCalendarUrl
            ? 'Choose a time'
            : 'Scheduling temporarily unavailable'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p className={styles.note}>
          Your details are used only to prepare and schedule this call.
        </p>
      </form>
      ) : (
      <section
        ref={calendarRef}
        className={`booking-calendar ${styles.calendar}`}
        aria-labelledby="booking-calendar-title"
        tabIndex={-1}
      >
        <div className={styles.calendarHeading}>
          <div>
            <p className={styles.step}>Step 2 of 2 · Choose a time</p>
            <h3 id="booking-calendar-title">Choose any open spot<SignalDot /></h3>
          </div>
          <p>30 minutes · Confirmation arrives by email.</p>
        </div>

        {calendarUrl ? (
          <div className={styles.calendarStage}>
            <iframe
              key={calendarUrl}
              className={`booking-calendar-frame ${styles.calendarFrame}`}
              src={calendarUrl}
              title="Book a Sutur discovery call"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              tabIndex={0}
            />
          </div>
        ) : (
          <div className={styles.unavailable}>
            <strong>Online scheduling is being connected.</strong>
            <p>
              Booking will reopen here as soon as the Calendly event is connected.
            </p>
          </div>
        )}

        <p className={styles.privacy}>
          {baseCalendarUrl
            ? 'Validated details are passed to Calendly only to prefill your booking.'
            : 'No details can be submitted while online scheduling is unavailable.'}
        </p>
      </section>
      )}
      </div>
    </div>
  );
}
