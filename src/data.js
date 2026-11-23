// Placeholder catalogue and copy: replace before launch.
export const PRODUCTS = [
  { id: 'ombrelune', no: '01', name: 'Ombrelune', family: 'amber', intensity: 'bold', badge: 'Signature',
    tagline: 'Amber · Smoked oud · Bourbon vanilla',
    desc: 'A slow-burning amber lit by smoked oud and Madagascan bourbon vanilla. It opens like velvet curtains at midnight and settles into skin like a secret.',
    notes: { top: ['Pink pepper', 'Saffron', 'Bergamot'], heart: ['Smoked oud', 'Rose absolute', 'Labdanum'], base: ['Bourbon vanilla', 'Amber', 'Benzoin'] },
    prices: { 30: 110, 50: 165, 100: 245 }, longevity: 5, sillage: 5,
    liquid: ['#e09a4a', '#6b2414'], tint: '#d0843b', cap: 'gold', shape: 'square' },
  { id: 'noctiflore', no: '02', name: 'Noctiflore', family: 'floral', intensity: 'bold', badge: 'Bestseller',
    tagline: 'Jasmine sambac · Tuberose · White musk',
    desc: 'Night-blooming jasmine and creamy tuberose gathered after dark, wrapped in luminous white musk. Opulent, heady and unapologetically romantic.',
    notes: { top: ['Mandarin', 'Green leaves'], heart: ['Jasmine sambac', 'Tuberose', 'Orange blossom'], base: ['White musk', 'Sandalwood'] },
    prices: { 30: 105, 50: 155, 100: 230 }, longevity: 4, sillage: 5,
    liquid: ['#f7d6d0', '#c26a78'], tint: '#e29aa4', cap: 'gold', shape: 'tall' },
  { id: 'cedralis', no: '03', name: 'Cedralis', family: 'woody', intensity: 'bold',
    tagline: 'Atlas cedar · Vetiver · Smoked birch',
    desc: 'Atlas cedar and Haitian vetiver smoulder over birch tar and black pepper. A walk through a forest after the fire — strangely, quietly beautiful.',
    notes: { top: ['Black pepper', 'Cardamom'], heart: ['Atlas cedar', 'Vetiver', 'Cypress'], base: ['Birch tar', 'Leather', 'Cashmeran'] },
    prices: { 30: 100, 50: 150, 100: 225 }, longevity: 5, sillage: 4,
    liquid: ['#c2a868', '#3d3420'], tint: '#a08c55', cap: 'noir', shape: 'square' },
  { id: 'marenza', no: '04', name: 'Marenza', family: 'fresh', intensity: 'bold',
    tagline: 'Sea salt · Clary sage · Ambergris',
    desc: 'Mineral sea salt, wild clary sage and a warm drift of ambergris. Wind in your hair on a cliff path, hours after the swim.',
    notes: { top: ['Sea salt', 'Grapefruit'], heart: ['Clary sage', 'Rosemary', 'Seaweed'], base: ['Ambergris', 'Driftwood', 'Musk'] },
    prices: { 30: 95, 50: 140, 100: 210 }, longevity: 4, sillage: 4,
    liquid: ['#cdeaec', '#4f8e99'], tint: '#7fb8c0', cap: 'gold', shape: 'tall' },
  { id: 'velaria', no: '05', name: 'Velaria', family: 'amber', intensity: 'soft', badge: 'New',
    tagline: 'Tonka · Saffron · Cashmere wood',
    desc: 'Honeyed tonka folded into soft cashmere woods with a glint of saffron. The comfort of a favourite sweater, rendered in gold.',
    notes: { top: ['Saffron', 'Pear'], heart: ['Tonka bean', 'Heliotrope'], base: ['Cashmere wood', 'Vanilla', 'Musk'] },
    prices: { 30: 95, 50: 140, 100: 210 }, longevity: 4, sillage: 3,
    liquid: ['#f5cf8c', '#b8742f'], tint: '#e2a95a', cap: 'noir', shape: 'round' },
  { id: 'iridane', no: '06', name: 'Iridane', family: 'floral', intensity: 'soft',
    tagline: 'Orris · Pear blossom · Suede',
    desc: 'Powdery orris butter and pear blossom over a whisper of suede. Quiet, polished and impossibly soft — like light through linen curtains.',
    notes: { top: ['Pear blossom', 'Pink pepper'], heart: ['Orris butter', 'Violet leaf'], base: ['Suede', 'Ambrette', 'Cedar'] },
    prices: { 30: 100, 50: 150, 100: 220 }, longevity: 3, sillage: 2,
    liquid: ['#ebe0f5', '#9a84b8'], tint: '#b9a5d6', cap: 'ivory', shape: 'slim' },
  { id: 'sylvarine', no: '07', name: 'Sylvarine', family: 'woody', intensity: 'soft',
    tagline: 'Fig leaf · Sandalwood · Oakmoss',
    desc: 'Green fig leaf crushed between the fingers, resting on creamy sandalwood and damp oakmoss. Shade, stillness and the hush of tall trees.',
    notes: { top: ['Fig leaf', 'Bergamot'], heart: ['Fig milk', 'Coriander'], base: ['Sandalwood', 'Oakmoss', 'Musk'] },
    prices: { 30: 90, 50: 135, 100: 200 }, longevity: 3, sillage: 3,
    liquid: ['#d6ddb6', '#6f7d4c'], tint: '#9aa874', cap: 'ivory', shape: 'round' },
  { id: 'solvere', no: '08', name: 'Solvere', family: 'fresh', intensity: 'soft',
    tagline: 'Neroli · Mandarin · White tea',
    desc: 'Sun-warmed neroli and sparkling mandarin poured over white tea and clean musk. Effortless and bright — the first morning of a holiday.',
    notes: { top: ['Mandarin', 'Bergamot', 'Petitgrain'], heart: ['Neroli', 'White tea'], base: ['Clean musk', 'Vetiver'] },
    prices: { 30: 85, 50: 125, 100: 190 }, longevity: 3, sillage: 2,
    liquid: ['#fdeec2', '#e0b04f'], tint: '#efcf7a', cap: 'ivory', shape: 'slim' },
];

