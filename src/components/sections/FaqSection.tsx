import { SignalDot } from '@/components/ui/SignalDot';
import { ExpandIcon } from '@/components/ui/icons';

export function FaqSection() {
  return (
    <section
      className="section faq scroll-section surface-ink"
      id="questions"
      aria-labelledby="questions-title"
    >
      <div className="faq-heading">
        <h2 id="questions-title">Questions & answers<SignalDot /></h2>
        <p className="lead">The practical questions usually come first.</p>
      </div>
      <div className="faq-list">
        <details open>
          <summary>
            <span>Do we need to use Odoo already?</span>
            <ExpandIcon />
          </summary>
          <p>
            No. We can improve an existing setup or map a clean implementation from
            the way your team works today.
          </p>
        </details>
        <details>
          <summary>
            <span>What can an agent do safely?</span>
            <ExpandIcon />
          </summary>
          <p>
            Only the work and data you permit. We keep approval points visible when
            a person should make the final call.
          </p>
        </details>
        <details>
          <summary>
            <span>How large is the first phase?</span>
            <ExpandIcon />
          </summary>
          <p>
            Small enough to ship and judge. After discovery, we define one bounded
            workflow before expanding the system.
          </p>
        </details>
        <details>
          <summary>
            <span>What happens after the discovery call?</span>
            <ExpandIcon />
          </summary>
          <p>
            You leave with a clearer map. If the fit is right, we send a scoped next
            step with ownership, timing, and cost made explicit.
          </p>
        </details>
      </div>
    </section>
  );
}
