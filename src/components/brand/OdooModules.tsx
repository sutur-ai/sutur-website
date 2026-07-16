import styles from './OdooModules.module.css';

const modules = [
  ['CRM', '/brand/odoo-modules/crm.png'],
  ['Sales', '/brand/odoo-modules/sales.png'],
  ['Accounting', '/brand/odoo-modules/accounting.png'],
  ['Inventory', '/brand/odoo-modules/inventory.png'],
  ['Purchasing', '/brand/odoo-modules/purchasing.png'],
  ['Manufacturing', '/brand/odoo-modules/manufacturing.png'],
] as const;

export function OdooModules() {
  return <div className={styles.modules} aria-label="Core Odoo modules">{modules.map(([name, icon]) => <div className={styles.module} key={name}><img src={icon} alt="" width={56} height={56} /><span>{name}</span></div>)}</div>;
}
