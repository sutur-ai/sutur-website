import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { PageHero } from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'About',
  description: 'Sutur is grounded in Lebanon and built around clear, practical operations.',
};

export default function AboutPage() {
  return (
    <main className="page-shell">
      <Header />
      <PageHero
        title={<>Grounded in Lebanon. <em>Built for real operations.</em></>}
        description="We bring ERP implementation, custom development, and practical agent architecture into one accountable build team."
      />

      <section className="page-section surface-paper">
        <div className="split-layout">
          <article className="info-panel">
            <p className="panel-label">The company</p>
            <h2>One reliable system for the whole operation.</h2>
            <p>
              Sutur starts with how work actually moves: the handoffs, exceptions,
              local realities, and follow-through a generic implementation misses.
              Technology comes second to a clear operating model.
            </p>
          </article>
          <article className="info-panel">
            <p className="panel-label">The approach</p>
            <h2>Confident, plain-spoken, and practical.</h2>
            <p>
              No hype and no inflated AI promises. We describe outcomes, show the
              system working, and build only what helps the team operate with more clarity.
            </p>
          </article>
        </div>
      </section>

      <section className="section team surface-ink" aria-labelledby="team-title">
        <div>
          <h2 id="team-title">A small team with the whole system in view.</h2>
          <p className="lead">
            Operations, implementation, and engineering stay connected from the
            first process map to the system people use every day.
          </p>
        </div>
        <div className="people" aria-label="Team functions">
          <article>
            <b>01</b>
            <div aria-hidden="true" />
            <h3>Operations &amp; ERP</h3>
            <p>Process design, Odoo, and rollout</p>
          </article>
          <article>
            <b>02</b>
            <div aria-hidden="true" />
            <h3>Software &amp; agents</h3>
            <p>Custom systems and agent architecture</p>
          </article>
        </div>
      </section>

      <section className="booking-section surface-soft">
        <h2>Tell us where the operation loses clarity.</h2>
        <p className="lead">We will help map the right first move.</p>
        <Link className="button" href="/contact">Book a discovery call →</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
