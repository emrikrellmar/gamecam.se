import { Outlet } from 'react-router-dom';
import Header from './Navigation/Header';
import Footer from './Navigation/Footer';

// I add a visually hidden live region for announcing route changes for screen readers
import { useEffect, useRef } from 'react';

function RouteAnnouncer() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handle = () => {
      const pageTitle = document.title || 'Page updated';
      if (ref.current) ref.current.textContent = pageTitle;
    };
    handle();
    window.addEventListener('popstate', handle);
    window.addEventListener('pushstate', handle as any);
    window.addEventListener('replacestate', handle as any);
    return () => {
      window.removeEventListener('popstate', handle);
      window.removeEventListener('pushstate', handle as any);
      window.removeEventListener('replacestate', handle as any);
    };
  }, []);
  return <div aria-live="polite" aria-atomic="true" className="sr-only" ref={ref} />;
}

function Layout() {
  return (
    <div className="min-h-screen bg-neutral-75">
      <RouteAnnouncer />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        role="main"
        className="mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-5 lg:px-6 xl:px-8 focus:outline-none focus-visible:ring focus-visible:ring-brand-blue/40"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

