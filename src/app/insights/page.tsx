import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { PageHero } from '@/components/sections/PageHero';
import { ArrowIcon } from '@/components/ui/icons';
import { SignalDot } from '@/components/ui/SignalDot';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Operational playbooks and field notes from Sutur.',
};

const topics = [
  {
    number: '01',
    title: 'ERP without the theater',
    description: 'What to decide before configuration begins — scope, sequence, ownership, and the operating model underneath it all.',
  },
  {
    number: '02',
    title: 'Agents with permission and context',
    description: 'A practical pattern for useful automation across ERP, documents, messages, and internal knowledge.',
  },
  {
    number: '03',
    title: 'Building for local reality',
    description: 'Bilingual teams, Lebanese market constraints, payment realities, and software designed to handle exceptions.',
  },
  {
    number: '04',
    title: 'The handoff is part of the product',
    description: 'Why approvals, ownership, and a clear route back to a person make agent workflows safer and more useful.',
  },
] as const;

export default function InsightsPage() {
  const [featured, ...articles] = topics;

  return (
    <main className="page-shell">
      <Header />
      <PageHero
        title={<>Operational playbooks<SignalDot /> <em>Field notes<SignalDot /></em></>}
        description="Clear writing about ERP, custom systems, and practical agents — focused on decisions an operating team can use."
      />

      <section className="page-section surface-paper" aria-labelledby="insights-title">
        <div className="insights-heading">
          <div>
            <h2 id="insights-title">Useful enough to keep<SignalDot /></h2>
          </div>
          <ul className="topic-filters" aria-label="Insight topics">
            <li>Odoo</li>
            <li>Operations</li>
            <li>AI agents</li>
          </ul>
        </div>

        <div className="insights-layout">
          <article className="featured-insight">
            <div className="insight-cover" aria-hidden="true">
              <span>01</span>
              <i />
              <b>ERP</b>
            </div>
            <div>
              <p className="number">{featured.number} · Featured field note</p>
              <h3>{featured.title}</h3>
              <p>{featured.description}</p>
              <span className="text-link" aria-label="Featured field note coming soon">Coming soon <ArrowIcon /></span>
            </div>
          </article>

          <div className="insight-list" aria-label="More field notes">
            {articles.map((article) => (
              <article key={article.number}>
                <p className="number">{article.number}</p>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <span>Coming soon</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section surface-soft">
        <div className="empty-state">
          <div>
            <h2>Ask Sutur directly<SignalDot /></h2>
            <p className="lead">A focused conversation is more useful than generic advice.</p>
            <Link className="button" href="/contact">Start a conversation <ArrowIcon /></Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
