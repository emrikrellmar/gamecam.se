import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import ProductPage from './pages/ProductPage';
import SupportPage from './pages/SupportPage';
import GametraqSetupPage from './pages/GametraqSetupPage';
import ShotgunSetupPage from './pages/ShotgunSetupPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductsPage from './pages/ProductsPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
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
    </>
  );
}

export default App;
