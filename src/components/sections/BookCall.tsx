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
        <div className="booking-head">
          <SectionLabel>Get Started</SectionLabel>
          <h2 id="book-heading" style={{ marginTop: '1rem' }}>Book a free discovery call</h2>
        </div>

        <div
          className={`card-scene ${flipped ? 'flipped' : ''}`}
          onClick={() => !flipped && setFlipped(true)}
        >
          {/* Front */}
          <div className="card-face card-front">
            <div className="row1">
              <span className="eyebrow-light">Sutur — Discovery</span>
              <CardLogo />
            </div>
            <div>
              <p className="card-h">Tell us about your operations and what you&apos;re trying to solve.</p>
              <p className="card-sub">
                No pitch, no commitment — just a focused conversation about whether Sutur is the right fit for your business.
              </p>
            </div>
            <div className="meta">
              <div className="meta-info">
                <strong>What to expect</strong>
                A 30-minute call to understand your needs and explore the path forward.
              </div>
              <button
                className="card-flip-btn"
                onClick={(e) => { e.stopPropagation(); setFlipped(true); }}
              >
                Tap to book →
              </button>
            </div>
          </div>

          {/* Back */}
          <div className="card-face card-back">
            <button className="flip-back" aria-label="Flip card back" onClick={(e) => { e.stopPropagation(); setFlipped(false); }}>↺</button>
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
            <div className="chip-row">
              <div className="chip-info">
                <strong>No commitment</strong>
                Just a conversation.
              </div>
              <div className="chip-info">
                <strong>Mock preview</strong>
                No email or invite is sent.
              </div>
            </div>
          </div>
        </div>

        <BookingDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <BookingForm />
        </BookingDialog>
      </section>
    </div>
  );
}

function CardLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="rgba(255,255,255,.12)" />
      <path d="M8 22V10h3l5 8 5-8h3v12h-3v-7l-4 6.5h-2l-4-6.5v7H8z" fill="white" />
    </svg>
  );
}