import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { MotionConfig } from 'framer-motion';
import { useStore } from './store.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Manifesto from './components/Manifesto.jsx';
import Collection from './components/Collection.jsx';
import Signature from './components/Signature.jsx';
import Craft from './components/Craft.jsx';
import Finder from './components/Finder.jsx';
import Reviews from './components/Reviews.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';
import ProductModal from './components/ProductModal.jsx';
import BagDrawer from './components/BagDrawer.jsx';
import MobileMenu from './components/MobileMenu.jsx';
import Toast from './components/Toast.jsx';
import ProductShots from './three/ProductShots.jsx';

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.075, smoothWheel: true }}>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </ReactLenis>
  );
}

function Shell() {
  const lenis = useLenis();
  const anyOpen = useStore(s => !!s.productId || s.bagOpen || s.menuOpen);

  // Freeze smooth scroll behind overlays so the page can't drift under a dialog.
  useEffect(() => {
    if (!lenis) return;
    if (anyOpen) lenis.stop(); else lenis.start();
  }, [lenis, anyOpen]);

  // In-page links: close overlays, apply footer filters, glide to the target, move focus there.
  useEffect(() => {
    const onClick = e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const id = a.getAttribute('href').slice(1);
      const target = id === 'top' ? document.body : document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const s = useStore.getState();
      if (a.dataset.filterLink) s.setFilter(a.dataset.filterLink);
      s.closeAll();
      if (lenis) { lenis.start(); lenis.scrollTo(id === 'top' ? 0 : target, { duration: 1.8 }); }
      else target.scrollIntoView({ behavior: 'smooth' });
      if (target !== document.body) target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Manifesto />
        <Collection />
        <Signature />
        <Craft />
        <Finder />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
      <ProductModal />
      <BagDrawer />
      <MobileMenu />
      <Toast />
      <ProductShots />
    </>
  );
}
