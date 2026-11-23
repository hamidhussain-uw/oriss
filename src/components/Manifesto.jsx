import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Reveal } from './fx.jsx';

const TEXT = 'Oriss is perfume made slowly. Rare materials, eighteen months of rest, and the patience of a small atelier — so that what remains is quiet, precise, and felt long after you have left the room.';

function Word({ progress, range, children }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [reduce ? 1 : 0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** Statement whose words brighten as it scrolls through the viewport. */
export default function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 45%'] });
  const words = TEXT.split(' ');
  return (
    <section className="manifesto" id="manifesto" tabIndex={-1}>
      <div className="container manifesto__inner">
        <Reveal as="p" className="label">Maison Oriss</Reveal>
        <p className="manifesto__text" ref={ref} aria-label={TEXT}>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
