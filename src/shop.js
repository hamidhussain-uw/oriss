// Pure bag + quiz logic (no React), covered by shop.test.js.
import { PRODUCTS, byId, SIZES } from './data.js';

export const FREE_SHIP = 150;
export const SHIP_COST = 12;
export const MAX_QTY = 10;

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const money = n => fmt.format(n);

export const keyOf = i => `${i.id}-${i.size}`;
export const lineTotal = i => byId[i.id].prices[i.size] * i.qty;
export const subtotal = items => items.reduce((s, i) => s + lineTotal(i), 0);
export const shippingFor = sub => (sub === 0 || sub >= FREE_SHIP ? 0 : SHIP_COST);
export const countItems = items => items.reduce((s, i) => s + i.qty, 0);

export function addItem(bag, id, size, qty = 1) {
  const found = bag.find(i => i.id === id && i.size === size);
  if (found) return bag.map(i => (i === found ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i));
  return [...bag, { id, size, qty: Math.min(qty, MAX_QTY) }];
}

export function setItemQty(bag, key, qty) {
  if (qty < 1) return bag.filter(i => keyOf(i) !== key);
  return bag.map(i => (keyOf(i) === key ? { ...i, qty: Math.min(qty, MAX_QTY) } : i));
}

// Stored data is untrusted: keep only known products/sizes and sane quantities.
export function sanitizeBag(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(i => i && byId[i.id] && SIZES.includes(i.size) && Number.isInteger(i.qty) && i.qty > 0)
    .map(i => ({ id: i.id, size: i.size, qty: Math.min(i.qty, MAX_QTY) }));
}

// First three answers pick the family (majority, ties go to the earliest), the fourth picks intensity.
export function recommend(ans) {
  const fams = ans.slice(0, 3), counts = {};
  fams.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
  const max = Math.max(...Object.values(counts));
  const fam = counts[fams[0]] === max ? fams[0] : fams.find(f => counts[f] === max);
  return PRODUCTS.find(p => p.family === fam && p.intensity === ans[3]);
}
