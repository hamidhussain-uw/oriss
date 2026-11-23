import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { byId, DEFAULT_SIZE } from './data.js';
import { addItem, setItemQty, sanitizeBag } from './shop.js';

export const useStore = create(persist((set) => ({
  bag: [],
  filter: 'all',
  sort: 'featured',
  productId: null,
  bagOpen: false,
  menuOpen: false,
  toast: null,
  orderId: null,
  shots: {},            // product stills rendered from the 3D studio: { [key]: dataURL }
  shotsFailed: false,   // no WebGL: cards keep their designed placeholder

  add: (id, size = DEFAULT_SIZE, qty = 1) => set(s => ({
    bag: addItem(s.bag, id, size, qty),
    orderId: null,
    toast: { key: Date.now(), text: `${byId[id].name} ${size}ml added to your bag` },
  })),
  setQty: (key, qty) => set(s => ({ bag: setItemQty(s.bag, key, qty) })),
  checkout: () => set({ bag: [], orderId: 'OR-' + Date.now().toString(36).slice(-6).toUpperCase() }),

  setFilter: filter => set({ filter }),
  setSort: sort => set({ sort }),
  openProduct: productId => set({ productId, toast: null }),
  closeProduct: () => set({ productId: null }),
  // Merci view resets on the next open (not on close) so it doesn't swap mid exit-animation.
  setBagOpen: open => set(open ? { bagOpen: true, orderId: null, toast: null, productId: null } : { bagOpen: false }),
  setMenuOpen: menuOpen => set({ menuOpen }),
  hideToast: () => set({ toast: null }),
  closeAll: () => set({ productId: null, bagOpen: false, menuOpen: false }),
  setShot: (key, url) => set(s => ({ shots: { ...s.shots, [key]: url } })),
  setShotsFailed: () => set({ shotsFailed: true }),
}), {
  name: 'oriss.bag.v2',
  partialize: s => ({ bag: s.bag }),
  merge: (stored, current) => ({ ...current, bag: sanitizeBag(stored?.bag) }),
}));
