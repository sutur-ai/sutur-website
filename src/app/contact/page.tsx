import type { Metadata } from 'next';
import { Header } from '@/components/sections/Header';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { PageHero } from '@/components/sections/PageHero';
import { SignalDot } from '@/components/ui/SignalDot';
import { Booking } from '@/components/booking/Booking';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start with a free, focused 30-minute discovery call with Sutur.',
};

export default function ContactPage() {
  return (
    <main className="page-shell">
      <Header />
      <PageHero
        title={<>Start with <em>a conversation<SignalDot /></em></>}
        description="A free, focused discovery call — 30 minutes to map the operation and where clarity would help most."
      />

      <section className="booking-section surface-soft" id="book">
        <h2>One clear next step<SignalDot /></h2>
        <p className="lead">
          Prefer email? Write to <a href="mailto:hello@sutur.ai">hello@sutur.ai</a>.
        </p>
        <Booking />
      </section>
      <SiteFooter />
    </main>
  );
}
