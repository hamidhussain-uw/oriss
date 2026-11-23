import { motion } from 'framer-motion';
import { useStore } from '../store.js';
import { byId } from '../data.js';
import { fadeUp, lineUp, viewport, ease } from '../motion.js';

/** Fades its content up a few pixels once it scrolls into view. */
export function Reveal({ as = 'div', delay = 0, children, ...rest }) {
  const M = motion[as];
  return (
    <M variants={fadeUp} custom={delay} initial="hidden" whileInView="show" viewport={viewport} {...rest}>
      {children}
    </M>
  );
}

/** Heading whose lines rise slowly out of a mask. Pass `lines` as an array; `*text*` renders italic. */
export function Lines({ as = 'h2', lines, className, delay = 0, onMount = false }) {
  const M = motion[as];
  const label = lines.join(' ').replace(/\*/g, '');
  const parent = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: delay } } };
  const trigger = onMount ? { animate: 'show' } : { whileInView: 'show', viewport };
  return (
    <M className={className} aria-label={label} variants={parent} initial="hidden" {...trigger}>
      {lines.map((l, i) => (
        <span className="line" key={i} aria-hidden="true">
          <motion.span className="line__in" variants={lineUp}>
            {l.split('*').map((seg, j) => (j % 2 ? <em key={j}>{seg}</em> : seg))}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

/** Product still rendered from the 3D studio, with a designed placeholder until (or unless) it exists. */
export function ProductImage({ id, shot, className = '' }) {
  const p = byId[id];
  const src = useStore(s => s.shots[shot || id]);
  return (
    <div className={`pimg ${className}`} style={{ '--tint': p.tint }}>
      {src
        ? <motion.img className="pimg__main" src={src} alt={`${p.name} eau de parfum`} draggable="false" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, ease }} />
        : <span className="pimg__ph" role="img" aria-label={`${p.name} eau de parfum`}>{p.name}</span>}
    </div>
  );
}

/** Image that is uncovered from the bottom when it enters the viewport (slight settle in scale). */
// The in-view check sits on an unclipped wrapper: Chrome's IntersectionObserver counts a fully clipped element as 0% visible.
export function ImageReveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div className={`reveal-img ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.div className="reveal-img__clip"
        variants={{ hidden: { clipPath: 'inset(100% 0% 0% 0%)' }, show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.6, ease, delay } } }}>
        <motion.div className="reveal-img__in" variants={{ hidden: { scale: 1.12 }, show: { scale: 1, transition: { duration: 2.2, ease, delay } } }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export const Icon = {
  close: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>,
  bag: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>,
  arrow: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 7l5 5-5 5" /></svg>,
};
