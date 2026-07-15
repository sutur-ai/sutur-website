"use client";

import { useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import BookingDialog from "@/components/booking/BookingDialog";
import BookingForm from "@/components/booking/BookingForm";

export default function BookCall() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="container">
      <section className="booking-section" id="book" aria-labelledby="book-heading">
        <SectionLabel>Get Started</SectionLabel>
        <h2 id="book-heading" style={{ marginTop: '1rem' }}>Book a free discovery call</h2>

        {/* 3D Business Card */}
        <div
          className={`booking-scene ${flipped ? 'flipped' : ''}`}
          onClick={() => !flipped && setFlipped(true)}
        >
          {/* Front: Business card */}
          <div className="booking-card-face booking-card-front">
            <div className="card-top">
              <span className="card-eyebrow">Sutur — Discovery</span>
              <SuturLogo />
            </div>
            <div>
              <p className="card-heading">Tell us about your operations and what you&apos;re trying to solve.</p>
              <p className="card-sub" style={{ marginTop: '.75rem' }}>
                No pitch, no commitment — just a focused conversation about whether Sutur is the right fit for your business.
              </p>
            </div>
            <div className="card-meta">
              <div className="card-info">
                <strong>What to expect</strong>
                A 30-minute call to understand your needs and explore the path forward.
              </div>
              <button
                className="card-back-hint"
                onClick={(e) => { e.stopPropagation(); setFlipped(true); }}
              >
                Tap to book →
              </button>
            </div>
          </div>

          {/* Back: Form summary + open modal */}
          <div className="booking-card-face booking-card-back">
            <button className="flip-back-btn" aria-label="Flip card back" onClick={(e) => { e.stopPropagation(); setFlipped(false); }}>
              ↺
            </button>
            <h2>Book a free discovery call</h2>
            <p className="lead">Fill in a few details and we&apos;ll confirm your slot.</p>
            <Button
              variant="primary"
              size="lg"
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDialogOpen(true); }}
              style={{ alignSelf: 'flex-start' }}
            >
              Open booking form
            </Button>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="card-info" style={{ color: 'var(--muted-ink)' }}>
                <strong style={{ color: 'var(--sutur-deep-interface)' }}>No commitment</strong>
                Just a conversation.
              </div>
              <div className="card-info" style={{ color: 'var(--muted-ink)' }}>
                <strong style={{ color: 'var(--sutur-deep-interface)' }}>Mock preview</strong>
                No email or invite is sent.
              </div>
            </div>
          </div>
        </div>

        {/* Modal with full form (for accessibility + E2E tests) */}
        <BookingDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <BookingForm />
        </BookingDialog>
      </section>
    </div>
  );
}

function SuturLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="rgba(255,255,255,.15)" />
      <path d="M8 22V10h3l5 8 5-8h3v12h-3v-7l-4 6.5h-2l-4-6.5v7H8z" fill="white" />
    </svg>
  );
}