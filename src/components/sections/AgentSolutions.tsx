import AgentKnowledgeDiagram from '@/components/brand/AgentKnowledgeDiagram';
import SectionLabel from '@/components/ui/SectionLabel';
import { agentPatterns } from '@/content/services';

export function AgentSolutions() {
  return (
    <section className="section dark-section" id="agents">
      <div className="container">
        <div className="agents-intro">
          <SectionLabel>Practical agents</SectionLabel>
          <h2 style={{ marginTop: '1rem' }}>Useful intelligence, inside clear boundaries.</h2>
          <p className="lead" style={{ marginTop: '1rem' }}>
            Agents are tailored to approved workflows and authorized company resources—not given unrestricted access or authority.
          </p>
        </div>
        <div className="agents-layout">
          <div className="diagram-wrap">
            <AgentKnowledgeDiagram />
          </div>
          <div className="agent-list">
            {agentPatterns.map((a, i) => (
              <article key={a.title} className="agent-card">
                <span className="agent-badge">0{i + 1}</span>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}