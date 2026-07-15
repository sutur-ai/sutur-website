import SectionLabel from '@/components/ui/SectionLabel';

const points: [string, string][] = [
  ['Current technical thinking', 'We stay aware of modern technologies and emerging operational needs.'],
  ['Efficient delivery', 'A focused approach keeps implementation practical and reduces avoidable complexity.'],
  ['Responsive partnership', 'Sutur remains available through implementation, launch, and close follow-up.'],
  ['Competitive pricing', 'The solution and delivery model are scoped to create a sensible commercial fit.'],
];

export function WhySutur() {
  return (
    <div className="container">
      <section className="section">
        <div className="why-head">
          <SectionLabel>Why Sutur</SectionLabel>
          <h2 style={{ marginTop: '1rem' }}>Modern capability, grounded in your operations.</h2>
        </div>
        <div className="why-grid">
          {points.map(([title, desc], i) => (
            <article key={title} className="why-card">
              <div className="why-num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}