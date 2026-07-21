import { Header } from "@/components/sections/Header";
import { AgentOrbit } from "@/components/brand/AgentOrbit";
import { CompanyCapabilities } from "@/components/sections/CompanyCapabilities";
import { Booking } from "@/components/booking/Booking";

export default function Home() {
  return (
    <main id="top">
      <Header />
      <section className="hero scroll-section surface-ink">
        <div className="hero-copy">
          <h1>
            Connect your business.
            <br />
            <em>Automate the busywork.</em>
          </h1>
          <p className="lead">
            We bring your operation into one Odoo setup. Once everything works
            together, practical agents can handle the repetitive work your team
            should not have to chase.
          </p>
          <div className="hero-actions">
            <a className="button" href="#book">
              Book a discovery call
            </a>
            <a className="arrow-link" href="#capabilities">
              Explore solutions →
            </a>
          </div>
        </div>
        <AgentOrbit />
      </section>
      <CompanyCapabilities />

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
