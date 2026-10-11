import { SectionShell } from '../layout/SectionShell';
import styles from './Control.module.css';

export function Control() {
  return <SectionShell id="control" className="sec dark"><div className={`wrap ${styles.ctrl}`}>
    <div className="rv"><div className="label"><b>03</b> Control</div>
      <h2 className={`h-section ${styles.heading}`}>Powerful where it <span className="nowrap">helps<span className="dot">.</span></span> Careful where it <span className="nowrap">counts<span className="dot">.</span></span></h2>
      <div className={styles['ctrl-list']}>
        <div className={styles['ctrl-item']}>
          <div className={styles['ctrl-ic']}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"></path></svg></div>
          <h4>Asks before it sends or deletes</h4>
          <p>Drafts and edits flow. Anything that leaves the company or can&apos;t be undone waits for your yes.</p>
        </div>
        <div className={styles['ctrl-item']}>
          <div className={styles['ctrl-ic']}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg></div>
          <h4>A private assistant for each person</h4>
          <p>Every person&apos;s Rafic, memory and connections are kept apart from everyone else&apos;s.</p>
        </div>
        <div className={styles['ctrl-item']}>
          <div className={styles['ctrl-ic']}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg></div>
          <h4>Every step in plain sight</h4>
          <p>Each app it opens and each change it makes shows up in the chat as it happens.</p>
        </div>
        <div className={styles['ctrl-item']}>
          <div className={styles['ctrl-ic']}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg></div>
          <h4>Stop it at any time</h4>
          <p>One click stops Rafic mid-task, wherever it is working.</p>
        </div>
      </div>
    </div>
  </div></SectionShell>;
}
