'use client';

import { APP_ROW_1, APP_ROW_2, type App } from '../../content/apps';
import { useInView } from '../../lib/useInView';
import styles from './AppsStrip.module.css';

function AppCards({ apps, duplicate = false, loading }: { apps: readonly App[]; duplicate?: boolean; loading: 'eager' | 'lazy' }) {
  return <div className={styles.copy} aria-hidden={duplicate ? true : undefined}>
    {apps.map(app => <div className={styles.app} key={app.slug}>
      <span className={styles['app-tile']}>
        <img loading={loading} decoding="async" src={`/brand/apps/${app.slug}.svg`} width={23} height={23} alt="" />
      </span>
      <span className={styles['app-n']}>{app.name}</span>
      <span className={styles['app-d']}>{app.description}</span>
    </div>)}
  </div>;
}

export function AppsStrip() {
  const { ref, inView } = useInView<HTMLElement>();

  return <section ref={ref} className={`${styles.apps}${inView ? '' : ' idle'}`} aria-label="Apps Rafic works with">
    <p className={styles['apps-k']}>Office, finance, sales, design, video, 3D. If your team works in it, Rafic can too.</p>
    {[APP_ROW_1, APP_ROW_2].map((apps, index) => <div className={styles.marq} key={index}>
      <div className={`${styles.track}${index === 1 ? ` ${styles.rev}` : ''}`}>
        <AppCards apps={apps} loading={index === 0 ? 'eager' : 'lazy'} />
        <AppCards apps={apps} loading={index === 0 ? 'eager' : 'lazy'} duplicate />
      </div>
    </div>)}
    <div className={`${styles['apps-foot']} wrap`}>
      <span className={styles.any}><span className={styles['any-plus']} aria-hidden="true">+</span>Any app with an API. Rafic proposes the connection, you approve it.</span>
    </div>
  </section>;
}
