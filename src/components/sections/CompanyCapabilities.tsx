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
  typedHoldMs: 420,
  calendarMs: 1900,
  draftsMs: 2100,
  validatedMs: 720,
  teamsOpenMs: 1500,
  gmailOpenMs: 1500,
} as const;

type AgentPhase =
  | 'idle'
  | 'collapsing'
  | 'typing'
  | 'checking'
  | 'drafting'
  | 'validated'
  | 'opening-teams'
  | 'opening-gmail'
  | 'complete';
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

function AgentResultWindows({ phase }: { phase: AgentPhase }) {
  const teamsOpen = phase !== 'validated';
  const gmailOpen = phase === 'opening-gmail' || phase === 'complete';

  return (
    <div
      className={styles.agentResultWindows}
      data-agent-task={phase === 'complete' ? 'complete' : 'app-review'}
    >
      <section
        className={`${styles.agentAppWindow} ${teamsOpen ? styles.agentAppWindowOpen : ''}`}
        data-agent-window="teams"
      >
        <header>
          <img src="/brand/integrations/microsoft-teams.svg" alt="" />
          <p><strong>Teams</strong><span>3 times updated</span></p>
        </header>
        <div>
          {AGENT_MEETINGS.map((meeting) => (
            <div data-agent-window-row key={meeting.person}>
              <time>{meeting.time}<i>&rarr;</i>{meeting.newTime}</time>
              <span>{meeting.person}</span>
              <b>+1h</b>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`${styles.agentAppWindow} ${styles.agentGmailWindow} ${gmailOpen ? styles.agentAppWindowOpen : ''}`}
        data-agent-window="gmail"
      >
        <header>
          <img src="/brand/integrations/gmail.svg" alt="" />
          <p><strong>Gmail</strong><span>3 drafts ready</span></p>
        </header>
        <div>
          {AGENT_MEETINGS.map((meeting) => (
            <div data-agent-draft data-agent-window-row key={meeting.person}>
              <span>{meeting.person}</span>
              <small>New meeting time · {meeting.newTime}</small>
              <b>Ready</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AgentTaskPanel({ phase }: { phase: AgentPhase }) {
  const showingResults =
    phase === 'validated' ||
    phase === 'opening-teams' ||
    phase === 'opening-gmail' ||
    phase === 'complete';

  if (phase === 'idle' || phase === 'collapsing' || phase === 'typing') {
    return (
      <div className={styles.agentThinking} data-agent-task="understanding">
        <span><i /><i /><i /></span>
        <p>Understanding your request</p>
      </div>
    );
  }

  if (phase === 'checking') {
    return (
      <div className={styles.agentActionCard} data-agent-task="teams">
        <div className={styles.agentActionHeader}>
          <img src="/brand/integrations/microsoft-teams.svg" alt="" />
          <p><strong>Teams calendar</strong><span>Checking today&apos;s meetings</span></p>
          <i className={styles.agentSpinner} />
        </div>
        <div className={styles.agentMeetingList}>
          {AGENT_MEETINGS.map((meeting, index) => (
            <div
              className={styles.agentMeeting}
              data-agent-meeting
              key={meeting.person}
              style={{ '--item-index': index } as CSSProperties}
            >
              <time>{meeting.time}</time>
              <p><strong>{meeting.title}</strong><span>{meeting.person}</span></p>
              <i />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showingResults) return <AgentResultWindows phase={phase} />;

  return (
    <div className={`${styles.agentActionCard} ${styles.agentDraftCard}`} data-agent-task="drafting">
      <div className={styles.agentActionHeader}>
        <img src="/brand/integrations/gmail.svg" alt="" />
        <p><strong>Email drafts</strong><span>Personalizing each message</span></p>
        <i className={styles.agentSpinner} />
      </div>
      <div className={styles.agentDraftList}>
        {AGENT_MEETINGS.map((meeting, index) => (
          <div
            className={styles.agentDraft}
            data-agent-draft
            key={meeting.person}
            style={{ '--item-index': index } as CSSProperties}
          >
            <span>{meeting.person.split(' ').map((name) => name[0]).join('')}</span>
            <p><strong>{meeting.person}</strong><small>Move {meeting.time} · {meeting.title}</small></p>
            <i>Drafting</i>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentValidatedApps({ phase }: { phase: AgentPhase }) {
  const showingValidation =
    phase === 'validated' ||
    phase === 'opening-teams' ||
    phase === 'opening-gmail' ||
    phase === 'complete';
  const cursorTarget =
    phase === 'opening-teams'
      ? 'teams'
      : phase === 'opening-gmail'
        ? 'gmail'
        : phase === 'validated'
          ? 'ready'
          : 'hidden';

  return (
    <>
      <div
        className={`${styles.agentValidatedApps} ${showingValidation ? styles.agentValidatedAppsVisible : ''}`}
        data-agent-validated-apps
      >
        <div className={styles.agentValidatedApp} data-agent-app="teams">
          <img src="/brand/integrations/microsoft-teams.svg" alt="" />
          <span data-agent-app-badge>3</span>
        </div>
        <div className={styles.agentValidatedApp} data-agent-app="gmail">
          <img src="/brand/integrations/gmail.svg" alt="" />
          <span data-agent-app-badge>3</span>
        </div>
      </div>

      <svg
        className={styles.agentCursor}
        data-agent-cursor={cursorTarget}
        viewBox="0 0 24 28"
        aria-hidden="true"
      >
        <path d="M3 2.5v20.4l5.1-4.9 3.3 7.2 4.2-2-3.4-7.1h7.1L3 2.5Z" />
      </svg>
    </>
  );
}

function AgentCapabilityVisual({ active }: { active: boolean }) {
  const reducedMotion = useReducedMotion();
  const sequenceIdRef = useRef(0);
  const [phase, setPhase] = useState<AgentPhase>('idle');
  const [typedPrompt, setTypedPrompt] = useState('');

  useEffect(() => {
    const sequenceId = ++sequenceIdRef.current;

    if (!active) {
      setPhase('idle');
      setTypedPrompt('');
      return;
    }

    if (reducedMotion) {
      setTypedPrompt(AGENT_PROMPT);
      setPhase('complete');
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
            if (sequenceIdRef.current === sequenceId) setPhase('checking');
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
      checking: { next: 'drafting', duration: AGENT_SEQUENCE.calendarMs },
      drafting: { next: 'validated', duration: AGENT_SEQUENCE.draftsMs },
      validated: { next: 'opening-teams', duration: AGENT_SEQUENCE.validatedMs },
      'opening-teams': { next: 'opening-gmail', duration: AGENT_SEQUENCE.teamsOpenMs },
      'opening-gmail': { next: 'complete', duration: AGENT_SEQUENCE.gmailOpenMs },
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
      className={`${styles.visual} ${styles.agentVisual} ${active ? styles.agentActive : ''}`}
      data-agent-phase={phase}
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
            <span>S</span>
            <p><strong>Sutur Agent</strong><small>Connected to Teams and Gmail</small></p>
          </div>
          <div className={styles.agentPromptBubble} data-agent-prompt>
            <small>You</small>
            <p>{typedPrompt}<i className={phase === 'typing' ? styles.agentCaret : ''} /></p>
          </div>
          <AgentTaskPanel phase={phase} />
        </div>
        <span className={styles.agentAppDockLabel}>13 apps</span>
      </div>

      <AgentValidatedApps phase={phase} />

      <div className={styles.integrationField}>
        <svg
          className={styles.integrationGrid}
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
