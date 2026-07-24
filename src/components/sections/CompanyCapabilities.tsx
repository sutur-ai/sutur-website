'use client';

import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent } from 'react';
import styles from './CompanyCapabilities.module.css';
import { ArrowIcon } from '@/components/ui/icons';
import { SignalDot } from '@/components/ui/SignalDot';
import {
  HONEYCOMB_GEOMETRY,
  INTEGRATION_VIEW_BOX,
  integrationLayout,
} from './CompanyCapabilities.geometry';

export const AGENT_PROMPT =
  'I am running late 1h over my schedule, check my teams meetings and send an email to every person I have a meeting with to rearrange my meetings.';

export const AGENT_MEETINGS = [
  { time: '10:30', newTime: '11:30', title: 'Product review', person: 'Maya Nassar' },
  { time: '13:00', newTime: '14:00', title: 'Operations sync', person: 'Karim Haddad' },
  { time: '15:30', newTime: '16:30', title: 'Partner call', person: 'Lina Mansour' },
] as const;

export const AGENT_SEQUENCE = {
  collapseMs: 700,
  typeIntervalMs: 18,
  typedHoldMs: 220,
  understandingMs: 900,
  calendarMs: 1900,
  draftsMs: 2100,
  validatedMs: 820,
  appSelectMs: 1350,
  teamsOpenMs: 1650,
  gmailOpenMs: 1750,
  restoreMs: 1100,
} as const;

export type AgentPhase =
  | 'idle'
  | 'collapsing'
  | 'typing'
  | 'understanding'
  | 'checking'
  | 'drafting'
  | 'validated'
  | 'selecting-teams'
  | 'opening-teams'
  | 'selecting-gmail'
  | 'opening-gmail'
  | 'restoring'
  | 'restored';
const integrationCount = integrationLayout.flat().length;

const capabilities = [
  {
    number: '01',
    label: 'AI agent architecture',
    title: 'An AI layer that understands the full picture',
    description:
      'We connect your ERP, documents, messages, and internal knowledge through a permission-aware agent architecture. It brings context into every step and removes repetitive follow-through.',
    cta: 'Design your agent architecture',
    visual: 'agent',
  },
  {
    number: '02',
    label: 'ERP implementation',
    title: 'One reliable system for the whole operation',
    description:
      'We implement Odoo around your real operation — from CRM and accounting to inventory, purchasing, and delivery — so your team works from one source of truth.',
    cta: 'Plan your ERP implementation',
    visual: 'erp',
  },
  {
    number: '03',
    label: 'Custom development',
    title: 'Built for you, grounded in Lebanon',
    description:
      'We design software around your workflow and the Lebanese market, including bilingual teams, local payment realities, and the exceptions generic products miss.',
    cta: 'Discuss your custom build',
    visual: 'custom',
  },
] as const;

const odooApps = [
  { name: 'Discuss', icon: '/brand/odoo-apps/discuss.png' },
  { name: 'Calendar', icon: '/brand/odoo-apps/calendar.png' },
  { name: 'Appointments', icon: '/brand/odoo-apps/appointments.png' },
  { name: 'Contacts', icon: '/brand/odoo-apps/contacts.png' },
  { name: 'CRM', icon: '/brand/odoo-modules/crm.png' },
  { name: 'Sales', icon: '/brand/odoo-modules/sales.png' },
  { name: 'Dashboards', icon: '/brand/odoo-apps/dashboards.png' },
  { name: 'Point of Sale', icon: '/brand/odoo-apps/point-of-sale.png' },
  { name: 'Accounting', icon: '/brand/odoo-modules/accounting.png' },
  { name: 'Website', icon: '/brand/odoo-modules/ecommerce.png' },
  { name: 'Inventory', icon: '/brand/odoo-modules/inventory.png' },
  { name: 'Purchase', icon: '/brand/odoo-modules/purchasing.png' },
  { name: 'Manufacturing', icon: '/brand/odoo-modules/manufacturing.png' },
  { name: 'Settings', icon: '/brand/odoo-apps/settings.png' },
] as const;

export type VisualKind = (typeof capabilities)[number]['visual'];

function WindowChrome({ title }: { title: string }) {
  return (
    <div className={styles.windowChrome}>
      <div className={styles.windowControls}>
        <i />
        <i />
        <i />
      </div>
      <span>{title}</span>
    </div>
  );
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return reducedMotion;
}

function AgentAvatar() {
  return (
    <span className={styles.agentAvatar}>
      <img src="/brand/design-system/sutur-agent-favicon.png" alt="" />
    </span>
  );
}

