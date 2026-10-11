import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeAnimationsPaused, setAnimationsPaused, settleFiniteAnimations, observeReducedMotion, useAnimationsPaused, usePrefersReducedMotion } from '../src/lib/motion';
import { observeInView, useInView } from '../src/lib/useInView';

const hooks = vi.hoisted(() => ({ effects: [] as (() => void | (() => void))[], update: vi.fn(), ref: { current: null as HTMLElement | null } }));
vi.mock('react', () => ({
  useRef: () => hooks.ref,
  useState: (value: boolean) => [value, hooks.update],
  useEffect: (effect: () => void | (() => void)) => hooks.effects.push(effect),
}));
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); hooks.effects = []; hooks.ref.current = null; });

function region() {
  const classes = new Set<string>();
  return { classList: { toggle: (name: string, on: boolean) => on ? classes.add(name) : classes.delete(name), remove: (name: string) => classes.delete(name) }, classes };
}
describe('in-view animation lifecycle', () => {
  it('pauses before observation, resumes on screen, pauses off screen and disconnects on cleanup', () => {
    let callback: IntersectionObserverCallback = () => {};
    const observe = vi.fn(), disconnect = vi.fn();
    const constructor = vi.fn(function (cb: IntersectionObserverCallback) { callback = cb; return { observe, disconnect }; });
    vi.stubGlobal('IntersectionObserver', constructor);
    const element = region(); hooks.ref.current = element as unknown as HTMLElement;
    const result = useInView(); expect(result.inView).toBe(false); expect(result.ref).toBe(hooks.ref);
    const cleanup = hooks.effects[0]() as () => void;
    expect(element.classes.has('idle')).toBe(true);
    expect(constructor).toHaveBeenCalledWith(expect.any(Function), { rootMargin: '120px 0px', threshold: 0 });
    for (const visible of [true, false]) {
      callback([{ target: element, isIntersecting: visible } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
      expect(hooks.update).toHaveBeenLastCalledWith(visible);
      expect(element.classes.has('idle')).toBe(!visible);
    }
    cleanup(); expect(disconnect).toHaveBeenCalledOnce(); expect(element.classes.has('idle')).toBe(false);
  });
  it('shows the meaningful state without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const element = region(), update = vi.fn();
    observeInView(element as unknown as HTMLElement, update)();
    expect(update).toHaveBeenCalledWith(true); expect(element.classes.size).toBe(0);
  });
  it('does not access browser APIs during server rendering', () => {
    expect(useInView().inView).toBe(false); expect(usePrefersReducedMotion()).toBe(true);
    expect(hooks.update).not.toHaveBeenCalled();
  });
});
describe('reduced motion lifecycle', () => {
  it('reads the preference, tracks changes and removes its listener', () => {
    const query = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const matchMedia = vi.fn(() => query); vi.stubGlobal('window', { matchMedia });
    expect(usePrefersReducedMotion()).toBe(true);
    const cleanup = hooks.effects[0]() as () => void;
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(hooks.update).toHaveBeenLastCalledWith(false);
    query.matches = true; query.addEventListener.mock.calls[0][1]();
    expect(hooks.update).toHaveBeenLastCalledWith(true);
    cleanup(); expect(query.removeEventListener).toHaveBeenCalledWith('change', query.addEventListener.mock.calls[0][1]);
  });
  it('stays paused when matchMedia is missing or on the server', () => {
    const update = vi.fn(); observeReducedMotion(update)();
    expect(update).toHaveBeenLastCalledWith(true);
    vi.stubGlobal('window', {}); observeReducedMotion(update)();
    expect(update).toHaveBeenLastCalledWith(true);
  });
});

function motionBrowser(stored: string | null = null, storageBlocked = false) {
  const root = region();
  const localStorage = {
    getItem: vi.fn(() => { if (storageBlocked) throw new Error('Storage unavailable'); return stored; }),
    setItem: vi.fn((_key: string, value: string) => { if (storageBlocked) throw new Error('Storage unavailable'); stored = value; }),
  };
  const browser = Object.assign(new EventTarget(), { localStorage });
  vi.stubGlobal('window', browser);
  vi.stubGlobal('document', { documentElement: { classList: { ...root.classList, contains: (name: string) => root.classes.has(name) } } });
  return { root, localStorage, browser };
}

describe('viewer animation pause', () => {
  it('defaults to playing, persists changes, notifies subscribers and cleans up', () => {
    const { root, localStorage } = motionBrowser();
    const update = vi.fn();
    const cleanup = observeAnimationsPaused(update);
    expect(update).toHaveBeenLastCalledWith(false);
    setAnimationsPaused(true);
    expect(root.classes.has('animations-paused')).toBe(true);
    expect(update).toHaveBeenLastCalledWith(true);
    expect(localStorage.setItem).toHaveBeenLastCalledWith('sutur-animations-paused', 'true');
    setAnimationsPaused(false);
    expect(root.classes.has('animations-paused')).toBe(false);
    expect(update).toHaveBeenLastCalledWith(false);
    cleanup(); update.mockClear(); setAnimationsPaused(true);
    expect(update).not.toHaveBeenCalled();
  });

  it('restores a paused preference for a new document and shares it with the hook', () => {
    const { root } = motionBrowser('true');
    expect(useAnimationsPaused()).toBe(false);
    const cleanup = hooks.effects[0]() as () => void;
    expect(hooks.update).toHaveBeenLastCalledWith(true);
    expect(root.classes.has('animations-paused')).toBe(true);
    cleanup();
    motionBrowser('true');
    const update = vi.fn(); observeAnimationsPaused(update)();
    expect(update).toHaveBeenLastCalledWith(true);
  });

  it('works without storage, accepts only a true saved preference, and is safe during SSR', () => {
    for (const [stored, blocked] of [['true', true], ['invalid', false]] as const) {
      motionBrowser(stored, blocked);
      const update = vi.fn(); const cleanup = observeAnimationsPaused(update);
      expect(update).toHaveBeenLastCalledWith(false);
      setAnimationsPaused(true); expect(update).toHaveBeenLastCalledWith(true);
      setAnimationsPaused(false); expect(update).toHaveBeenLastCalledWith(false);
      cleanup();
    }
    vi.unstubAllGlobals();
    const update = vi.fn(); observeAnimationsPaused(update)();
    expect(update).toHaveBeenCalledWith(false);
    expect(() => setAnimationsPaused(true)).not.toThrow();
  });

  it('stops the running signal on pause and resumes only regions still on screen', () => {
    motionBrowser();
    let callback: IntersectionObserverCallback = () => {};
    vi.stubGlobal('IntersectionObserver', vi.fn(function (cb: IntersectionObserverCallback) {
      callback = cb; return { observe: vi.fn(), disconnect: vi.fn() };
    }));
    const element = region(), update = vi.fn();
    const cleanup = observeInView(element as unknown as HTMLElement, update);
    const visible = (isIntersecting: boolean) => callback([{ target: element, isIntersecting } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    visible(true); expect(update).toHaveBeenLastCalledWith(true);
    setAnimationsPaused(true); expect(update).toHaveBeenLastCalledWith(false);
    expect(element.classes.has('idle')).toBe(true);
    visible(true); expect(update).toHaveBeenLastCalledWith(false);
    setAnimationsPaused(false); expect(update).toHaveBeenLastCalledWith(true);
    setAnimationsPaused(true); visible(false); setAnimationsPaused(false);
    expect(update).toHaveBeenLastCalledWith(false);
    expect(element.classes.has('idle')).toBe(true);
    cleanup(); update.mockClear(); setAnimationsPaused(true);
    expect(update).not.toHaveBeenCalled();
  });

  it('honors a saved pause even without IntersectionObserver', () => {
    motionBrowser('true'); vi.stubGlobal('IntersectionObserver', undefined);
    const element = region(), update = vi.fn();
    const cleanup = observeInView(element as unknown as HTMLElement, update);
    expect(update).toHaveBeenLastCalledWith(false);
    expect(element.classes.has('idle')).toBe(true);
    setAnimationsPaused(false); expect(update).toHaveBeenLastCalledWith(true);
    cleanup();
  });
});

describe('finite entrances while paused', () => {
  function harness() {
    class Region extends EventTarget {
      isConnected = true;
      parent: Region | null = null;
      animations: MotionAnimation[] = [];
      getAnimations = vi.fn(() => this.animations);
      contains(other: Region): boolean { return other === this || Boolean(other.parent && this.contains(other.parent)); }
    }
    class Effect {
      frames = [{ opacity: '0', offset: 0, computedOffset: 0 }, { opacity: '1', offset: 1, computedOffset: 1 }];
      setKeyframes = vi.fn();
      updateTiming = vi.fn();
      constructor(public target: Region, private iterations = 1, private fill = 'none') {}
      getTiming() { return { iterations: this.iterations, fill: this.fill }; }
      getKeyframes() { return this.frames; }
    }
    class MotionAnimation extends EventTarget {
      playState = 'paused';
      constructor(public effect: Effect) { super(); }
    }
    class Transition extends MotionAnimation {}
    vi.stubGlobal('Element', Region); vi.stubGlobal('KeyframeEffect', Effect); vi.stubGlobal('CSSTransition', Transition);
    let changed: (records: { addedNodes: Region[] }[]) => void = () => {};
    const disconnect = vi.fn(), observe = vi.fn();
    vi.stubGlobal('MutationObserver', vi.fn(function (callback: typeof changed) {
      changed = callback; return { observe, disconnect };
    }));
    let callback = () => {};
    const request = vi.fn((next: () => void) => { callback = next; return 1; });
    const cancel = vi.fn();
    vi.stubGlobal('requestAnimationFrame', request); vi.stubGlobal('cancelAnimationFrame', cancel);
    const root = new Region();
    const entrance = new MotionAnimation(new Effect(root)), loop = new MotionAnimation(new Effect(root, Infinity));
    const reveal = new MotionAnimation(new Effect(root, 1, 'both')), transition = new Transition(new Effect(root));
    root.animations.push(entrance, loop, reveal, transition);
    const cleanup = settleFiniteAnimations(root as unknown as HTMLElement);
    const start = (target: Region) => {
      const event = new Event('animationstart');
      Object.defineProperty(event, 'target', { value: target }); root.dispatchEvent(event);
    };
    return { Region, Effect, MotionAnimation, root, entrance, loop, reveal, transition, cleanup, request, cancel, observe, disconnect,
      mutate: (addedNodes: Region[] = []) => changed([{ addedNodes }]), flush: () => callback(), start };
  }

  it('settles finite effects, preserves loops/transitions and restores on play', () => {
    const h = harness();
    expect(h.root.getAnimations).toHaveBeenCalledWith({ subtree: true });
    for (const animation of [h.entrance, h.reveal]) {
      expect(animation.effect.setKeyframes).toHaveBeenCalledWith([{ opacity: '1', offset: 0 }, { opacity: '1', offset: 1 }]);
      expect(animation.effect.updateTiming).toHaveBeenCalledWith({ fill: 'both' });
    }
    expect(h.loop.effect.setKeyframes).not.toHaveBeenCalled();
    expect(h.transition.effect.setKeyframes).not.toHaveBeenCalled();
    expect(h.observe).toHaveBeenCalledWith(h.root, { subtree: true, childList: true });
    h.cleanup(); expect(h.disconnect).toHaveBeenCalledOnce();
    for (const animation of [h.entrance, h.reveal]) expect(animation.effect.setKeyframes).toHaveBeenLastCalledWith(animation.effect.frames);
    expect(h.entrance.effect.updateTiming).toHaveBeenLastCalledWith({ fill: 'none' });
    expect(h.reveal.effect.updateTiming).toHaveBeenLastCalledWith({ fill: 'both' });
    h.start(h.root); expect(h.request).not.toHaveBeenCalled();
  });

  it('batches additions and animation targets into one frame and scans only their subtrees', () => {
    const h = harness();
    const menu = new h.Region(), child = new h.Region(); child.parent = menu;
    const entrance = new h.MotionAnimation(new h.Effect(menu)); menu.animations.push(entrance);
    h.mutate([menu, child]); h.mutate([menu]); h.start(menu);
    expect(h.request).toHaveBeenCalledOnce(); expect(menu.getAnimations).not.toHaveBeenCalled();
    h.flush();
    expect(menu.getAnimations).toHaveBeenCalledOnce(); expect(child.getAnimations).not.toHaveBeenCalled();
    expect(h.root.getAnimations).toHaveBeenCalledOnce(); expect(entrance.effect.setKeyframes).toHaveBeenCalledOnce();
    const answer = new h.Region();
    const fade = new h.MotionAnimation(new h.Effect(answer)); answer.animations.push(fade);
    h.start(answer); h.start(answer); h.flush();
    expect(h.request).toHaveBeenCalledTimes(2); expect(answer.getAnimations).toHaveBeenCalledOnce();
    expect(fade.effect.setKeyframes).toHaveBeenCalledOnce(); h.cleanup();
  });

  it('prunes removed menus and cancelled effects rather than restoring them on play', () => {
    const h = harness();
    const removed = [];
    for (let i = 0; i < 100; i++) {
      const menu = new h.Region();
      const entrance = new h.MotionAnimation(new h.Effect(menu)); menu.animations.push(entrance);
      h.mutate([menu]); h.flush(); menu.isConnected = false; h.mutate(); h.flush();
      // Pruned effects release the cancel listener that held the pause closure.
      const requests = h.request.mock.calls.length; entrance.dispatchEvent(new Event('cancel'));
      expect(h.request).toHaveBeenCalledTimes(requests); removed.push(entrance);
    }
    h.entrance.playState = 'idle'; h.entrance.dispatchEvent(new Event('cancel')); h.flush();
    h.start(h.root); h.cleanup(); expect(h.cancel).toHaveBeenCalledWith(1);
    for (const animation of [...removed, h.entrance]) expect(animation.effect.setKeyframes).toHaveBeenCalledOnce();
    expect(h.reveal.effect.setKeyframes).toHaveBeenLastCalledWith(h.reveal.effect.frames);
  });
});
