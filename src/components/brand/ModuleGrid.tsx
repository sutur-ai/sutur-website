import { odooModules } from '@/content/services';
import styles from './ModuleGrid.module.css';

export function ModuleGrid() {
  return (
    <div className={styles.grid} role="list" aria-label="Odoo modules and custom development services">
      {odooModules.map(({ name, description, icon, ...module }, index) => (
        <article className={styles.module} role="listitem" key={name}>
          <div className={styles.topline}>
            <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
            <div className={styles.logo}>
              <img src={icon} alt={`${name} logo`} width={72} height={72} />
            </div>
          </div>
          <div className={styles.information}>
            <p className={styles.overline}>{'category' in module ? module.category : 'Odoo module'}</p>
            <h3>{name}</h3>
            <p className={styles.description}>{description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
