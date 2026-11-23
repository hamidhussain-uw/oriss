import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useStore } from '../store.js';
import { countItems } from '../shop.js';
import { ease } from '../motion.js';

export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const count = useStore(s => countItems(s.bag));
  const setBagOpen = useStore(s => s.setBagOpen);
  const setMenuOpen = useStore(s => s.setMenuOpen);

  useMotionValueEvent(scrollY, 'change', y => {
    setScrolled(y > 40);
    if (Math.abs(y - last.current) > 6) {
      setHidden(y > last.current && y > innerHeight * 0.8);
      last.current = y;
    }
  });

  return (
    <motion.header id="nav" className={`nav${scrolled ? ' is-scrolled' : ''}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1, y: hidden ? '-100%' : '0%' }}
      transition={{ opacity: { duration: 1.6, ease, delay: 0.6 }, y: { duration: 0.9, ease } }}
      onFocus={() => setHidden(false)}>
      <button className="nav__burger" id="menuBtn" type="button" aria-label="Open menu" aria-haspopup="dialog" onClick={() => setMenuOpen(true)}>
        <span /><span />
      </button>
      <nav className="nav__links" aria-label="Primary">
        <a href="#collection">Collection</a>
        <a href="#signature">Signature</a>
        <a href="#craft">The Craft</a>
      </nav>
      <a className="nav__logo" href="#top" aria-label="Oriss, back to top">Oriss</a>
      <div className="nav__actions">
        <a className="nav__link-r" href="#finder">Scent Finder</a>
        <button className="nav__bag" id="bagBtn" type="button" aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`} onClick={() => setBagOpen(true)}>
          Bag <span id="bagCount" className="nav__count">{count}</span>
        </button>
      </div>
    </motion.header>
  );
}
