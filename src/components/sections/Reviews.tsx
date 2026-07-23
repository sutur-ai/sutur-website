import Link from 'next/link';
import { SignalDot } from '@/components/ui/SignalDot';
import { ArrowIcon } from '@/components/ui/icons';

export function Reviews() {
  return (
    <section
      className="section reviews scroll-section surface-paper"
      id="reviews"
      aria-labelledby="reviews-title"
    >
      <div className="reviews-heading">
        <h2 id="reviews-title">Reviews<SignalDot /></h2>
        <p className="lead">
          We only publish feedback with client approval. No invented stars and no
          mystery names.
        </p>
      </div>
      <article className="review-reference">
        <p>Relevant references</p>
        <h3>Client references are available on request<SignalDot /></h3>
        <p>
          Once we understand the work, we can arrange a conversation with a client
          whose project is close enough to be useful.
        </p>
        <Link className="text-link" href="/contact">
          Ask for a reference <ArrowIcon />
        </Link>
      </article>
    </section>
  );
}
