import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store.js';
import { byId } from '../data.js';
import { money, keyOf, lineTotal, subtotal, shippingFor, countItems, FREE_SHIP, MAX_QTY } from '../shop.js';
import { ease, easeInOut } from '../motion.js';
import Overlay, { Dialog } from './Overlay.jsx';
import { Icon, ProductImage } from './fx.jsx';

const slide = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { duration: 0.9, ease } },
  exit: { x: '100%', transition: { duration: 0.45, ease: easeInOut } },
};

export default function BagDrawer() {
  const open = useStore(s => s.bagOpen);
  const setBagOpen = useStore(s => s.setBagOpen);
  const bag = useStore(s => s.bag);
  const orderId = useStore(s => s.orderId);
  const setQty = useStore(s => s.setQty);
  const checkout = useStore(s => s.checkout);
  const closeRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const n = countItems(bag), sub = subtotal(bag), ship = shippingFor(sub), left = FREE_SHIP - sub;

  const change = (key, qty) => {
    setQty(key, qty);
    if (qty < 1) closeRef.current?.focus(); // the focused row is gone
  };
  const pay = () => {
    setBusy(true);
    timer.current = setTimeout(() => { checkout(); setBusy(false); closeRef.current?.focus(); }, 1400);
  };

  return (
    <Overlay open={open} onOpenChange={setBagOpen} id="cart" className="drawer" motionProps={slide}>
      <div className="drawer__head">
        <Dialog.Title asChild><h2 id="cartTitle">Your Bag <span id="cartQty">{n ? `(${n})` : ''}</span></h2></Dialog.Title>
        <Dialog.Close ref={closeRef} className="modal__close drawer__close" data-close aria-label="Close bag">{Icon.close}</Dialog.Close>
      </div>

      {!orderId && bag.length > 0 && (
        <div className="drawer__ship" id="cartShip">
          {left > 0 ? <>You are <strong>{money(left)}</strong> away from complimentary shipping</> : <>You have unlocked <strong>complimentary shipping</strong></>}
          <div className="ship__bar"><motion.span initial={false} animate={{ scaleX: Math.min(sub / FREE_SHIP, 1) }} transition={{ duration: 1, ease }} /></div>
        </div>
      )}

      <div className="drawer__body" id="cartBody">
        {orderId ? <Done orderId={orderId} /> : !bag.length ? <Empty /> : (
          <AnimatePresence initial={false}>
            {bag.map(i => {
              const p = byId[i.id], k = keyOf(i);
              return (
                <motion.div layout key={k} className="bag-item"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} transition={{ duration: 0.7, ease }}>
                  <ProductImage id={p.id} className="bag-item__thumb" />
                  <div>
                    <h3>{p.name}</h3>
                    <p className="bag-item__meta">{i.size}ml · {money(p.prices[i.size])}</p>
                    <div className="qty qty--sm">
                      <button type="button" data-qty={k} data-step="-1" aria-label={`Decrease quantity of ${p.name} ${i.size}ml`} onClick={() => change(k, i.qty - 1)}>−</button>
                      <output aria-label="Quantity">{i.qty}</output>
                      <button type="button" data-qty={k} data-step="1" aria-label={`Increase quantity of ${p.name} ${i.size}ml`} disabled={i.qty >= MAX_QTY} onClick={() => change(k, i.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="bag-item__side">
                    <span className="bag-item__price">{money(lineTotal(i))}</span>
                    <button className="text-link text-link--sm" type="button" aria-label={`Remove ${p.name} ${i.size}ml`} onClick={() => change(k, 0)}>Remove</button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {!orderId && bag.length > 0 && (
        <div className="drawer__foot" id="cartFoot">
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{money(sub)}</dd></div>
            <div><dt>Shipping</dt><dd>{ship ? money(ship) : 'Complimentary'}</dd></div>
            <div className="totals__grand"><dt>Total</dt><dd>{money(sub + ship)}</dd></div>
          </dl>
          <button className="btn btn--solid btn--block" type="button" id="checkoutBtn" disabled={busy} onClick={pay}>
            {busy ? <><span className="spinner" aria-hidden="true" /> Processing</> : 'Checkout'}
          </button>
          <p className="drawer__note">Demo checkout — no payment is taken.</p>
        </div>
      )}
    </Overlay>
  );
}

function Empty() {
  return (
    <motion.div className="bag-empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
      <h3>Your bag is empty</h3>
      <p>Discover eight compositions, each made to linger.</p>
      <a className="btn" href="#collection">Explore the collection</a>
    </motion.div>
  );
}

function Done({ orderId }) {
  const draw = (delay, duration) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay, duration, ease } });
  return (
    <motion.div className="bag-done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
      <svg viewBox="0 0 52 52" aria-hidden="true"><motion.circle cx="26" cy="26" r="24" {...draw(0.1, 1)} /><motion.path d="M16 27l7 7 13-15" {...draw(0.8, 0.6)} /></svg>
      <h3>Thank you.</h3>
      <p className="bag-done__order">Order {orderId}</p>
      <p>Your order has been placed. This is a demo storefront, so no payment was taken and nothing will ship.</p>
      <a className="btn" href="#collection">Continue browsing</a>
    </motion.div>
  );
}
