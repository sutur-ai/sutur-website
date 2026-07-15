import OperationsDiagram from '@/components/brand/OperationsDiagram';
import SectionLabel from '@/components/ui/SectionLabel';

export function Hero() {
  return (
    <div className="container">
      <section className="hero" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <SectionLabel>Tailored operations, clearly connected</SectionLabel>
            <h1>Bring your whole business into <em>one clear</em> operating system.</h1>
            <p className="lead">
              Sutur designs and implements tailored Odoo ERP systems that connect your finance, sales, operations, and teams.
            </p>
            <div className="hero-actions">
              <a href="#book" className="btn btn-primary btn-lg">Book a free discovery call</a>
              <a href="#solutions" className="link-arrow">Explore the system →</a>
            </div>
            <div className="partner-pill">
              <span className="dot">OP</span>
              <div className="txt">
                <strong>Official Odoo Partner badge</strong>
                <small>Approved official file required before publication.</small>
              </div>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="num">7+</div>
                <div className="label">Engagement stages</div>
              </div>
              <div className="hero-stat">
                <div className="num">1yr</div>
                <div className="label">Close follow-up</div>
              </div>
              <div className="hero-stat">
                <div className="num">1:1</div>
                <div className="label">Dedicated contact</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-orb" />
            <OperationsDiagram />
          </div>
        </div>
      </section>
    </div>
  );
}