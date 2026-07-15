import { ENGAGEMENT_STAGES } from '@/content/process';
import SectionLabel from '@/components/ui/SectionLabel';

export function HowItWorks() {
  return (
    <div className="container">
      <section className="section" id="process">
        <div className="process-head">
          <div>
            <SectionLabel>A clear route to launch</SectionLabel>
            <h2 style={{ marginTop: '1rem' }}>See the direction before the build begins.</h2>
          </div>
        </div>
        <ol className="timeline">
          {ENGAGEMENT_STAGES.map((stage, i) => (
            <li key={stage.title}>
              <div className="num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}