function UserAvatar() {
  return (
    <span className={styles.agentUserAvatar} data-agent-user-avatar>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 20c.55-4.15 2.75-6.25 6.5-6.25s5.95 2.1 6.5 6.25" />
      </svg>
    </span>
  );
}

function AgentPersistentApps({ phase }: { phase: AgentPhase }) {
  const teamsExpanded = phase === 'checking';
  const gmailExpanded = phase === 'drafting';
  const validated = [
    'validated',
    'selecting-teams',
    'opening-teams',
    'selecting-gmail',
    'opening-gmail',
  ].includes(phase);

  return (
    <div className={styles.agentPersistentApps} data-agent-persistent-apps>
      <section
        className={`${styles.agentCompactApp} ${teamsExpanded ? styles.agentCompactAppExpanded : ''}`}
        data-agent-window="teams"
        data-agent-app-collapsed={!teamsExpanded}
      >
        <header>
          <img src="/brand/integrations/microsoft-teams.svg" alt="" />
          <p>
            <strong>Teams calendar</strong>
            <span>{teamsExpanded ? 'Checking today’s meetings' : '3 meetings found'}</span>
          </p>
          {validated || phase === 'drafting' ? <b>✓</b> : <i className={styles.agentSpinner} />}
        </header>
        {teamsExpanded && (
          <div className={styles.agentMeetingList}>
            {AGENT_MEETINGS.map((meeting, index) => (
              <div
                className={styles.agentMeeting}
                data-agent-meeting
                data-agent-window-row
                key={meeting.person}
                style={{ '--item-index': index } as CSSProperties}
              >
                <time>{meeting.time}</time>
                <p><strong>{meeting.title}</strong><span>{meeting.person}</span></p>
                <i />
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        className={`${styles.agentCompactApp} ${styles.agentCompactGmail} ${gmailExpanded ? styles.agentCompactAppExpanded : ''}`}
        data-agent-window="gmail"
        data-agent-app-collapsed={!gmailExpanded}
      >
        <header>
          <img src="/brand/integrations/gmail.svg" alt="" />
          <p>
            <strong>Gmail drafts</strong>
            <span>{gmailExpanded ? 'Personalizing 3 messages' : validated ? '3 drafts ready' : 'Waiting for meeting details'}</span>
          </p>
          {validated ? <b>✓</b> : gmailExpanded ? <i className={styles.agentSpinner} /> : <em>Next</em>}
        </header>
        {gmailExpanded && (
          <div className={styles.agentDraftList}>
            {AGENT_MEETINGS.map((meeting, index) => (
              <div
                className={styles.agentDraft}
                data-agent-draft
                data-agent-window-row
                key={meeting.person}
                style={{ '--item-index': index } as CSSProperties}
              >
                <span>{meeting.person.split(' ').map((name) => name[0]).join('')}</span>
                <p><strong>{meeting.person}</strong><small>Move {meeting.time} · {meeting.title}</small></p>
                <i>Drafting</i>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AgentTaskPanel({ phase }: { phase: AgentPhase }) {
  if (['idle', 'collapsing', 'typing', 'restoring', 'restored'].includes(phase)) return null;

  if (phase === 'understanding') {
    return (
      <div className={styles.agentMessage} data-agent-message data-agent-task="understanding">
        <AgentAvatar />
        <div className={styles.agentThinking}>
          <span><i /><i /><i /></span>
          <p>Understanding your request</p>
        </div>
      </div>
    );
  }

  const status = phase === 'checking'
    ? 'I’m checking today’s Teams meetings.'
    : phase === 'drafting'
      ? 'I found 3 meetings. I’m drafting the emails now.'
      : 'Everything is ready for your review.';

  return (
    <div className={styles.agentMessage} data-agent-message data-agent-task={phase}>
      <AgentAvatar />
      <div className={styles.agentMessageContent}>
        <div className={styles.agentMessageBubble}>
          <p>{status}</p>
        </div>
        <AgentPersistentApps phase={phase} />
      </div>
    </div>
  );
}

function TeamsCalendarWindow({ opening }: { opening: boolean }) {
  return (
    <section
      className={`${styles.agentReviewWindow} ${styles.teamsReviewWindow} ${opening ? styles.agentReviewWindowOpening : ''}`}
      data-agent-review-window="teams"
      data-agent-window-opening={opening}
    >
      <header className={styles.reviewTitlebar}>
        <div className={styles.reviewAppTitle}>
          <img src="/brand/integrations/microsoft-teams.svg" alt="" />
          <strong>Microsoft Teams</strong>
        </div>
        <div className={styles.reviewWindowControls}><i /><i /><i /></div>
      </header>
      <div className={styles.teamsAppShell}>
        <nav className={styles.teamsRail} aria-label="Teams sections">
          {['Activity', 'Chat', 'Calendar', 'Calls'].map((item) => <span key={item} data-active={item === 'Calendar'}>{item.slice(0, 1)}<small>{item}</small></span>)}
        </nav>
        <div className={styles.teamsCalendar}>
          <header><p><strong>Calendar</strong><span>Today · July 24</span></p><button type="button">New meeting</button></header>
          <div className={styles.teamsDayHeader}><b>Today</b><span>Friday 24</span></div>
          <div className={styles.teamsTimeline}>
            {AGENT_MEETINGS.map((meeting) => (
              <div className={styles.teamsCalendarRow} data-agent-calendar-event key={meeting.person}>
                <time>{meeting.time}</time>
                <article>
                  <strong>{meeting.title}</strong>
                  <span>{meeting.person}</span>
                  <small>Move to {meeting.newTime}</small>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GmailDraftWindow({ opening }: { opening: boolean }) {
  return (
    <section
      className={`${styles.agentReviewWindow} ${styles.gmailReviewWindow} ${opening ? styles.agentReviewWindowOpening : ''}`}
      data-agent-review-window="gmail"
      data-agent-window-opening={opening}
    >
      <header className={`${styles.reviewTitlebar} ${styles.gmailTitlebar}`}>
        <div className={styles.reviewAppTitle}>
          <img src="/brand/integrations/gmail.svg" alt="" />
          <strong>Gmail</strong>
        </div>
        <div className={styles.gmailSearch}>Search mail</div>
        <div className={styles.reviewWindowControls}><i /><i /><i /></div>
      </header>
      <div className={styles.gmailAppShell}>
        <nav className={styles.gmailRail} aria-label="Gmail folders">
          <button type="button">+ Compose</button>
          <span>Inbox</span><span data-active="true">Drafts <b>3</b></span><span>Sent</span>
        </nav>
        <div className={styles.gmailDrafts}>
          <header><p><strong>Drafts</strong><span>3 messages</span></p><small>Saved just now</small></header>
          {AGENT_MEETINGS.map((meeting) => (
            <article data-agent-email-draft key={meeting.person}>
              <span className={styles.gmailDraftAvatar}>{meeting.person.split(' ').map((name) => name[0]).join('')}</span>
              <p>
                <strong>To: {meeting.person}</strong>
                <b>Can we move our {meeting.title.toLowerCase()}?</b>
                <small>Hi {meeting.person.split(' ')[0]}, I’m running one hour late today. Could we move our {meeting.time} meeting to {meeting.newTime}?</small>
              </p>
              <em>Draft</em>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentReviewWorkspace({ phase }: { phase: AgentPhase }) {
  const visible = ['opening-teams', 'selecting-gmail', 'opening-gmail', 'restoring'].includes(phase);
  if (!visible) return null;
  const gmailVisible = phase === 'opening-gmail' || phase === 'restoring';

  return (
    <div className={styles.agentReviewWorkspace} data-agent-review-workspace data-agent-review-phase={phase}>
      <div className={styles.agentReviewSlot} data-agent-review-slot="teams">
        <TeamsCalendarWindow opening={phase === 'opening-teams'} />
      </div>
      {gmailVisible && (
        <div className={`${styles.agentReviewSlot} ${styles.agentReviewSlotGmail}`} data-agent-review-slot="gmail">
          <GmailDraftWindow opening={phase === 'opening-gmail'} />
        </div>
      )}
    </div>
  );
}

function AgentValidatedApps({ phase }: { phase: AgentPhase }) {
  const showingValidation = [
    'validated',
    'selecting-teams',
    'opening-teams',
    'selecting-gmail',
    'opening-gmail',
  ].includes(phase);
  if (!showingValidation) return null;

  const cursorTarget = phase === 'selecting-teams'
    ? 'teams'
    : phase === 'selecting-gmail'
      ? 'gmail'
      : 'ready';

  return (
    <div
      className={`${styles.agentValidatedApps} ${styles.agentValidatedAppsVisible}`}
      data-agent-validated-apps
      data-agent-selection={cursorTarget}
    >
      <div className={styles.agentValidatedApp} data-agent-app="teams">
        <div className={styles.agentValidatedIconSurface} data-agent-app-surface>
          <img src="/brand/integrations/microsoft-teams.svg" alt="" />
        </div>
        <span data-agent-app-badge>1</span>
      </div>
      <div className={styles.agentValidatedApp} data-agent-app="gmail">
        <div className={styles.agentValidatedIconSurface} data-agent-app-surface>
          <img src="/brand/integrations/gmail.svg" alt="" />
        </div>
        <span data-agent-app-badge>1</span>
      </div>
      <svg
        className={styles.agentCursor}
        data-agent-cursor={cursorTarget}
        viewBox="0 0 24 28"
        aria-hidden="true"
      >
        <path d="M3 2.5v20.4l5.1-4.9 3.3 7.2 4.2-2-3.4-7.1h7.1L3 2.5Z" />
      </svg>
    </div>
  );
}

function AgentCapabilityVisual({ active }: { active: boolean }) {
  const reducedMotion = useReducedMotion();
  const sequenceIdRef = useRef(0);
  const [phase, setPhase] = useState<AgentPhase>('idle');
  const [typedPrompt, setTypedPrompt] = useState('');
  const visiblePhase = phase;
  const visiblePrompt = typedPrompt;
  const showingWorkflow = !['idle', 'restoring', 'restored'].includes(visiblePhase);
  const visiblyActive = showingWorkflow && active;

  useEffect(() => {
    const sequenceId = ++sequenceIdRef.current;

    if (!active) {
      setPhase('idle');
      setTypedPrompt('');
      return;
    }

    if (reducedMotion) {
      setTypedPrompt(AGENT_PROMPT);
      setPhase('restored');
      return;
    }

    setTypedPrompt('');
    setPhase('collapsing');
    const collapseTimer = window.setTimeout(
      () => {
        if (sequenceIdRef.current === sequenceId) setPhase('typing');
      },
      AGENT_SEQUENCE.collapseMs,
    );

    return () => window.clearTimeout(collapseTimer);
  }, [active, reducedMotion]);

  useEffect(() => {
    if (phase !== 'typing') return;

    const sequenceId = sequenceIdRef.current;
    let characterIndex = 0;
    let holdTimer: number | undefined;
    const typingTimer = window.setInterval(() => {
      if (sequenceIdRef.current !== sequenceId) {
        window.clearInterval(typingTimer);
        return;
      }

      characterIndex += 1;
      setTypedPrompt(AGENT_PROMPT.slice(0, characterIndex));

      if (characterIndex >= AGENT_PROMPT.length) {
        window.clearInterval(typingTimer);
        holdTimer = window.setTimeout(
          () => {
            if (sequenceIdRef.current === sequenceId) setPhase('understanding');
          },
          AGENT_SEQUENCE.typedHoldMs,
        );
      }
    }, AGENT_SEQUENCE.typeIntervalMs);

    return () => {
      window.clearInterval(typingTimer);
      if (holdTimer !== undefined) window.clearTimeout(holdTimer);
    };
  }, [phase]);

  useEffect(() => {
    const phaseSequence = {
      understanding: { next: 'checking', duration: AGENT_SEQUENCE.understandingMs },
      checking: { next: 'drafting', duration: AGENT_SEQUENCE.calendarMs },
      drafting: { next: 'validated', duration: AGENT_SEQUENCE.draftsMs },
      validated: { next: 'selecting-teams', duration: AGENT_SEQUENCE.validatedMs },
      'selecting-teams': { next: 'opening-teams', duration: AGENT_SEQUENCE.appSelectMs },
      'opening-teams': { next: 'selecting-gmail', duration: AGENT_SEQUENCE.teamsOpenMs },
      'selecting-gmail': { next: 'opening-gmail', duration: AGENT_SEQUENCE.appSelectMs },
      'opening-gmail': { next: 'restoring', duration: AGENT_SEQUENCE.gmailOpenMs },
      restoring: { next: 'restored', duration: AGENT_SEQUENCE.restoreMs },
    } as const;
    const currentStep = phaseSequence[phase as keyof typeof phaseSequence];
    if (!currentStep) return;

    const sequenceId = sequenceIdRef.current;
    const phaseTimer = window.setTimeout(
      () => {
        if (sequenceIdRef.current === sequenceId) {
          setPhase(currentStep.next);
        }
      },
      currentStep.duration,
    );

    return () => window.clearTimeout(phaseTimer);
  }, [phase]);

  return (
    <div
      className={`${styles.visual} ${styles.agentVisual} ${visiblyActive ? styles.agentActive : ''}`}
      data-agent-phase={visiblePhase}
      aria-hidden="true"
    >
      <div className={styles.agentDesktop} data-agent-desktop>
        <div className={styles.agentDesktopChrome}>
          <div className={styles.windowControls}><i /><i /><i /></div>
          <p><strong>Sutur Agent</strong><span>Workspace assistant</span></p>
          <i className={styles.agentOnline}>Live</i>
        </div>
        <div className={styles.agentConversation}>
          <div className={styles.agentIdentity}>
            <AgentAvatar />
            <p><strong>Sutur Agent</strong><small>Connected to Teams and Gmail</small></p>
          </div>
          <div className={styles.agentUserMessage} data-agent-user-message>
            <div className={styles.agentPromptBubble} data-agent-prompt>
              <small>You</small>
              <p>{visiblePrompt}<i className={visiblePhase === 'typing' ? styles.agentCaret : ''} /></p>
            </div>
            <UserAvatar />
          </div>
          <AgentTaskPanel phase={visiblePhase} />
        </div>
      </div>

      <AgentReviewWorkspace phase={visiblePhase} />
      {visiblePhase === 'restoring' && (
        <div className={styles.agentRestoreBackdrop} data-agent-restore-backdrop />
      )}
      <AgentValidatedApps phase={visiblePhase} />
      <span className={styles.agentAppDockLabel}>13 apps</span>

      <div className={styles.integrationField} data-agent-stack-layer>
        <svg
          className={styles.integrationGrid}
          data-agent-app-stack
          viewBox={INTEGRATION_VIEW_BOX}
          preserveAspectRatio="xMidYMid meet"
        >
          {integrationLayout.flatMap((row, rowIndex) => (
            row.map(({ app, centerX, centerY, points }, appIndex) => {
              const isCore = app.brand === 'sutur';
              const logoWidth = isCore ? 74 : app.format === 'wide' ? 62 : 44;
              const logoHeight = isCore ? 31 : app.format === 'wide' ? 38 : 44;
              const cellIndex = integrationLayout
                .slice(0, rowIndex)
                .reduce((count, layoutRow) => count + layoutRow.length, appIndex);
              const stackCenterX = HONEYCOMB_GEOMETRY.viewBoxWidth - 28 - (cellIndex % 4) * 18;
              const stackCenterY = HONEYCOMB_GEOMETRY.viewBoxHeight - 28 - Math.floor(cellIndex / 4) * 15;
              const stackStyle = {
                '--stack-x': `${stackCenterX - centerX}px`,
                '--stack-y': `${stackCenterY - centerY}px`,
                '--stack-enter-delay': `${(integrationCount - cellIndex - 1) * 22}ms`,
                '--stack-exit-delay': `${cellIndex * 22}ms`,
              } as CSSProperties;

              return (
                <g
                  className={styles.integrationCell}
                  data-integration={app.brand}
                  data-row={rowIndex}
                  key={app.label}
                  style={stackStyle}
                >
                  <polygon
                    className={`${styles.integrationHex} ${isCore ? styles.coreHex : ''}`}
                    points={points}
                  />
                  <image
                    className={isCore ? styles.suturCoreLogo : styles.integrationLogo}
                    href={app.icon}
                    x={centerX - logoWidth / 2}
                    y={centerY - logoHeight / 2}
                    width={logoWidth}
                    height={logoHeight}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>
              );
            })
          ))}
        </svg>
      </div>
    </div>
  );
}

export function CapabilityVisual({ kind, active = false }: { kind: VisualKind; active?: boolean }) {
  if (kind === 'erp') {
    return (
      <div className={`${styles.visual} ${styles.erpVisual}`} aria-hidden="true">
        <div className={styles.productWindow}>
          <WindowChrome title="Odoo · Apps" />
          <div className={styles.odooHome}>
            <div className={styles.odooTopbar}>
              <b>odoo</b>
              <div className={styles.odooProfile}>
                <i className={styles.searchGlyph} />
                <span>4</span>
                <small>Sutur Workspace</small>
                <i className={styles.profileGlyph}>A</i>
              </div>
            </div>
            <div className={styles.appLauncher}>
              {odooApps.map((app) => (
                <div className={styles.odooApp} key={app.name}>
                  <i className={styles.appIcon}>
                    <img src={app.icon} alt="" />
                  </i>
                  <span>{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'custom') {
    return (
      <div className={`${styles.visual} ${styles.customVisual}`} aria-hidden="true">
        <div className={styles.productWindow}>
          <WindowChrome title="sutur-workflows · VS Code" />
          <div className={styles.editorShell}>
            <div className={styles.fileTree}>
              <strong>EXPLORER</strong>
              <span>⌄ sutur-odoo</span>
              <span>⌄ src</span>
              <i className={styles.activeFile}>purchase_order.py</i>
              <i>inventory_sync.py</i>
              <i>supplier_rules.py</i>
              <span>› tests</span>
              <i>README.md</i>
            </div>
            <div className={styles.editorPane}>
              <div className={styles.editorTab}>
                <span>purchase_order.py</span>
                <i>M</i>
              </div>
              <code className={styles.codeEditor}>
                <span className={styles.codeLine}><b>41</b><em> </em><i>def create_purchase_order(request):</i></span>
                <span className={`${styles.codeLine} ${styles.removedLine}`}><b>42</b><em>−</em><i>supplier = request[&quot;supplier&quot;]</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>42</b><em>+</em><i>supplier = resolve_supplier(</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>43</b><em>+</em><i>request.supplier_id)</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>44</b><em>+</em><i>quantity = validate_quantity(</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>45</b><em>+</em><i>request.quantity)</i></span>
                <span className={`${styles.codeLine} ${styles.removedLine}`}><b>46</b><em>−</em><i>return draft</i></span>
                <span className={`${styles.codeLine} ${styles.addedLine}`}><b>46</b><em>+</em><i>return odoo.purchase.create(</i></span>
                <span className={styles.codeLine}><b>47</b><em> </em><i>supplier, quantity)</i></span>
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <AgentCapabilityVisual active={active} />;
}

export function CompanyCapabilities() {
  const touchInteractionRef = useRef(false);
  const [agentHovered, setAgentHovered] = useState(false);
  const [agentFocused, setAgentFocused] = useState(false);
  const agentActive = agentHovered || agentFocused;

  const activateAgentHover = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch') setAgentHovered(true);
  };

  const trackAgentPointer = (event: PointerEvent<HTMLElement>) => {
    touchInteractionRef.current = event.pointerType === 'touch';
    if (touchInteractionRef.current) {
      setAgentHovered(false);
      setAgentFocused(false);
    }
  };

  const activateAgentFocus = () => {
    if (!touchInteractionRef.current) setAgentFocused(true);
  };

  const activateAgentKeyboard = () => {
    touchInteractionRef.current = false;
    setAgentFocused(true);
  };

  const releaseAgentFocus = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      touchInteractionRef.current = false;
      setAgentFocused(false);
    }
  };

  return (
    <section
      className={`section scroll-section surface-paper ${styles.section}`}
      id="capabilities"
      aria-labelledby="capabilities-title"
    >
      <div className={styles.intro}>
        <div>
          <h2 id="capabilities-title">
            One connected business<SignalDot />
            <br />
            {' '}<em>Three ways to move it forward<SignalDot /></em>
          </h2>
        </div>
        <p className={styles.summary}>
          We create the operating foundation, the tools that fit, and the
          intelligence layer above them. Every engagement starts with how your
          business actually works.
        </p>
      </div>

      <div className={styles.capabilityGrid} role="list">
        {capabilities.map((capability) => {
          const isAgent = capability.visual === 'agent';

          return (
            <article
              className={styles.capability}
              data-capability={capability.visual}
              data-agent-active={isAgent ? agentActive : undefined}
              role="listitem"
              key={capability.number}
              onPointerDown={isAgent ? trackAgentPointer : undefined}
              onPointerEnter={isAgent ? activateAgentHover : undefined}
              onPointerLeave={isAgent ? () => setAgentHovered(false) : undefined}
              onFocusCapture={isAgent ? activateAgentFocus : undefined}
              onKeyDownCapture={isAgent ? activateAgentKeyboard : undefined}
              onBlurCapture={isAgent ? releaseAgentFocus : undefined}
            >
              <CapabilityVisual kind={capability.visual} active={isAgent && agentActive} />
              <div className={styles.capabilityCopy}>
                <div className={styles.capabilityLabel}>
                  <span>{capability.number}</span>
                  <p>{capability.label}</p>
                </div>
                <h3>{capability.title}<SignalDot /></h3>
                <p>{capability.description}</p>
                <a href="#book" aria-label={`${capability.cta} — book a discovery call`}>
                  {capability.cta} <ArrowIcon />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
