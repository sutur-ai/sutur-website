'use client';

import { useInView } from '../../lib/useInView';
import styles from './Hub.module.css';

const apps = [
  { slug: 'microsoftoutlook', x: 16, y: 20, delay: '0s' },
  { slug: 'microsoft-teams', x: 50, y: 12, delay: '-1s' },
  { slug: 'hubspot', x: 84, y: 20, delay: '-2s' },
  { slug: 'odoo', x: 90, y: 50, delay: '-3s' },
  { slug: 'google-drive', x: 84, y: 80, delay: '-4s' },
  { slug: 'slack', x: 50, y: 88, delay: '-5s' },
  { slug: 'jira', x: 16, y: 80, delay: '-1.5s' },
  { slug: 'gmail', x: 10, y: 50, delay: '-3.5s' },
];
const notes = [
  { text: '3 deals updated in HubSpot', x: 60, y: 30, delay: '0s' },
  { text: 'Invoice matched in Odoo', x: 56, y: 64, delay: '4s' },
  { text: 'Reply drafted in Outlook', x: 18, y: 34, delay: '2s' },
];

export function HubVisual() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`vis rv${inView ? '' : ' idle'}`} role="img" aria-label="Rafic at the centre, connected to Outlook, Teams, HubSpot, Odoo, Drive, Slack, Jira and Gmail">
      <div className={styles.hub}>
        <svg className={styles['hub-lines']} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {apps.map((app, index) => <line key={app.slug} className={index % 2 ? styles.in : undefined} x1="50" y1="50" x2={app.x} y2={app.y} />)}
        </svg>
        {apps.map(app => (
          <div key={app.slug} className={styles.node} style={{ left: `${app.x}%`, top: `${app.y}%`, animationDelay: app.delay }}>
            <img loading="lazy" decoding="async" src={`/brand/apps/${app.slug}.svg`} width="35" height="35" alt="" />
          </div>
        ))}
        <div className={styles.core}><img loading="lazy" decoding="async" src="/brand/design-system/sutur-icon-soft.webp" width="140" height="168" alt="" /></div>
        {notes.map(note => (
          <div key={note.text} className={styles.ping} style={{ left: `${note.x}%`, top: `${note.y}%`, animationDelay: note.delay }}>
            <span className={styles['ping-ok']}>✓</span>{note.text}
          </div>
        ))}
      </div>
    </div>
  );
}
