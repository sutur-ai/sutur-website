"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import BookingDialog from "@/components/booking/BookingDialog";
import BookingForm from "@/components/booking/BookingForm";

export default function BookCall() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section
      id="book"
      className="py-20 sm:py-28"
      aria-labelledby="book-heading"
    >
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>Get Started</SectionLabel>
          <h2
            id="book-heading"
            className="mt-3 text-3xl sm:text-4xl font-display font-bold text-[var(--sutur-deep-interface)] leading-tight"
          >
            Book a free discovery call
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-ink)] leading-relaxed">
            Tell us about your operations and what you&rsquo;re trying to solve.
            No pitch, no commitment — just a focused conversation about whether
            Sutur is the right fit.
          </p>

          <div className="mt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setDialogOpen(true)}
            >
              Book a free discovery call
            </Button>
          </div>
        </div>
      </Container>

      <BookingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <BookingForm />
      </BookingDialog>
    </section>
  );
}
