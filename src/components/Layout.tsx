import { Outlet } from 'react-router-dom';
import Header from './Navigation/Header';
import Footer from './Navigation/Footer';

function Layout() {
  return (
    <div className="min-h-screen bg-neutral-75">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
