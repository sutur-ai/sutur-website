import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { PageHero } from '@/components/sections/PageHero';
import {
  CapabilityVisual,
  type VisualKind,
} from '@/components/sections/CompanyCapabilities';
import { AgentHandoffMock } from '@/components/sections/AgentActionDemo';

export const metadata: Metadata = {
  title: 'Product',
  description: 'One connected business, built through Odoo, custom development, and practical AI agents.',
};

const capabilities: Array<{
  number: string;
  kicker: string;
  title: string;
  description: string;
  cta: string;
  kind: VisualKind;
}> = [
  {
    number: '01',
    kicker: 'Odoo ERP implementation',
    title: 'One source of truth for the operation.',
    description:
      'CRM, accounting, inventory, purchasing, manufacturing, and delivery work as one system configured around the way your team actually operates.',
    cta: 'Plan your ERP implementation',
    kind: 'erp',
  },
  {
    number: '02',
    kicker: 'Custom development',
    title: 'Software that fits the exceptions.',
    description:
      'We build the workflows, integrations, and bilingual tools that generic products miss, grounded in the Lebanese market and your real operating constraints.',
    cta: 'Discuss your custom build',
    kind: 'custom',
  },
  {
    number: '03',
    kicker: 'AI agent architecture',
    title: 'A permission-aware layer above it all.',
    description:
      'Agents work across ERP, documents, messages, and internal knowledge to bring context into each step and remove repetitive follow-through.',
    cta: 'Design your agent architecture',
    kind: 'agent',
  },
];

export default function ProductPage() {
  return (
    <main className="page-shell">
      <Header />
      <PageHero
        kicker="The connected system"
        title={<>One connected business. <em>Three ways forward.</em></>}
        description="The operating foundation, the software that fits, and the intelligence layer above them — designed as one buildable system."
      />

      <section className="page-section surface-paper" aria-label="Product capabilities">
        <div className="feature-rows">
          {capabilities.map((capability) => (
            <article className="feature-row" key={capability.kind}>
              {capability.kind === 'agent' ? (
                <AgentHandoffMock />
              ) : (
                <CapabilityVisual kind={capability.kind} />
              )}
              <div className="feature-row-copy">
                <p className="eyebrow">{capability.number} · {capability.kicker}</p>
                <h2>{capability.title}</h2>
                <p>{capability.description}</p>
                <Link className="text-link" href="/contact">
                  {capability.cta} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-section surface-soft">
        <p className="eyebrow">Build the right layer first</p>
        <h2>Start with the operation, not the software.</h2>
        <p className="lead">A focused discovery call maps where clarity will help most.</p>
        <Link className="button" href="/contact">Book a discovery call →</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
