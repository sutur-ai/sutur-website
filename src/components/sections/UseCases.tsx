'use client';
import { useState } from 'react';
import { SectionShell } from '../layout/SectionShell';
import { SX_TEAMS } from '../../content/useCases';
import styles from './UseCases.module.css';

export function UseCases() {
  const [team, setTeam] = useState<keyof typeof SX_TEAMS>('ops');
  return <SectionShell id="teams" className="sec glow" style={{ paddingTop: 0 }}><div className="wrap">
    <div className="sec-head rv"><div className="label"><b>02</b> Use cases</div>
      <h2 className="h-section">Ask it the way you&apos;d ask a <span className="nowrap">colleague<span className="dot">.</span></span></h2></div>
    <div className={styles.tabs} role="group" aria-label="Choose a team">
      {(Object.keys(SX_TEAMS) as (keyof typeof SX_TEAMS)[]).map(key => <button
        key={key} type="button" className={`${styles.tab} ${team === key ? styles.on : ''}`}
        aria-pressed={team === key} aria-controls="team-asks" onClick={() => setTeam(key)}
      >{SX_TEAMS[key].label}</button>)}
    </div>
    <div id="team-asks" className={styles.asks} aria-live="polite" aria-atomic="true">
      {SX_TEAMS[team].asks.map(ask => <div key={ask.q} className={styles.ask}>
        <p className={styles['ask-q']}>“{ask.q}”</p>
        <div className={styles['ask-uses']}>Rafic uses {ask.apps.map(app => <span key={app} className={styles.pill}>{app}</span>)}</div>
      </div>)}
    </div>
  </div></SectionShell>;
}
