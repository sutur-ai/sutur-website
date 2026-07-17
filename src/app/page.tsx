import { Header } from "@/components/sections/Header";
import { SectionScroll } from "@/components/sections/SectionScroll";
import { KnowledgeDiagram } from "@/components/brand/Diagrams";
import { ModuleGrid } from "@/components/brand/ModuleGrid";
import { Booking } from "@/components/booking/Booking";
import { agentExamples } from "@/content/services";
import { process } from "@/content/process";

export default function Home() {
  return (
    <main id="top">
      <SectionScroll />
      <Header />
      <section className="hero scroll-section surface-ink">
        <div className="hero-copy">
          <p className="eyebrow">BUILT BETWEEN FRIENDS. SHAPED WITH YOU.</p>
          <h1>
            We care about the
            <br />
            <em>way work feels.</em>
          </h1>
          <p className="lead">
            Sutur started as a passion project between friends who enjoy taking
            complicated work apart and putting it back together better. We use
            Odoo and practical AI when they genuinely help — never just because
            they are the fashionable answer.
          </p>
          <div className="hero-principles" aria-label="How Sutur works">
            <p><strong>Close by design.</strong> You work with the people doing the thinking and building.</p>
            <p><strong>Made around your reality.</strong> No off-the-shelf theatre, no disappearing after launch.</p>
          </div>
          <div className="hero-actions">
            <a className="button" href="#book">
              Book a discovery call
            </a>
            <a className="arrow-link" href="#solutions">
              Explore solutions →
            </a>
          </div>
          <p className="hero-caps">Thoughtful systems · Useful automation · A team that stays close</p>
        </div>
        <div className="hero-signature" aria-label="Sutur in English and Arabic">
          <div className="signature-glow" aria-hidden="true" />
          <p className="signature-line">Our solution, written your way.</p>
          <img className="signature-logo signature-logo-en" src="/brand/sutur-logo-en.png" alt="Sutur" />
          <span className="signature-thread" aria-hidden="true" />
          <img className="signature-logo signature-logo-ar" src="/brand/sutur-logo-ar.png" alt="سطور" lang="ar" />
        </div>
      </section>
      <section className="section solution scroll-section surface-ink" id="solutions">
        <div>
          <p className="eyebrow">POWERED BY ODOO</p>
          <h2>Centralize your business operations</h2>
          <p className="lead">
            One system for the work that keeps your business moving.
          </p>
        </div>
        <ModuleGrid />
      </section>
      <section className="section agents scroll-section surface-paper" id="agents">
        <div className="agents-intro">
          <p className="eyebrow">PRACTICAL AGENTS</p>
          <h2>
            Give your team a faster path to the answers already inside the
            business.
          </h2>
          <p className="lead">
            We start with useful internal knowledge — then add assistants and
            automation where the process is ready for them.
          </p>
        </div>
        <div className="agents-grid">
          <KnowledgeDiagram />
          <div className="agent-list">
            {agentExamples.map(([n, t, d]) => (
              <article key={n}>
                <b>{n}</b>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section process scroll-section surface-ink" id="process">
        <p className="eyebrow">HOW WE WORK</p>
        <h2>Clear stages. A partner who stays close.</h2>
        <div className="timeline">
          {process.map(([n, t, d]) => (
            <article key={n}>
              <b>{n}</b>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section team scroll-section surface-ink" id="team">
        <div>
          <p className="eyebrow">THE TEAM</p>
          <h2>The people will be introduced here.</h2>
          <p className="lead">
            Names, roles, and biographies are intentionally held as placeholders
            until the approved team content is ready.
          </p>
        </div>
        <div className="people">
          <article>
            <b>01</b>
            <div />
            <h3>Team member</h3>
            <p>Role placeholder</p>
          </article>
          <article>
            <b>02</b>
            <div />
            <h3>Team member</h3>
            <p>Role placeholder</p>
          </article>
        </div>
      </section>
      <section className="booking-section scroll-section surface-paper" id="book">
        <p className="eyebrow">START WITH A CONVERSATION</p>
        <h2>What would a clearer operation make possible?</h2>
        <p className="lead">
          A free discovery call. No integration is connected in this local mock.
        </p>
        <Booking />
      </section>
      <footer className="scroll-section">
        <div>
          <a className="wordmark" href="#top">
            <i />
            Sutur
          </a>
          <p>Tailored Odoo and practical AI agents for clearer operations.</p>
        </div>
        <div>
          <b>CONTACT</b>
          <p>
            hello@sutur.example
            <br />
            <small>Placeholder email</small>
          </p>
        </div>
        <div>
          <b>LEGAL</b>
          <p>
            Privacy <small>pending</small>
            <br />
            Terms <small>pending</small>
          </p>
        </div>
        <p className="copyright">© 2026 Sutur. All rights reserved.</p>
      </footer>
    </main>
  );
}
