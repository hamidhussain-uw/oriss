import { describe, it, expect } from 'vitest';
import { subtotal, shippingFor, SHIP_COST, addItem, setItemQty, sanitizeBag, recommend, MAX_QTY, countItems } from './shop.js';
import { PRODUCTS, FAMILY } from './data.js';

describe('bag math', () => {
  it('totals and shipping threshold', () => {
    expect(subtotal([{ id: 'ombrelune', size: 50, qty: 2 }])).toBe(330);
    expect(shippingFor(0)).toBe(0);
    expect(shippingFor(149)).toBe(SHIP_COST);
    expect(shippingFor(150)).toBe(0);
  });

  it('adds, merges, caps and removes', () => {
    let bag = addItem([], 'solvere', 50);
    bag = addItem(bag, 'solvere', 50, 2);
    expect(bag).toEqual([{ id: 'solvere', size: 50, qty: 3 }]);
    bag = addItem(bag, 'solvere', 50, 99);
    expect(bag[0].qty).toBe(MAX_QTY);
    bag = addItem(bag, 'iridane', 100);
    expect(countItems(bag)).toBe(MAX_QTY + 1);
    expect(setItemQty(bag, 'solvere-50', 0)).toEqual([{ id: 'iridane', size: 100, qty: 1 }]);
  });

  it('drops invalid stored items', () => {
    expect(sanitizeBag('x')).toEqual([]);
    expect(sanitizeBag([{ id: 'nope', size: 50, qty: 1 }, { id: 'cedralis', size: 75, qty: 1 }, { id: 'cedralis', size: 30, qty: 1.5 }, { id: 'cedralis', size: 30, qty: 40 }]))
      .toEqual([{ id: 'cedralis', size: 30, qty: MAX_QTY }]);
  });
});

describe('quiz', () => {
  it('recommends by majority family and intensity', () => {
    expect(recommend(['amber', 'woody', 'amber', 'bold']).id).toBe('ombrelune');
    expect(recommend(['fresh', 'floral', 'woody', 'soft']).id).toBe('solvere');
  });
  it('every outcome has a product', () => {
    for (const f of Object.keys(FAMILY)) for (const i of ['soft', 'bold'])
      expect(PRODUCTS.some(p => p.family === f && p.intensity === i)).toBe(true);
  });
});
