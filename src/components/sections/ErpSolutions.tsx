import ModuleMap from '@/components/brand/ModuleMap';
import SectionLabel from '@/components/ui/SectionLabel';
import { ERP_MODULES, otherModules } from '@/content/services';

export function ErpSolutions() {
  return (
    <div className="container">
      <section className="section" id="solutions">
        <div className="erp-split">
          <div>
            <SectionLabel>One tailored system</SectionLabel>
            <h2 style={{ marginTop: '1rem' }}>ERP designed around how your business actually works.</h2>
            <p className="lead" style={{ marginTop: '1rem' }}>
              Sutur brings essential operations into a coherent Odoo environment, then adapts and develops what your workflows require.
            </p>
            <div className="module-tags">
              {ERP_MODULES.map((m) => (
                <span key={m.id} className="module-tag">{m.label}</span>
              ))}
            </div>
            <p className="muted" style={{ marginTop: '1rem', fontSize: '.88rem' }}>
              Beyond the core, we can selectively connect {otherModules.join(', ').toLowerCase()}, where relevant.
            </p>
          </div>
          <div className="erp-visual">
            <ModuleMap />
          </div>
        </div>
      </section>
    </div>
  );
}