'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingInput } from '@/lib/booking/schema';

function mockSubmit(_data: BookingInput): Promise<{ id: string }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id: `mock-${Date.now()}` }), 600)
  );
}

export function Booking() {
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({ resolver: zodResolver(bookingSchema) });

  async function submit(data: BookingInput) {
    await mockSubmit(data);
    setSent(true);
  }

  return (
    <>
      <div
        className={`card-scene ${flipped ? 'flipped' : ''}`}
        onClick={() => !flipped && setFlipped(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setFlipped(true)}
        aria-label="Flip Sutur booking card"
      >
        <div className="business-card card-front">
          <p>DISCOVERY / 30 MINUTES</p>
          <h3>Let&apos;s make the operating system clearer.</h3>
          <span>Tap to book →</span>
        </div>
        <div className="business-card card-back">
          <p>YOUR NEXT STEP</p>
          <h3>A free, focused discovery call.</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            Open booking form
          </button>
        </div>
      </div>

      {open && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setOpen(false)}
        >
          <dialog
            open
            className="booking-modal"
            aria-label="Book a discovery call"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              aria-label="Close booking form"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            {sent ? (
              <div className="success">
                <p className="eyebrow">REQUEST RECEIVED</p>
                <h3>Thank you.</h3>
                <p>
                  This is a mock request stored nowhere. We&apos;ll connect it to
                  scheduling once credentials are approved.
                </p>
                <button onClick={() => setOpen(false)}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(submit)}>
                <p className="eyebrow">BOOK A CALL</p>
                <h3>Tell us what needs to connect.</h3>
                <label>
                  Name
                  <input {...register('name')} />
                  <em>{errors.name?.message}</em>
                </label>
                <label>
                  Work email
                  <input type="email" {...register('email')} />
                  <em>{errors.email?.message}</em>
                </label>
                <label>
                  Company
                  <input {...register('company')} />
                  <em>{errors.company?.message}</em>
                </label>
                <label>
                  Preferred date
                  <input type="date" {...register('date')} />
                  <em>{errors.date?.message}</em>
                </label>
                <label>
                  What would you like to improve?
                  <textarea {...register('note')} rows={3} />
                </label>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Request a call'}
                </button>
              </form>
            )}
          </dialog>
        </div>
      )}
    </>
  );
}
