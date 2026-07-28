import { SignalDot } from '@/components/ui/SignalDot';

const universities = [
  {
    name: 'University of Toronto',
    brand: 'utoronto',
    logo: '/brand/universities/university-of-toronto.svg',
  },
  {
    name: 'UCLouvain',
    brand: 'uclouvain',
    logo: '/brand/universities/uclouvain.svg',
  },
  {
    name: 'American University of Beirut',
    brand: 'aub',
    logo: '/brand/universities/american-university-of-beirut.png',
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
        {universities.map((university) => (
          <li key={university.brand}>
            <img
              src={university.logo}
              alt={university.name}
              data-brand={university.brand}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
