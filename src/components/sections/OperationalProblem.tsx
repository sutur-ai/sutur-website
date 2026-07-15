import { OPERATIONAL_ISSUES } from '@/content/services';
import SectionLabel from '@/components/ui/SectionLabel';

export function OperationalProblem() {
  return (
    <div className="container">
      <section className="section problem" aria-labelledby="problem-title">
        <div>
          <SectionLabel>The operational gap</SectionLabel>
          <h2 id="problem-title">Growth gets harder when the business is scattered.</h2>
          <p className="lead" style={{ marginTop: '1rem' }}>
            A company should not need to reconstruct its own story across spreadsheets, messages, paper, and disconnected software.
          </p>
        </div>
        <ol className="issue-list">
          {OPERATIONAL_ISSUES.map((item, i) => (
            <li key={item.id} className="issue-card glass">
              <span className="issue-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}