export const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
export const SIZES = [30, 50, 100];
export const DEFAULT_SIZE = 50;

export const FAMILY = {
  floral: { label: 'Floral', why: 'You are drawn to softness with a romantic edge — petals, light and skin. A floral composition will feel like a natural extension of you.' },
  woody: { label: 'Woody', why: 'You find calm in grounded, natural things — bark, moss and quiet places. A woody composition will feel steady, private and assured.' },
  amber: { label: 'Amber', why: 'You are drawn to warmth and a touch of mystery — candlelight, velvet, the late hours. An amber composition will wrap around you like a second skin.' },
  fresh: { label: 'Fresh', why: 'You love air, light and movement — open windows and salt on the skin. A fresh composition will feel effortless from morning to night.' },
};

export const LAYERS = {
  top: { title: 'Top notes', time: 'The first fifteen minutes', text: 'The opening — bright and fleeting, the first impression that draws people closer.' },
  heart: { title: 'Heart notes', time: 'From thirty minutes to four hours', text: 'The character of the fragrance, unfolding slowly as it warms on your skin.' },
  base: { title: 'Base notes', time: 'Into the night', text: 'The memory — deep, resinous materials that linger long after you have left the room.' },
};

export const QUIZ = [
  { q: 'Where does your mind wander?', a: [
    ['A garden at first light', 'floral', 'linear-gradient(135deg,#f8d9d3,#d98b97)'],
    ['A forest after the rain', 'woody', 'linear-gradient(135deg,#cbd3a6,#5d6b3e)'],
    ['A candlelit room at midnight', 'amber', 'linear-gradient(135deg,#f0b05c,#6b2414)'],
    ['A cliff above the sea', 'fresh', 'linear-gradient(135deg,#d4eef0,#4f8e99)'] ] },
  { q: 'Choose a texture.', a: [
    ['Silk petals', 'floral', 'linear-gradient(135deg,#fbe8ee,#e2b4c6)'],
    ['Cedar bark', 'woody', 'linear-gradient(135deg,#a88b62,#4a3a24)'],
    ['Warm cashmere', 'amber', 'linear-gradient(135deg,#f3d7b0,#b98a55)'],
    ['Sun-dried linen', 'fresh', 'linear-gradient(135deg,#ffffff,#dfe4e1)'] ] },
  { q: 'Pick an hour of the day.', a: [
    ['Golden morning', 'floral', 'linear-gradient(135deg,#fff1cc,#f2b6a0)'],
    ['Misty dusk', 'woody', 'linear-gradient(135deg,#b8bfb4,#55604f)'],
    ['Deep night', 'amber', 'linear-gradient(135deg,#6b3a52,#1a1018)'],
    ['Bright noon', 'fresh', 'linear-gradient(135deg,#fffbe0,#9fd3e0)'] ] },
  { q: 'How should your fragrance linger?', a: [
    ['A whisper, close to the skin', 'soft', 'radial-gradient(circle,#fff 0 30%,#3a3442 31%)'],
    ['A trail that is remembered', 'bold', 'radial-gradient(circle,#e2c48e 0 30%,#1b1613 31%)'] ] },
];

export const REVIEWS = [
  { quote: 'Ombrelune is the only fragrance I have ever been stopped in the street for. It lasts from morning coffee to the last train home.', name: 'Amara K.', wears: 'Ombrelune' },
  { quote: 'Iridane feels like clean skin, only better. Quiet and elegant, and somehow everyone notices.', name: 'Julien M.', wears: 'Iridane' },
  { quote: 'I took the scent finder on a whim and it chose Cedralis. It is now the bottle I reach for every single morning.', name: 'Sofia R.', wears: 'Cedralis' },
  { quote: 'Marenza smells like the last week of summer. I ordered the large bottle before my sample was even finished.', name: 'Theo L.', wears: 'Marenza' },
];

export const STATS = [
  { n: 120, suffix: '+', label: 'Raw materials' },
  { n: 18, suffix: '', label: 'Months of maceration' },
  { n: 3, suffix: '', label: 'Master perfumers' },
  { n: 100, suffix: '%', label: 'Refillable glass' },
];

export const STEPS = [
  { title: 'Sourcing', icon: 'flower', text: 'Jasmine picked at dawn, orris root aged for three years, vetiver from a single family farm. We buy fewer materials, of far better quality.' },
  { title: 'Composition', icon: 'flask', text: 'Each formula is written by hand and revised for up to two years. Some of our compositions contain more than sixty materials; none contain shortcuts.' },
  { title: 'Maceration', icon: 'hourglass', text: 'The concentrate rests in cool darkness for eighteen months, until every note has softened into the next. Time is our rarest ingredient.' },
  { title: 'Hand-finishing', icon: 'drop', text: 'Filled, capped and numbered by hand in our atelier, then wrapped in recycled cotton paper. Every bottle is made to be refilled for life.' },
];
