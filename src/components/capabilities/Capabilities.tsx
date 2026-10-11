import { SectionShell } from '@/components/layout/SectionShell';
import { HubVisual } from './HubVisual';
import { PhotoshopVisual } from './PhotoshopVisual';
import { NightShiftVisual } from './NightShiftVisual';
import { MemoryTreeVisual } from './MemoryTreeVisual';
import styles from './Capabilities.module.css';

const features = [
  {
    "title": "Works in your apps",
    "copy": "Email, calendar, CRM, ERP, documents and project tools. Rafic reads, updates and creates across all of them in one go.",
    "ticks": [
      "One request can touch multiple apps",
      "New app? Rafic sets it up, you approve",
      "Every change shows in the chat"
    ]
  },
  {
    "title": "Works on your computer",
    "copy": "Files, folders and the desktop programs your team lives in, from Photoshop to Excel. Rafic uses them the way you would.",
    "ticks": [
      "Opens, edits and exports in your own programs",
      "Keeps a copy of every file it changes",
      "One click stops it, instantly"
    ]
  },
  {
    "title": "Works while you're away",
    "copy": "Log off at six. Rafic takes the night shift: orders, payments, supplier replies, follow-ups. By morning there's a brief waiting for you.",
    "ticks": [
      "Runs on the schedule you give it",
      "Prepares, never sends, while you're away",
      "A morning brief of what needs you"
    ]
  },
  {
    "title": "Learns how you work",
    "copy": "Every decision Rafic makes teaches it something. It files what it learns as skills, habits and reminders, so next time it already knows.",
    "ticks": [
      "Learns from every decision it makes",
      "Saves skills, habits and reminders",
      "Keeps a memory that is yours alone"
    ]
  }
];
const visuals = [HubVisual, PhotoshopVisual, NightShiftVisual, MemoryTreeVisual];
function Check() {
  return <svg className="ic-check" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fde9d8" /><path d="M7.5 12.5l3 3 6-6.5" stroke="#e06f14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Capabilities() {
  return <SectionShell id="what" style={{ paddingTop: 'clamp(48px,5cqi,88px)' }}>
    <div className="wrap">
      <div className="sec-head rv">
        <div className="label"><b>01</b> What Rafic does</div>
        <h2 className="h-section">A colleague that gets it done<span className="dot">.</span></h2>
        <p className="lead">Rafic opens the apps, does the steps and reports back. Four things make that possible.</p>
      </div>
      <div className={styles.feats}>{features.map((feature, index) => {
        const Visual = visuals[index];
        return <div key={feature.title} className={`${styles.feat} ${index % 2 ? styles.flip : ''}`}>
          <div className={`${styles['feat-txt']} rv`}>
            <div className={styles['feat-n']}>0{index + 1}</div>
            <h3>{feature.title}</h3><p>{feature.copy}</p>
            <ul className={styles.ticks}>{feature.ticks.map(tick => <li key={tick}><Check />{tick}</li>)}</ul>
          </div>
          <Visual />
        </div>;
      })}</div>
    </div>
  </SectionShell>;
}
