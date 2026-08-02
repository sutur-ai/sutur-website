import Image from 'next/image';
import { SignalDot } from '@/components/ui/SignalDot';

const reviews = [
  {
    name: 'Charles Arbid',
    company: 'Retailinc',
    position: 'President',
    image: '/brand/clients/charles-arbid.webp',
    outcome:
      'Retailinc unified purchasing, inventory, point of sale, and finance in one ERP. Its connected SUTUR agent surfaces exceptions early, helping the team act without chasing updates.',
  },
  {
    name: 'Ibrahim Jarkass',
    company: 'FixPro',
    position: 'CEO',
    image: '/brand/clients/ibrahim-jarkass.webp',
    outcome:
      'FixPro connected project delivery, purchasing, costing, and site follow-ups in one ERP. Its SUTUR agent keeps approvals and exceptions moving from concept to completion.',
  },
  {
    name: 'Dr. Amin Chaptini',
    company: 'Chaptini Smile Clinic',
    position: 'Owner & Head Dentist',
    image: '/brand/clients/amin-chaptini.webp',
    outcome:
      'Chaptini Smile Clinic connected appointments, patient follow-ups, billing, and daily operations in one ERP. Its SUTUR agent keeps priorities moving so the team can focus on patient care.',
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
        <p className="reviews-label">Connected operations</p>
        <h2 id="reviews-title">Client outcomes<SignalDot /></h2>
      </div>
      <div className="review-grid">
        {reviews.map((review, index) => (
          <article
            className="review-card"
            key={review.name}
          >
            <div className="review-meta" aria-hidden="true">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>ERP + SUTUR agent</span>
            </div>
            <p className="review-outcome">{review.outcome}</p>
            <div className="review-profile">
              <Image
                alt={`Portrait of ${review.name}`}
                className="review-avatar"
                height={256}
                src={review.image}
                width={256}
              />
              <div className="review-identity">
                <h3>{review.name}</h3>
                <p className="review-position">{review.position}</p>
                <p className="review-company">{review.company}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
