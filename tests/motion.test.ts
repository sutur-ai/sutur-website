import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeReducedMotion, usePrefersReducedMotion } from '../src/lib/motion';
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
