import Link from 'next/link';

export function AgentHandoffMock() {
  return (
    <div className="agent-handoff-mock" aria-label="Agent workflow example">
      <div className="agent-handoff-topbar">
        <span>Sutur agent</span>
        <b>Permission aware</b>
      </div>
      <div className="agent-handoff-thread">
        <p className="agent-request">Prepare this week&apos;s unpaid-invoice follow-up.</p>
        <div className="agent-context" aria-label="Connected context">
          <span>Odoo Accounting</span>
          <span>Gmail</span>
        </div>
        <div className="agent-thinking" aria-label="Agent checking context">
          <i />
          <i />
          <i />
        </div>
        <div className="agent-handoff-result">
          <small>Ready for approval</small>
          <strong>12 follow-ups drafted.</strong>
          <p>Nothing is sent until a person approves the handoff.</p>
        </div>
      </div>
    </div>
  );
}

const stages = [
  ['01', 'Context enters', 'The request arrives with the relevant Odoo records and communication history.'],
  ['02', 'The agent prepares', 'It checks permissions, gathers the facts, and drafts the repetitive follow-through.'],
  ['03', 'A person decides', 'The result stops at a clear approval point. Nothing is sent silently.'],
] as const;

export function AgentActionDemo() {
  return (
    <section className="section agent-action surface-ink" aria-labelledby="agent-action-title">
      <div className="agent-action-copy">
        <h2 id="agent-action-title">Busywork moves. Control stays with your team.</h2>
        <p className="lead">
          A practical agent can assemble context and prepare the next step without
          pretending judgment no longer matters.
        </p>
        <Link className="text-link" href="/product">See the connected system →</Link>
      </div>

      <div className="agent-action-demo">
        <AgentHandoffMock />
        <ol aria-label="Agent workflow stages">
          {stages.map(([number, title, description]) => (
            <li key={number}>
              <b>{number}</b>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
