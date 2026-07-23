'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingInput } from '@/lib/booking/schema';
import { ArrowIcon, CloseIcon } from '@/components/ui/icons';
import { SignalDot } from '@/components/ui/SignalDot';

function openEmailDraft(data: BookingInput) {
  const subject = encodeURIComponent(`Sutur discovery call — ${data.company}`);
  const body = encodeURIComponent(
    [
      `Name: ${data.name}`,
      `Work email: ${data.email}`,
      `Company: ${data.company}`,
      `Preferred date: ${data.date}`,
      '',
      'What we would like to improve:',
      data.note?.trim() || 'Not provided',
    ].join('\n'),
  );
  window.location.href = `mailto:hello@sutur.ai?subject=${subject}&body=${body}`;
}

export function Booking() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({ resolver: zodResolver(bookingSchema) });

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLInputElement>('input')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  function openBooking() {
    setSent(false);
    setOpen(true);
  }

  function closeBooking() {
    setOpen(false);
    setSent(false);
    window.requestAnimationFrame(() => openButtonRef.current?.focus());
  }

  function submit(data: BookingInput) {
    openEmailDraft(data);
    setSent(true);
  }

  return (
    <>
      <div className={`card-scene ${flipped ? 'flipped' : ''}`}>
        <button
          className="business-card card-front"
          type="button"
          onClick={() => {
            setFlipped(true);
            window.requestAnimationFrame(() => openButtonRef.current?.focus());
          }}
          aria-label="Show booking details"
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
        >
          <p>Discovery / 30 minutes</p>
          <h3>Let&apos;s make the operating system clearer<SignalDot /></h3>
          <span>Open the card <ArrowIcon /></span>
        </button>

        <div className="business-card card-back" aria-hidden={!flipped}>
          <p>Your next step</p>
          <h3>A free, focused discovery call<SignalDot /></h3>
          <button
            ref={openButtonRef}
            type="button"
            tabIndex={flipped ? 0 : -1}
            onClick={openBooking}
          >
            Open booking form <ArrowIcon />
          </button>
        </div>
      </div>

      {open && (
        <dialog
          ref={dialogRef}
          className="booking-modal"
          aria-label="Book a discovery call"
          onCancel={(event) => {
            event.preventDefault();
            closeBooking();
          }}
          onClick={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const outside =
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom;
            if (outside) closeBooking();
          }}
        >
          <button
            className="close"
            type="button"
            aria-label="Close booking form"
            onClick={closeBooking}
          >
            <CloseIcon />
          </button>

          {sent ? (
            <div className="success" aria-live="polite">
              <h3>Your email app is opening<SignalDot /></h3>
              <p>
                Review the prepared message and send it to hello@sutur.ai. Nothing
                was silently submitted or stored.
              </p>
              <button type="button" onClick={closeBooking}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(submit)} noValidate>
              <h3>Tell us what needs to connect<SignalDot /></h3>
              <label>
                Name
                <input
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby="booking-name-error"
                  {...register('name')}
                />
                <em id="booking-name-error" aria-live="polite">{errors.name?.message}</em>
              </label>
              <label>
                Work email
                <input
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="booking-email-error"
                  {...register('email')}
                />
                <em id="booking-email-error" aria-live="polite">{errors.email?.message}</em>
              </label>
              <label>
                Company
                <input
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby="booking-company-error"
                  {...register('company')}
                />
                <em id="booking-company-error" aria-live="polite">{errors.company?.message}</em>
              </label>
              <label>
                Preferred date
                <input
                  type="date"
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby="booking-date-error"
                  {...register('date')}
                />
                <em id="booking-date-error" aria-live="polite">{errors.date?.message}</em>
              </label>
              <label>
                What would you like to improve?
                <textarea
                  rows={4}
                  aria-invalid={Boolean(errors.note)}
                  aria-describedby="booking-note-error"
                  {...register('note')}
                />
                <em id="booking-note-error" aria-live="polite">{errors.note?.message}</em>
              </label>
              <button type="submit" disabled={isSubmitting}>
                Prepare email <ArrowIcon />
              </button>
            </form>
          )}
        </dialog>
      )}
    </>
  );
}
