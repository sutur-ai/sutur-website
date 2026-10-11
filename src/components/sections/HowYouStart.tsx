import { SectionShell } from '../layout/SectionShell';
import { Founders } from './Founders';
import styles from './HowYouStart.module.css';

export function HowYouStart() {
  return <SectionShell id="start" className="sec glow"><div className="wrap">
    <div className="sec-head rv"><div className="label"><b>04</b> How you start</div>
      <h2 className="h-section">Drop it <span className="nowrap">in<span className="dot">.</span></span> Use it <span className="nowrap">fully<span className="dot">.</span></span></h2><p className="lead">No setup project, no migration. After one call, your team is using Rafic to its full potential.</p></div>
    <div className={`${styles.steps3} rv`}>
      <div className={styles.st}><div className={styles['st-n']}>01</div><h3>A 30-minute call</h3><p>We look at how your team works and which apps Rafic should plug into.</p></div>
      <div className={styles.st}><div className={styles['st-n']}>02</div><h3>Plugged in</h3><p>Rafic connects to the tools you already use. Nothing to migrate, nothing to move.</p></div>
      <div className={styles.st}><div className={styles['st-n']}>03</div><h3>Full power from day one</h3><p>Everyone on the team asks Rafic for anything, across every connected app, from the first day.</p></div>
    </div>
    <Founders />
  </div></SectionShell>;
}
