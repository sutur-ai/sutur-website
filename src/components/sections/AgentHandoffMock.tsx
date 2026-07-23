import { SignalDot } from '@/components/ui/SignalDot';

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
          <strong>12 follow-ups drafted<SignalDot /></strong>
          <p>Nothing is sent until a person approves the handoff.</p>
        </div>
      </div>
    </div>
  );
}