import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { useStore } from '../store.js';
import { byId, LAYERS } from '../data.js';
import { money } from '../shop.js';
import { Reveal, Lines, ProductImage, ImageReveal } from './fx.jsx';
import BottleViewer from '../three/BottleViewer.jsx';

const sig = byId.ombrelune;

export default function Signature() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const openProduct = useStore(s => s.openProduct);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const near = useInView(ref, { once: true, margin: '300px 0px' });
  const imgY = useTransform(p, [0, 1], reduce ? ['0%', '0%'] : ['-3.5%', '3.5%']);

  return (
    <section className="section signature" id="signature" ref={ref} tabIndex={-1}>
      <div className="container signature__inner">
        <div className="signature__visual">
          <ImageReveal>
            <motion.div style={{ y: imgY }} className="signature__parallax">
              <ProductImage id="ombrelune" shot="ombrelune-turn" />
              {near && <BottleViewer p={sig} base={0.62} />}
            </motion.div>
          </ImageReveal>
        </div>

        <div className="signature__copy">
          <Reveal as="p" className="label">N°01 — The Signature</Reveal>
          <Lines className="title signature__title" lines={['Ombrelune']} />
          <Reveal as="p" className="signature__tag" delay={0.1}>{sig.tagline}</Reveal>
          <Reveal as="p" className="signature__desc" delay={0.15}>
            Our founding composition. A slow-burning amber lit by smoked oud and Madagascan vanilla — it opens like velvet curtains at midnight and settles into skin like a secret.
          </Reveal>
          <Reveal as="dl" className="notes" delay={0.2}>
            {['top', 'heart', 'base'].map(l => (
              <div key={l} data-layer={l}>
                <dt>{LAYERS[l].title}</dt>
                <dd>{sig.notes[l].join(', ')}</dd>
                <dd className="notes__time">{LAYERS[l].time}</dd>
              </div>
            ))}
          </Reveal>
          <Reveal className="signature__ctas" delay={0.25}>
            <button className="btn btn--solid" type="button" data-open="ombrelune" onClick={() => openProduct('ombrelune')}>Discover Ombrelune</button>
            <span className="signature__price">From {money(sig.prices[30])}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
