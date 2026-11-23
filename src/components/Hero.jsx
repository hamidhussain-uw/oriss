import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from 'framer-motion';
import { ease } from '../motion.js';
import { Lines } from './fx.jsx';
import HeroScene from '../three/HeroScene.jsx';
import { useSpin } from '../three/spin.js';

const finePointer = typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;
const enter = delay => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.4, ease, delay } });

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(p, [0, 1], [0, reduce ? 0 : -90]);
  const copyO = useTransform(p, [0, 0.6], [1, reduce ? 1 : 0]);
  const sceneY = useTransform(p, [0, 1], ['0%', reduce ? '0%' : '12%']);
  const pointer = { x: useMotionValue(0), y: useMotionValue(0) };
  const track = finePointer && !reduce ? {
    onPointerMove: e => { const r = e.currentTarget.getBoundingClientRect(); pointer.x.set((e.clientX - r.left) / r.width - 0.5); pointer.y.set((e.clientY - r.top) / r.height - 0.5); },
    onPointerLeave: () => { pointer.x.set(0); pointer.y.set(0); },
  } : {};
  const { state: spin, bind: spinBind } = useSpin({ inertia: !reduce });
  const drag = reduce ? {} : spinBind;

  return (
    <section className="hero" id="hero" ref={ref} {...track}>
      <motion.div className={`hero__scene${finePointer && !reduce ? ' is-draggable' : ''}`} style={{ y: sceneY }} {...drag}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.6, ease, delay: 0.2 }}>
        <HeroScene progress={p} pointer={pointer} spin={spin} still={reduce} />
      </motion.div>

      <motion.div className="hero__copy" style={{ y: copyY, opacity: copyO }}>
        <motion.p className="label" {...enter(0.9)}>Maison de Parfum — Paris</motion.p>
        <Lines as="h1" className="hero__title" lines={['The art of', '*invisible*', 'elegance']} onMount delay={1.1} />
        <motion.div className="hero__foot" {...enter(1.9)}>
          <p className="hero__lead">Small-batch eaux de parfum, composed from rare materials and left to mature for eighteen months.</p>
          <a className="text-link" href="#collection">Discover the collection</a>
        </motion.div>
      </motion.div>

      <motion.a className="hero__scroll" href="#manifesto" aria-label="Scroll down" {...enter(2.4)}>Scroll</motion.a>
    </section>
  );
}
