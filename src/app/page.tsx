import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { SiteFooter } from '@/components/sections/SiteFooter';
import { AgentOrbit } from '@/components/brand/AgentOrbit';
import { CompanyCapabilities } from '@/components/sections/CompanyCapabilities';
import { AgentActionDemo } from '@/components/sections/AgentActionDemo';
import { Booking } from '@/components/booking/Booking';

const modules = [
  ['CRM', '/brand/odoo-modules/crm.png'],
  ['Sales', '/brand/odoo-modules/sales.png'],
  ['Accounting', '/brand/odoo-modules/accounting.png'],
  ['Inventory', '/brand/odoo-modules/inventory.png'],
  ['Purchasing', '/brand/odoo-modules/purchasing.png'],
  ['Manufacturing', '/brand/odoo-modules/manufacturing.png'],
  ['E-commerce', '/brand/odoo-modules/ecommerce.png'],
  ['Custom development', '/brand/odoo-modules/custom-development.svg'],
] as const;

export default function Home() {
  return (
    <main id="top">
      <Header />

      <section className="hero scroll-section surface-ink">
        <div className="hero-copy">
          <p className="hero-eyebrow">Tailored Odoo · Practical AI agents</p>
          <h1>
            Connect your business.
            <br />
            <em>Automate the busywork.</em>
          </h1>
          <p className="lead">
            We bring your operation into one Odoo setup, then let practical
            agents handle the repetitive work your team should not have to chase.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Book a discovery call →
            </Link>
            <a className="button-secondary" href="#capabilities">
              Explore solutions
            </a>
          </div>
        </div>

        <AgentOrbit />

        <div className="module-coverage" aria-label="Odoo module coverage">
          <span>Module coverage</span>
          {modules.map(([name, image]) => (
            <img key={name} src={image} alt={name} width={48} height={48} />
          ))}
        </div>
      </section>

      <CompanyCapabilities />

      <AgentActionDemo />

      <section className="section team scroll-section surface-ink" id="team">
        <div>
          <p className="eyebrow">Grounded in Lebanon</p>
          <h2>A local team, close to the operation.</h2>
          <p className="lead">
            Sutur combines ERP implementation, custom software, and agent
            architecture in one accountable build team, from the first workflow
            map through rollout and refinement.
          </p>
          <Link className="text-link" href="/about">Our story →</Link>
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

      <section className="booking-section scroll-section surface-soft" id="book">
        <p className="eyebrow">Start with a conversation</p>
        <h2>What would a clearer operation make possible?</h2>
        <p className="lead">A free, focused discovery call — 30 minutes.</p>
        <Booking />
      </section>

      <SiteFooter />
    </main>
  );
}
