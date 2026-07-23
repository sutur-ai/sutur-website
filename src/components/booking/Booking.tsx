import { ArrowIcon } from '@/components/ui/icons';
import { SignalDot } from '@/components/ui/SignalDot';
import { getCalendlyEmbedUrl } from '@/lib/booking/calendly';

export function Booking() {
  const embedUrl = getCalendlyEmbedUrl(
    process.env.NEXT_PUBLIC_CALENDLY_URL,
  );

  if (!embedUrl) {
    return (
      <div className="booking-fallback">
        <p className="booking-kicker">Discovery call / 30 minutes</p>
        <h3>Start with one sentence<SignalDot /></h3>
        <p>
          Tell us where work is slowing down. We will reply with the next
          available times and take it from there.
        </p>
        <a
          className="button"
          href="mailto:hello@sutur.ai?subject=Sutur%20discovery%20call"
        >
          Email hello@sutur.ai <ArrowIcon />
        </a>
      </div>
    );
  }

  return (
    <div className="booking-calendar">
      <div className="booking-calendar-heading">
        <p className="booking-kicker">Discovery call / 30 minutes</p>
        <p>
          Select an open time below. Calendly will ask for your name, work
          email, company, and a short note before confirming.
        </p>
      </div>
      <iframe
        className="booking-calendar-frame"
        src={embedUrl}
        title="Book a Sutur discovery call"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <p className="booking-privacy">
        Scheduling and confirmation emails are handled securely by Calendly.
      </p>
    </div>
  );
}
