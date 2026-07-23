'use client';

import { type FormEvent, useRef, useState } from 'react';
import { ArrowIcon } from '@/components/ui/icons';
import { SignalDot } from '@/components/ui/SignalDot';
import { getCalendlyEmbedUrl } from '@/lib/booking/calendly';
import {
  BOOKING_FIELD_LIMITS,
  type BookingDetailErrors,
  type BookingDetails,
  validateBookingDetails,
} from '@/lib/booking/details';

const calendlyEventUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

const emptyDetails: BookingDetails = {
  firstName: '',
  lastName: '',
  location: '',
  phone: '',
  email: '',
  businessName: '',
  tellUsMore: '',
};

function openEmailDraft(details: BookingDetails) {
  const subject = encodeURIComponent(
    `Sutur discovery call — ${details.businessName}`,
  );
  const body = encodeURIComponent(
    [
      `Name: ${details.firstName} ${details.lastName}`,
      `Location: ${details.location}`,
      `Phone: ${details.phone}`,
      `Email: ${details.email}`,
      `Business: ${details.businessName}`,
      '',
      'Tell us more:',
      details.tellUsMore || 'Not provided',
    ].join('\n'),
  );

  window.location.href = `mailto:hello@sutur.ai?subject=${subject}&body=${body}`;
}

export function Booking() {
  const formRef = useRef<HTMLFormElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const baseCalendarUrl = getCalendlyEmbedUrl(calendlyEventUrl);
  const [details, setDetails] = useState(emptyDetails);
  const [errors, setErrors] = useState<BookingDetailErrors>({});
  const [calendarUrl, setCalendarUrl] = useState(baseCalendarUrl);
  const [calendarReady, setCalendarReady] = useState(false);

  function updateDetail(field: keyof BookingDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
    if (calendarReady) {
      setCalendarReady(false);
      setCalendarUrl(baseCalendarUrl);
    }
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
    if (!prefilledUrl) {
      openEmailDraft(values);
      return;
    }

    setCalendarUrl(prefilledUrl);
    setCalendarReady(true);
    window.requestAnimationFrame(() => {
      if (window.matchMedia('(max-width: 1024px)').matches) {
        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;
        calendarRef.current?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    });
  }

  return (
    <div className="booking-flow">
      <form
        ref={formRef}
        className="booking-lead-form"
        action="mailto:hello@sutur.ai?subject=Sutur%20discovery%20call"
        method="post"
        encType="text/plain"
        onSubmit={submit}
        noValidate
      >
        <div className="booking-panel-heading">
          <p className="booking-kicker">Step 1 / Your details</p>
          <h3>Tell us who we&apos;re meeting<SignalDot /></h3>
          <p>One quick form. No account, no back-and-forth.</p>
        </div>

        <div className="booking-form-grid">
          <label>
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

          <label>
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

          <label>
            Location
            <input
              name="location"
              required
              maxLength={BOOKING_FIELD_LIMITS.location}
              autoComplete="address-level2"
              placeholder="City, country"
              value={details.location}
              aria-invalid={Boolean(errors.location)}
              aria-describedby="booking-location-error"
              onChange={(event) => updateDetail('location', event.target.value)}
            />
            <em id="booking-location-error" aria-live="polite">
              {errors.location}
            </em>
          </label>

          <label>
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

          <label>
            Email
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

          <label>
            Business name
            <input
              name="businessName"
              required
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

          <label className="booking-form-wide">
            <span className="booking-label-text">
              Tell us more <small>(optional)</small>
            </span>
            <textarea
              name="tellUsMore"
              rows={4}
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
        </div>

        <button className="button booking-continue" type="submit">
          {baseCalendarUrl ? 'Continue to available times' : 'Send details by email'}
          <ArrowIcon />
        </button>
        <p className="booking-form-note">
          Your details are used only to prepare and schedule this call.
        </p>
      </form>

      <section
        ref={calendarRef}
        className="booking-calendar"
        aria-labelledby="booking-calendar-title"
      >
        <div className="booking-calendar-heading">
          <div>
            <p className="booking-kicker">Step 2 / Pick a time</p>
            <h3 id="booking-calendar-title">Choose any open spot<SignalDot /></h3>
          </div>
          <p>30 minutes · Confirmation arrives by email.</p>
        </div>

        {calendarUrl ? (
          <div
            className={`booking-calendar-stage ${
              calendarReady ? 'is-ready' : 'is-locked'
            }`}
          >
            <iframe
              key={calendarUrl}
              className="booking-calendar-frame"
              src={calendarUrl}
              title="Book a Sutur discovery call"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              tabIndex={calendarReady ? 0 : -1}
              aria-hidden={!calendarReady}
            />
            {!calendarReady && (
              <div className="booking-calendar-gate" role="status">
                <strong>
                  Complete your details to unlock available times.
                </strong>
                <span>Your calendar stays on this page.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="booking-calendar-unavailable">
            <strong>Online scheduling is being connected.</strong>
            <p>
              Complete your details and your email app will open with everything
              prepared for hello@sutur.ai.
            </p>
          </div>
        )}

        <p className="booking-privacy">
          {baseCalendarUrl
            ? 'Validated details are passed to Calendly only to prefill your booking.'
            : 'Your details stay in the prepared email until you choose to send it.'}
        </p>
      </section>
    </div>
  );
}
