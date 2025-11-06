// I prefetch same-origin links on hover/touch to make navigation feel instant
export function initPrefetch() {
  if (typeof window === 'undefined' || !('requestIdleCallback' in window)) return;

  const isSameOrigin = (href: string) => {
    try {
      const u = new URL(href, window.location.origin);
      return u.origin === window.location.origin && !u.hash && u.pathname !== window.location.pathname;
    } catch {
      return false;
    }
  };

  const prefetch = (href: string) => {
    if (!isSameOrigin(href)) return;
    const exists = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
    if (exists) return;
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.as = 'document';
    l.href = href;
    document.head.appendChild(l);
  };

  const handler = (e: Event) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    const a = t.closest('a') as HTMLAnchorElement | null;
    if (!a || !a.href) return;
    (window as any).requestIdleCallback?.(() => prefetch(a.href));
  };

  document.addEventListener('mouseover', handler, { passive: true });
  document.addEventListener('touchstart', handler, { passive: true });
}
