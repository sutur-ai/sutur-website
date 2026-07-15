import { OPERATIONAL_ISSUES } from '@/content/services';
import SectionLabel from '@/components/ui/SectionLabel';

export function OperationalProblem() {
  return (
    <section className="section dark-section" aria-labelledby="problem-title">
      <div className="container">
        <div className="split-2">
          <div>
            <SectionLabel>The operational gap</SectionLabel>
            <h2 id="problem-title">Growth gets harder when the business is scattered.</h2>
            <p className="lead" style={{ marginTop: '1.2rem' }}>
              A company should not need to reconstruct its own story across spreadsheets, messages, paper, and disconnected software.
            </p>
          </div>
          <div className="issue-list">
            {OPERATIONAL_ISSUES.map((item, i) => (
              <div key={item.id} className="issue-card">
                <span className="issue-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}