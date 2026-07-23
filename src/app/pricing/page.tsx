import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { PageHero } from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Engagement-based pricing for discovery, implementation, and ongoing partnership.',
};

const tiers = [
  {
    tier: 'Discovery',
    price: 'Free',
    description: 'A focused 30-minute call to map the operation and where clarity would help most.',
    items: ['Operation walkthrough', 'Opportunity map', 'No commitment'],
    cta: 'Book a call',
    featured: false,
  },
  {
    tier: 'Implementation',
    price: 'Scoped',
    description: 'A fixed-scope Odoo rollout priced to your modules, integrations, and team size.',
    items: ['Core module setup', 'Data migration', 'Team onboarding'],
    cta: 'Get a quote',
    featured: true,
  },
  {
    tier: 'Partnership',
    price: 'Custom',
    description: 'Ongoing custom development and agent architecture as your operation grows.',
    items: ['Dedicated build capacity', 'Agent architecture', 'Priority support'],
    cta: 'Talk to us',
    featured: false,
  },
] as const;

export default function PricingPage() {
  return (
    <main className="page-shell">
      <Header />
      <PageHero
        kicker="Pricing"
        title={<>Engagement-based. <em>Not seat-based.</em></>}
        description="Scope follows the operation. Every tier leads to the same discovery call rather than a checkout or a generic package."
      />

      <section className="page-section surface-paper">
        <p className="eyebrow">A clear path to scope</p>
        <h2>Start free. Build only what earns its place.</h2>
        <div className="page-grid">
          {tiers.map((tier) => (
            <article
              className={`price-card${tier.featured ? ' is-featured' : ''}`}
              key={tier.tier}
            >
              <p className="tier">{tier.tier}</p>
              <h3>{tier.price}</h3>
              <p>{tier.description}</p>
              <ul className="check-list">
                {tier.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link className={tier.featured ? 'button' : 'button-secondary'} href="/contact">
                {tier.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-section surface-soft">
        <p className="eyebrow">No black box</p>
        <h2>Understand the operation before pricing the build.</h2>
        <p className="lead">The discovery call is free, focused, and leaves you with a clearer map.</p>
        <Link className="button" href="/contact">Book a discovery call →</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
