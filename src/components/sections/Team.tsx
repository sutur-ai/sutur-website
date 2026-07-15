import { team } from '@/content/team';
import SectionLabel from '@/components/ui/SectionLabel';

export function Team() {
  return (
    <div className="container">
      <section className="section team-wrap" id="team">
        <div>
          <SectionLabel>The people behind the system</SectionLabel>
          <h2 style={{ marginTop: '1rem' }}>The people behind Sutur.</h2>
          <p style={{ marginTop: '1rem', color: 'var(--muted-ink)' }}>
            Approved names, roles, bios, photos, credentials, and links will be added here before publication.
          </p>
        </div>
        <div className="team-grid">
          {team.map((m, i) => (
            <article key={i} className="team-card">
              <div className="team-portrait" aria-hidden>{String(i + 1).padStart(2, '0')}</div>
              <h3>{m.name}</h3>
              <strong>{m.role}</strong>
              <p>{m.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}