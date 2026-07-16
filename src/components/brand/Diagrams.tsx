export function HeroOrb() {
  return (
    <div className="hero-orb" aria-hidden="true">
      <div className="orb-glow" />
      <div className="orb-core" />
      <span className="orb-ring orb-ring-1" />
      <span className="orb-ring orb-ring-2" />
    </div>
  );
}
export function OperationsDiagram() { return <div className="ops-visual" aria-label="A connected operations diagram"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><div className="ops-core">S</div><div className="ops-node node-finance">Finance</div><div className="ops-node node-sales">Sales</div><div className="ops-node node-team">Teams</div><div className="ops-node node-ops">Operations</div></div>; }
export function ModuleMap() { return <div className="module-map" aria-label="Odoo modules connected to a central system"><div className="module-center">Odoo</div>{['CRM','Sales','Stock','Accounts','Purchase','Build'].map((item, i) => <span className={`module-node mn-${i}`} key={item}>{item}</span>)}</div>; }
export function KnowledgeDiagram() { return <div className="knowledge-diagram"><div className="knowledge-core">Agent</div><span>Policies</span><span>Orders</span><span>Notes</span><span>Reports</span><i/><i/><i/><i/></div>; }
