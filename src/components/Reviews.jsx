import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { REVIEWS } from '../data.js';
import { ease, easeInOut } from '../motion.js';
import { Reveal } from './fx.jsx';

const N = REVIEWS.length;

export default function Reviews() {
  const [idx, setIdx] = useState(0);
  const go = n => setIdx((n + N) % N);
  const r = REVIEWS[idx];
  return (
    <section className="section reviews" id="reviews" tabIndex={-1}>
      <div className="container">
        <Reveal as="p" className="label label--center">In Their Words</Reveal>
        <Reveal className="slider" id="slider" role="region" aria-roledescription="carousel" aria-label="Customer reviews" delay={0.1}>
          <div className="slider__viewport">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure key={idx} className="slide" aria-roledescription="slide" aria-label={`${idx + 1} of ${N}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1, ease } }} exit={{ opacity: 0, transition: { duration: 0.4, ease: easeInOut } }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12}
                onDragEnd={(e, { offset }) => { if (offset.x < -60) go(idx + 1); else if (offset.x > 60) go(idx - 1); }}>
                <blockquote>{r.quote}</blockquote>
                <figcaption>{r.name} <span>— wears {r.wears}</span></figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="slider__controls">
            <button className="text-link" type="button" data-slide="prev" aria-label="Previous review" onClick={() => go(idx - 1)}>Prev</button>
            <div className="slider__dots" id="sliderDots">
              {REVIEWS.map((_, i) => (
                <button key={i} className="slider__dot" type="button" data-dot={i} aria-label={`Show review ${i + 1}`} aria-current={i === idx} onClick={() => go(i)} />
              ))}
            </div>
            <button className="text-link" type="button" data-slide="next" aria-label="Next review" onClick={() => go(idx + 1)}>Next</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
