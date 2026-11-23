import { motion } from 'framer-motion';
import { useStore } from '../store.js';
import { ease, easeInOut } from '../motion.js';
import Overlay, { Dialog } from './Overlay.jsx';
import { Icon } from './fx.jsx';

const LINKS = [['#collection', 'Collection'], ['#signature', 'Signature'], ['#finder', 'Scent Finder'], ['#craft', 'The Craft'], ['#newsletter', 'Le Cercle']];

const sheet = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: easeInOut } },
};

export default function MobileMenu() {
  const open = useStore(s => s.menuOpen);
  const setMenuOpen = useStore(s => s.setMenuOpen);
  return (
    <Overlay open={open} onOpenChange={setMenuOpen} id="menu" className="menu" motionProps={sheet} scrim={false}>
      <div className="menu__top">
        <Dialog.Title className="nav__logo">Oriss</Dialog.Title>
        <Dialog.Close className="modal__close" data-close aria-label="Close menu">{Icon.close}</Dialog.Close>
      </div>
      <motion.nav className="menu__nav" aria-label="Mobile" initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
        {LINKS.map(([href, label]) => (
          <motion.a key={href} href={href} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } } }}>{label}</motion.a>
        ))}
      </motion.nav>
      <p className="menu__foot">Maison de Parfum — Paris</p>
    </Overlay>
  );
}
