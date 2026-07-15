import { ENGAGEMENT_STAGES } from '@/content/process';
import SectionLabel from '@/components/ui/SectionLabel';

export function HowItWorks() {
  return (
    <div className="container">
      <section className="section" id="process">
        <SectionLabel>A clear route to launch</SectionLabel>
        <h2 style={{ marginTop: '1rem' }}>See the direction before the build begins.</h2>
        <ol className="timeline">
          {ENGAGEMENT_STAGES.map((stage, i) => (
            <li key={stage.title}>
              <span className="step-num">{i + 1}</span>
              <h3 style={{ marginTop: '.5rem' }}>{stage.title}</h3>
              <p style={{ marginTop: '.3rem' }}>{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}