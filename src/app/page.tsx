import Link from 'next/link';
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
            <Link className="button" href="/contact">
              Book a discovery call <ArrowIcon />
            </Link>
            <a className="button-secondary" href="#capabilities">
              Explore solutions
            </a>
          </div>
        </div>

        <AgentOrbit />

      </section>

      <CompanyCapabilities />

      <WhyUs />

      <section className="section team scroll-section surface-ink" id="team">
        <div>
          <h2>A local team, close to the operation<SignalDot /></h2>
          <p className="lead">
            Sutur combines ERP implementation, custom software, and agent
            architecture in one accountable build team, from the first workflow
            map through rollout and refinement.
          </p>
          <Link className="text-link" href="/about">Our story <ArrowIcon /></Link>
        </div>
        <div className="people" aria-label="Team functions">
          <article>
            <b>01</b>
            <div aria-hidden="true" />
            <h3>Implementation</h3>
            <p>Odoo, operations, and rollout</p>
          </article>
          <article>
            <b>02</b>
            <div aria-hidden="true" />
            <h3>Engineering</h3>
            <p>Custom systems and practical agents</p>
          </article>
        </div>
      </section>

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
