import { SignalDot } from '@/components/ui/SignalDot';

export function WhyUs() {
  return (
    <section
      className="section why-us scroll-section surface-soft"
      id="why-us"
      aria-labelledby="why-us-title"
    >
      <h2 id="why-us-title">Why us<SignalDot /></h2>
      <blockquote className="why-us-quote">
        <span className="why-us-quote-mark is-open" aria-hidden="true">“</span>
        <p>
          We start with how your team actually works, then build the smallest
          system that removes friction without taking control away from your team
        </p>
        <span className="why-us-quote-mark is-close" aria-hidden="true">”</span>
      </blockquote>
    </section>
  );
}
