import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store.js';
import { byId, FAMILY, SIZES, DEFAULT_SIZE } from '../data.js';
import { money, MAX_QTY } from '../shop.js';
import { ease, easeInOut } from '../motion.js';
import Overlay, { Dialog } from './Overlay.jsx';
import { ProductImage, Icon } from './fx.jsx';
import BottleViewer from '../three/BottleViewer.jsx';

const panel = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.4, ease: easeInOut } },
};

export default function ProductModal() {
  const id = useStore(s => s.productId);
  const closeProduct = useStore(s => s.closeProduct);
  const last = useRef(null);
  if (id) last.current = byId[id];          // keep content during the exit animation
  const p = last.current;
  return (
    <Overlay open={!!id} onOpenChange={o => { if (!o) closeProduct(); }} id="productModal" className="modal" motionProps={panel}>
      {p && <Body key={p.id} p={p} />}
    </Overlay>
  );
}

function Meter({ label, value }) {
  return (
    <div className="meter">
      <span>{label}</span>
      <div className="meter__bar" role="img" aria-label={`${label}: ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map(n => <i key={n} className={n <= value ? 'on' : ''} />)}
      </div>
    </div>
  );
}

function Body({ p }) {
  const add = useStore(s => s.add);
  const closeProduct = useStore(s => s.closeProduct);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [qty, setQty] = useState(1);
  const stepQty = d => setQty(q => Math.min(MAX_QTY, Math.max(1, q + d)));
  // create the WebGL view after the open transition so it can't stutter the animation
  const [live, setLive] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLive(true), 650); return () => clearTimeout(t); }, []);

  return (
    <div className="modal__inner" id="pmContent">
      <Dialog.Close className="modal__close" data-close aria-label="Close">{Icon.close}</Dialog.Close>
      <div className="modal__visual">
        <motion.div className="modal__img" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 2, ease }}>
          <ProductImage id={p.id} />
        </motion.div>
        {live && <BottleViewer p={p} />}
      </div>
      <motion.div className="modal__info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease, delay: 0.2 }}>
        <p className="label">N°{p.no} · {FAMILY[p.family].label}</p>
        <Dialog.Title asChild><h2 id="pmName">{p.name}</h2></Dialog.Title>
        <p className="modal__tag">{p.tagline}</p>
        <p className="modal__desc">{p.desc}</p>
        <dl className="notes notes--compact">
          <div><dt>Top</dt><dd>{p.notes.top.join(', ')}</dd></div>
          <div><dt>Heart</dt><dd>{p.notes.heart.join(', ')}</dd></div>
          <div><dt>Base</dt><dd>{p.notes.base.join(', ')}</dd></div>
        </dl>
        <div className="meters"><Meter label="Longevity" value={p.longevity} /><Meter label="Sillage" value={p.sillage} /></div>
        <fieldset className="sizes">
          <legend>Size</legend>
          <div className="sizes__row">
            {SIZES.map(s => (
              <label className="size" key={s}>
                <input type="radio" name="pmSize" value={s} checked={size === s} onChange={() => setSize(s)} />
                <span><b>{s} ml</b><small>{money(p.prices[s])}</small></span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="buy">
          <div className="qty">
            <button type="button" data-pm-step="-1" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => stepQty(-1)}>−</button>
            <output id="pmQty" aria-label="Quantity">{qty}</output>
            <button type="button" data-pm-step="1" aria-label="Increase quantity" disabled={qty >= MAX_QTY} onClick={() => stepQty(1)}>+</button>
          </div>
          <button className="btn btn--solid" type="button" id="pmAdd" onClick={() => { closeProduct(); add(p.id, size, qty); }}>
            Add to bag — {money(p.prices[size] * qty)}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
