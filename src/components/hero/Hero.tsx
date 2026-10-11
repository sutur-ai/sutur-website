'use client';
import { SectionShell } from '../layout/SectionShell';
import { useInView } from '../../lib/useInView';
import { usePrefersReducedMotion } from '../../lib/motion';
import { SX_SCEN, SX_OTHERS, type HeroScenarioId } from '../../content/heroScenarios';
import { useHeroScenario } from './useHeroScenario';
import styles from './Hero.module.css';

const cx = (...names: string[]) => names.map(name => styles[name]).join(' ');
function Icon({ kind = 'check', size = 16 }: { kind?: 'check' | 'arrow' | 'up' | 'down' | 'right' | 'deny' | 'edit' | 'search' | 'bell'; size?: number }) {
  const paths = { check: 'M20 6L9 17l-5-5', arrow: 'M5 12h14M13 6l6 6-6 6', up: 'M12 19V5M6 11l6-6 6 6', down: 'M6 9l6 6 6-6', right: 'M9 6l6 6-6 6', deny: 'M6 6l12 12M18 6L6 18', edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', search: 'M20 20l-3.5-3.5', bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0' };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={kind === 'edit' || kind === 'search' || kind === 'bell' ? 1.8 : kind === 'arrow' ? 2.2 : kind === 'down' || kind === 'right' ? 2 : size === 10 ? 3 : size === 11 ? 2.6 : 2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind === 'search' && <circle cx="11" cy="11" r="7" />}<path d={paths[kind]} /></svg>;
}
function Mark({ soft = false }: { soft?: boolean }) {
  return <img src={`/brand/design-system/sutur-icon-${soft ? 'soft' : 'deep'}.webp`} width={140} height={168} decoding="async" alt="" aria-hidden="true" />;
}

export function Hero() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const { state, view: v, play, decide } = useHeroScenario(inView, reduced);
  const S = v.scenario;
  return <SectionShell id="top" className={styles.hero}>
    <div className={`wrap ${styles['hero-grid']}`}>
      <div>
        <span className={styles.eyebrow}><Mark soft />Meet Rafic, the AI assistant by Sutur</span>
        <h1 className="disp">Rafic does the <span className="nowrap">work<span className="dot">.</span></span><br /><em>You approve what <span className="nowrap">matters<span className="dot">.</span></span></em></h1>
        <p className="lead">One assistant for your whole team. It works in your email, your business apps and on your computer, keeps going while you&apos;re away, and asks before anything is sent or deleted.</p>
        <div className={styles['hero-actions']}><a className="btn" href="#book">Book a demo <Icon kind="arrow" /></a><a className="btn-ghost" href="#what">See what it does</a></div>
        <div className={styles.trust}>{['Asks before it sends', 'Private to each person', 'Works in the tools you have'].map(text => <span key={text} className={styles['trust-i']}><Icon />{text}</span>)}</div>
      </div>
      <div>
        <div className={styles.try} role="group" aria-label="Watch Rafic do a task">Watch it:
          {(Object.keys(SX_SCEN) as HeroScenarioId[]).map(id => <button type="button" key={id} className={cx('chip', ...(id === state.scenario ? ['on'] : []))} aria-pressed={id === state.scenario} onClick={() => play(id)}>{SX_SCEN[id].chip}</button>)}
        </div>
        <div ref={ref} className={`${styles.rf}${!inView || reduced ? ' idle' : ''}`} data-anim data-step={v.step} role="region" aria-label="The Rafic app at work">
          <div className={styles['rf-win']} aria-hidden="true"><i /><i /><i /></div>
          <div className={styles['rf-body']}>
            <aside className={styles['rf-side']}>
              <div className={styles['rf-brand']}><Mark />Rafic</div>
              <div className={styles['rf-nav']}><Icon kind="edit" />New chat</div>
              <div className={styles['rf-nav']}><Icon kind="search" />Search</div>
              <div className={styles['rf-nav']}><Icon kind="bell" />Needs you{v.showApproval && <span className={styles['rf-badge']}>1</span>}</div>
              <div className={styles['rf-sec']}>Your chats</div>
              <div className={cx('rf-chat', 'on')}>{S.title}{v.busy && <div className={styles['rf-working']}><span className={styles['rf-spin']} aria-hidden="true" />Working</div>}</div>
              {SX_OTHERS.map(title => <div key={title} className={styles['rf-chat']}>{title}</div>)}
              <div className={styles['rf-user']}><span className={styles['rf-av']}>MH</span>Maya Haddad</div>
            </aside>
            <div className={styles['rf-main']}>
              <div className={styles['rf-head']}>{S.title}</div>
              <div className={styles['rf-msgs']}>
                <div key={state.scenario} className={styles['rf-you']}>{S.ask}</div>
                <div className={styles['rf-ai']}><span className={styles['rf-ai-av']}><Mark /></span>
                  <div className={styles['rf-ai-col']}>
                    {v.tracing && <><div className={styles['rf-trace-h']}><b>{v.curLabel}</b> {v.step + 1}s <Icon kind="down" size={12} /></div>
                      <div className={styles['rf-steps']}>{v.tools.map(t => <div key={t.label} className={styles['rf-step']}><span className={cx('rf-step-ic', ...(t.run ? ['run'] : []))} aria-hidden="true">{!t.run && <Icon size={11} />}</span><span>{t.label}</span>{!t.run && <span className={styles['rf-step-t']}>900 ms</span>}</div>)}</div></>}
                    {v.answered && <><div className={styles['rf-trace-h']}>Thought for {S.secs}s <Icon kind="right" size={12} /></div>
                      <p className={styles['rf-md']}>{S.a}<strong>{S.b}</strong>{S.c}<strong>{S.d}</strong>{S.e}</p>
                      <div className={styles['rf-table']}><table><thead><tr>{S.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{S.rows.map((r, i) => <tr key={i}>{r.cells.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
                      <p className={styles['rf-md']}>{S.after}</p></>}
                    {v.showApproval && <div className={styles['rf-appr']}><p>{S.approval}</p><div className={styles['rf-appr-row']}><button type="button" className={cx('rf-btn', 'deny')} onClick={() => decide('deny')}><Icon kind="deny" size={13} />Deny</button><button type="button" className={cx('rf-btn', 'ok')} onClick={() => decide('approve')}><Icon size={13} />Approve</button></div></div>}
                    {state.outcome && <><div className={styles['rf-done']} role="status"><span className={styles['rf-done-ic']}><Icon size={10} /></span>{v.doneLine}</div><p className={styles['rf-md']}>{v.doneText}</p><button type="button" className={styles['rf-replay']} onClick={() => play(state.scenario)}>Play again</button></>}
                  </div>
                </div>
              </div>
              <div className={cx('rf-comp', ...(v.busy ? ['busy'] : []))}><span className={styles['rf-comp-t']}>{v.compText}</span><span className={styles['rf-send']} aria-hidden="true">{v.busy ? <svg width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" rx="2" fill="#fff" /></svg> : <Icon kind="up" size={14} />}</span></div>
              <div className={styles['rf-foot']}>Rafic can make mistakes. Check anything important.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionShell>;
}
