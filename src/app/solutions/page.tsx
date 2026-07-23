import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { PageHero } from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Sutur solutions organized around the outcome your operation needs.',
};

const solutions = [
  {
    number: '01',
    title: 'Run one system',
    description:
      'For teams juggling spreadsheets and disconnected tools. Odoo is implemented around the real operation so every team works from the same source of truth.',
    cta: 'Plan your ERP',
    featured: false,
  },
  {
    number: '02',
    title: 'Fit the exceptions',
    description:
      "For operations generic software cannot handle. Custom development is grounded in your workflow, bilingual teams, and the Lebanese market.",
    cta: 'Discuss a build',
    featured: true,
  },
  {
    number: '03',
    title: 'Remove the busywork',
    description:
      'For teams drowning in follow-through. A permission-aware agent layer connects context across your systems and handles repetitive work.',
    cta: 'Design your agents',
    featured: false,
  },
] as const;

export default function SolutionsPage() {
  return (
    <main className="page-shell">
      <Header />
      <PageHero
        title={<>Built around the result <em>your team needs.</em></>}
        description="Choose the operating problem first. We will map the right combination of ERP, custom development, and practical agents."
      />

      <section className="page-section surface-paper">
        <h2>Organized by the outcome a buyer is looking for.</h2>
        <div className="page-grid">
          {solutions.map((solution) => (
            <article
              className={`content-card${solution.featured ? ' is-featured' : ''}`}
              key={solution.number}
            >
              <p className="number">{solution.number}</p>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
              <Link className="text-link" href="/contact">{solution.cta} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-section surface-soft">
        <h2>Every solution starts with the same conversation.</h2>
        <p className="lead">Map the operation, find the constraint, then choose the smallest useful build.</p>
        <Link className="button" href="/contact">Book a discovery call →</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
