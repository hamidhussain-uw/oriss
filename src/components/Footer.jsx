import { FAMILY } from '../data.js';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a className="nav__logo footer__logo" href="#top">Oriss</a>
          <p>A maison de parfum. Small-batch compositions, finished by hand and made to linger.</p>
        </div>
        <div>
          <h3 className="label">Shop</h3>
          <ul className="footer__links">
            <li><a href="#collection" data-filter-link="all">All fragrances</a></li>
            {Object.entries(FAMILY).map(([k, v]) => <li key={k}><a href="#collection" data-filter-link={k}>{v.label}</a></li>)}
          </ul>
        </div>
        <div>
          <h3 className="label">Maison</h3>
          <ul className="footer__links">
            <li><a href="#signature">The Signature</a></li>
            <li><a href="#craft">The Craft</a></li>
            <li><a href="#finder">Scent Finder</a></li>
            <li><a href="#newsletter">Le Cercle</a></li>
          </ul>
        </div>
        <div>
          <h3 className="label">Contact</h3>
          <ul className="footer__links">
            <li><a href="mailto:hello@oriss.example">hello@oriss.example</a></li>
            <li>Paris &amp; Grasse</li>
            <li>Mon–Sat, 10:00–19:00</li>
          </ul>
        </div>
      </div>
      <p className="footer__word" aria-hidden="true">Oriss</p>
      <div className="container footer__bottom">
        <span>© 2026 Oriss</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}
