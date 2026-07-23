import { Header } from '@/components/sections/Header';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { AgentOrbit } from '@/components/brand/AgentOrbit';
import { CompanyCapabilities } from '@/components/sections/CompanyCapabilities';
import { WhyUs } from '@/components/sections/WhyUs';
import { Reviews } from '@/components/sections/Reviews';
import { FaqSection } from '@/components/sections/FaqSection';
import { Booking } from '@/components/booking/Booking';
import { SignalDot } from '@/components/ui/SignalDot';
import { ArrowIcon } from '@/components/ui/icons';

export default function Home() {
  return (
    <main id="top">
      <Header />

      <section className="hero scroll-section surface-ink">
        <div className="hero-copy">
          <h1>
            Connect your business<SignalDot />
            <br />
            <em>Automate the busywork<SignalDot /></em>
          </h1>
          <p className="lead">
            We bring your operation into one Odoo setup, then let practical
            agents handle the repetitive work your team should not have to chase.
          </p>
          <div className="hero-actions">
            <a className="button" href="#book">
              Book a discovery call <ArrowIcon />
            </a>
            <a className="button-secondary" href="#capabilities">
              Explore solutions
            </a>
          </div>
        </div>

        <AgentOrbit />

      </section>

      <CompanyCapabilities />

      <WhyUs />

      <Reviews />

      <FaqSection />

      <section className="booking-section scroll-section surface-soft" id="book">
        <h2>What would a clearer operation make possible<SignalDot /></h2>
        <p className="lead">A free, focused discovery call — 30 minutes.</p>
        <Booking />
      </section>

      <SiteFooter />
    </main>
  );
}
