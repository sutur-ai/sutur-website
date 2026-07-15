import AgentKnowledgeDiagram from '@/components/brand/AgentKnowledgeDiagram';
import SectionLabel from '@/components/ui/SectionLabel';
import { agentPatterns } from '@/content/services';

export function AgentSolutions() {
  return (
    <div className="container">
      <section className="section" id="agents">
        <div className="agents-intro">
          <SectionLabel>Practical agents</SectionLabel>
          <h2 style={{ marginTop: '1rem' }}>Useful intelligence, inside clear boundaries.</h2>
          <p className="lead" style={{ marginTop: '1rem' }}>
            Agents are tailored to approved workflows and authorized company resources—not given unrestricted access or authority.
          </p>
        </div>
        <div className="agents-grid">
          <AgentKnowledgeDiagram />
          <div>
            {agentPatterns.map((a, i) => (
              <article key={a.title} className="agent-card glass">
                <span className="agent-badge">0{i + 1}</span>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}