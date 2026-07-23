import { SignalDot } from '@/components/ui/SignalDot';

const reviews = [
  {
    initials: 'MH',
    name: 'Maya Haddad',
    company: 'Cedar Retail Group',
    position: 'Operations Director',
    review: 'Sutur turned a scattered set of daily processes into one clear operating flow our team could actually follow.',
  },
  {
    initials: 'KN',
    name: 'Karim Nassar',
    company: 'Northstar Trading',
    position: 'Managing Partner',
    review: 'The work stayed grounded in the operation. We gained a connected system without forcing the business into a generic template.',
    featured: true,
  },
  {
    initials: 'LM',
    name: 'Leila Mansour',
    company: 'Atelier Foods',
    position: 'General Manager',
    review: 'The repetitive follow-up finally moved out of spreadsheets, while our team kept control of the decisions that matter.',
  },
];

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
          These are layout placeholders. Final names, roles, companies, and review
          copy will be replaced with client-approved testimonials.
        </p>
      </div>
      <div className="review-grid">
        {reviews.map((review) => (
          <article
            className={`review-card${review.featured ? ' is-featured' : ''}`}
            key={review.name}
          >
            <span className="review-placeholder">Placeholder</span>
            <div className="review-profile">
              <div className="review-avatar" aria-hidden="true">{review.initials}</div>
              <div className="review-identity">
                <h3>{review.name}</h3>
                <p className="review-company">{review.company}</p>
                <p className="review-position">{review.position}</p>
              </div>
            </div>
            <blockquote className="review-copy">
              <p>“{review.review}”</p>
            </blockquote>
          </article>
        ))}
      </div>
    </section>
  );
}
