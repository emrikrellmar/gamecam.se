import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
const StoryPage = lazy(() => import('./pages/StoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const GametraqSetupPage = lazy(() => import('./pages/GametraqSetupPage'));
const ShotgunSetupPage = lazy(() => import('./pages/ShotgunSetupPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const OrderFormPage = lazy(() => import('./pages/OrderFormPage'));
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          {/* I keep the order form outside the layout (no header/footer) */}
          <Route path="/order/:slug" element={<OrderFormPage />} />

          {/* Everything else uses my shared site layout */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/our-story" element={<StoryPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/gametraq-setup" element={<GametraqSetupPage />} />
            <Route path="/support/shotgun-setup" element={<ShotgunSetupPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
  {/* I include Vercel Analytics & Speed Insights for lightweight observability */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
