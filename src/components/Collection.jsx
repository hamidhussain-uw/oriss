import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store.js';
import { PRODUCTS, FAMILY, DEFAULT_SIZE } from '../data.js';
import { money } from '../shop.js';
import { ease, easeInOut } from '../motion.js';
import { Reveal, Lines, ProductImage, ImageReveal } from './fx.jsx';

const FILTERS = [['all', 'All'], ...Object.entries(FAMILY).map(([k, v]) => [k, v.label])];
const SORTS = [['featured', 'Featured'], ['low', 'Price, low to high'], ['high', 'Price, high to low'], ['name', 'Name']];

export default function Collection() {
  const filter = useStore(s => s.filter), sort = useStore(s => s.sort);
  const setFilter = useStore(s => s.setFilter), setSort = useStore(s => s.setSort);

  const list = useMemo(() => {
    const l = PRODUCTS.filter(p => filter === 'all' || p.family === filter);
    if (sort === 'low') return [...l].sort((a, b) => a.prices[50] - b.prices[50]);
    if (sort === 'high') return [...l].sort((a, b) => b.prices[50] - a.prices[50]);
    if (sort === 'name') return [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [filter, sort]);

  return (
    <section className="section collection" id="collection" tabIndex={-1}>
      <div className="container">
        <div className="collection__head">
          <div>
            <Reveal as="p" className="label">The Collection</Reveal>
            <Lines className="title" lines={['Eight compositions']} />
          </div>
          <Reveal className="toolbar" delay={0.15}>
            <div className="chips" role="group" aria-label="Filter by scent family">
              {FILTERS.map(([f, label]) => (
                <button key={f} type="button" className={`chip${filter === f ? ' is-active' : ''}`} data-filter={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {label}
                  {filter === f && <motion.span layoutId="chip-line" className="chip__line" transition={{ duration: 0.7, ease }} />}
                </button>
              ))}
            </div>
            <label className="sort">
              <span className="visually-hidden">Sort</span>
              <select id="sort" value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          </Reveal>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={filter + sort} className="grid" id="grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.8, ease } }} exit={{ opacity: 0, transition: { duration: 0.35, ease: easeInOut } }}>
            {list.map((p, i) => <Card key={p.id} p={p} i={i} />)}
          </motion.div>
        </AnimatePresence>
        <p className="visually-hidden" id="gridStatus" role="status">Showing {list.length} fragrance{list.length === 1 ? '' : 's'}</p>
      </div>
    </section>
  );
}

function Card({ p, i }) {
  const openProduct = useStore(s => s.openProduct);
  const add = useStore(s => s.add);
  return (
    <article className="card">
      <button type="button" className="card__media" data-open={p.id} onClick={() => openProduct(p.id)} aria-label={`View ${p.name}`}>
        <ImageReveal delay={(i % 4) * 0.12}><ProductImage id={p.id} /></ImageReveal>
        {p.badge && <span className="card__badge">{p.badge}</span>}
      </button>
      <div className="card__body">
        <div>
          <h3><button className="card__title" type="button" data-open={p.id} onClick={() => openProduct(p.id)}>{p.name}</button></h3>
          <p className="card__meta">{FAMILY[p.family].label} · {p.intensity === 'bold' ? 'Intense' : 'Soft'}</p>
        </div>
        <div className="card__side">
          <span className="card__price">From {money(p.prices[30])}</span>
          <button className="card__add" type="button" data-add={p.id} aria-label={`Add ${p.name} ${DEFAULT_SIZE}ml to bag`} onClick={() => add(p.id)}>Add {DEFAULT_SIZE}ml</button>
        </div>
      </div>
    </article>
  );
}
