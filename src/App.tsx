import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
const StoryPage = lazy(() => import('./pages/StoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const OrderFormPage = lazy(() => import('./pages/OrderFormPage'));
const EstimatePage = lazy(() => import('./pages/EstimatePage'));
const InstallPage = lazy(() => import('./pages/InstallPage'));
const ShotgunInstallPage = lazy(() => import('./pages/ShotgunInstallPage'));
const MeetPage = lazy(() => import('./pages/MeetPage'));
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          {/* I keep the order form outside the layout (no header/footer) */}
          <Route path="/estimate" element={<EstimatePage />} />
          <Route path="/products/:slug/order" element={<OrderFormPage />} />

          {/* Everything else uses my shared site layout */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/our-story" element={<StoryPage />} />
            <Route path="/support" element={<SupportPage />} />
            {/* Redirect legacy setup routes to new /install flows */}
            <Route path="/support/gametraq-setup" element={<Navigate to="/install" replace />} />
            <Route path="/support/shotgun-setup" element={<Navigate to="/install/shotgun" replace />} />
            <Route path="/install" element={<InstallPage />} />
            <Route path="/install/:step" element={<InstallPage />} />
            <Route path="/install/shotgun" element={<ShotgunInstallPage />} />
            <Route path="/install/shotgun/:step" element={<ShotgunInstallPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/meet" element={<MeetPage />} />
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
