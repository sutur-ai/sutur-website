import { SignalDot } from '@/components/ui/SignalDot';

const institutions = [
  {
    name: 'University of Toronto',
    brand: 'utoronto',
    logo: '/brand/founders/university-of-toronto.svg',
  },
  {
    name: 'UCLouvain',
    brand: 'uclouvain',
    logo: '/brand/founders/uclouvain.svg',
  },
  {
    name: 'American University of Beirut',
    brand: 'aub',
    logo: '/brand/founders/american-university-of-beirut.png',
  },
  {
    name: 'Boston Consulting Group',
    brand: 'bcg',
    logo: '/brand/founders/boston-consulting-group.png',
  },
];

/*
 * Deliberately not a .scroll-section: this is a slim band that continues the
 * Why us surface rather than a stop the section scroller should land on.
 */
export function FoundersFrom() {
  return (
    <section
      className="founders-from surface-soft"
      id="founders-from"
      aria-labelledby="founders-from-title"
    >
      <h2 id="founders-from-title" className="founders-from-label">
        Founders from<SignalDot />
      </h2>
      <ul className="founders-from-list">
        {institutions.map((institution) => (
          <li key={institution.brand}>
            <img
              src={institution.logo}
              alt={institution.name}
              data-brand={institution.brand}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
