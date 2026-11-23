import { STATS, STEPS } from '../data.js';
import { Reveal, Lines } from './fx.jsx';

export default function Craft() {
  return (
    <section className="section craft" id="craft" tabIndex={-1}>
      <div className="container">
        <div className="craft__inner">
          <div className="craft__intro">
            <Reveal as="p" className="label">The Craft</Reveal>
            <Lines className="title" lines={['Slow perfumery,', '*by hand*']} />
            <Reveal as="p" className="lead" delay={0.15}>We work the old way, because some things cannot be rushed. Every bottle passes through the hands of the same small atelier.</Reveal>
          </div>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" className="step" key={s.title} delay={i * 0.06}>
                <span className="step__num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal className="stats">
          {STATS.map(s => (
            <div className="stat" key={s.label}><span className="stat__num">{s.n}{s.suffix}</span><span className="stat__label">{s.label}</span></div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
