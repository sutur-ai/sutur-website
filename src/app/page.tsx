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
          <div className="hero-brand" aria-label="Sutur">
            <img src="/brand/sutur-logo-en.png" alt="Sutur" />
            <span aria-hidden="true" />
            <img src="/brand/sutur-logo-ar.png" alt="سطور" lang="ar" />
          </div>
          <p className="hero-eyebrow">Odoo and practical AI, built around your team</p>
          <h1>
            Make complex work
            <br />
            <em>feel simple.</em>
          </h1>
          <p className="lead">
            We design clearer systems for the way your business already works —
            and stay close from the first conversation through launch and beyond.
          </p>
          <div className="hero-actions">
            <a className="button" href="#book">
              Book a discovery call
            </a>
            <a className="arrow-link" href="#solutions">
              Explore solutions →
            </a>
          </div>
        </div>
        <aside className="hero-summary" aria-label="How Sutur works">
          <p>One thoughtful system, shaped around your operation.</p>
          <ol>
            <li><span>01</span>Understand the work</li>
            <li><span>02</span>Simplify the process</li>
            <li><span>03</span>Build what fits</li>
          </ol>
          <small>Direct access to the people doing the work.</small>
        </aside>
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
