import OperationsDiagram from '@/components/brand/OperationsDiagram';
import SectionLabel from '@/components/ui/SectionLabel';

export function Hero() {
  return (
    <div className="container">
      <section className="hero" id="top">
        <div className="hero-copy">
          <SectionLabel>Tailored operations, clearly connected</SectionLabel>
          <h1>Bring your whole business into one clear operating system.</h1>
          <p className="lead">
            Sutur designs and implements tailored Odoo ERP systems that connect your finance, sales, operations, and teams.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#book">Book a free discovery call</a>
            <a className="btn-ghost" href="#solutions">Explore the system <span aria-hidden>↓</span></a>
          </div>
          <div className="partner-badge">
            <span className="dot">OP</span>
            <div>
              <strong>Official Odoo Partner badge</strong>
              <small>Approved official file required before publication.</small>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow" />
          <OperationsDiagram />
        </div>
      </section>
    </div>
  );
}