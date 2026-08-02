import { SignalDot } from '@/components/ui/SignalDot';

const reviews = [
  {
    initials: 'CA',
    name: 'Charles Arbid',
    company: 'Retailinc',
    position: 'President',
  },
  {
    initials: 'IJ',
    name: 'Ibrahim Jarkass',
    company: 'FixPro',
    position: 'CEO',
  },
  {
    initials: 'AC',
    name: 'Dr. Amin Chaptini',
    company: 'Chaptini Smile Clinic',
    position: 'Owner & Head Dentist',
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
        <p className="reviews-label">Selected clients</p>
        <h2 id="reviews-title">Reviews<SignalDot /></h2>
      </div>
      <div className="review-grid">
        {reviews.map((review, index) => (
          <article
            className="review-card"
            key={review.name}
          >
            <div className="review-meta" aria-hidden="true">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>Client</span>
            </div>
            <div className="review-profile">
              <div className="review-avatar" aria-hidden="true">{review.initials}</div>
              <div className="review-identity">
                <h3>{review.name}</h3>
                <p className="review-position">{review.position}</p>
              </div>
            </div>
            <p className="review-company">{review.company}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
