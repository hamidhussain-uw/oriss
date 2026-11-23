import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store.js';
import { QUIZ, FAMILY, DEFAULT_SIZE } from '../data.js';
import { money, recommend } from '../shop.js';
import { ease, easeInOut } from '../motion.js';
import { Reveal, Lines, ProductImage } from './fx.jsx';

export default function Finder() {
  const [answers, setAnswers] = useState([]);
  const touched = useRef(false);
  const step = answers.length, done = step === QUIZ.length;
  // after a choice, move focus to the new step's heading once it has faded in
  const focusHead = useCallback(el => { if (el && touched.current) el.focus({ preventScroll: true }); }, []);
  // `from` = the step the click came from; clicks on a step that is still fading out are ignored
  const set = (from, next) => { touched.current = true; setAnswers(a => (a.length === from ? next(a) : a)); };

  return (
    <section className="section finder" id="finder" tabIndex={-1}>
      <div className="container finder__inner">
        <div className="finder__intro">
          <Reveal as="p" className="label">Scent Finder</Reveal>
          <Lines className="title" lines={['The scent', 'that *finds you*']} />
          <Reveal as="p" className="lead" delay={0.15}>Four questions. Answer with instinct and we will match you with a composition from the collection.</Reveal>
        </div>

        <Reveal className="quiz" id="quiz" delay={0.1}>
          <div className="quiz__progress" aria-hidden="true"><motion.span initial={false} animate={{ scaleX: step / QUIZ.length }} transition={{ duration: 1, ease }} /></div>
          <div className="quiz__stage" id="quizStage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.8, ease } }} exit={{ opacity: 0, transition: { duration: 0.35, ease: easeInOut } }}>
                {done
                  ? <Result answers={answers} focusHead={focusHead} onRestart={() => set(step, () => [])} />
                  : <Question step={step} focusHead={focusHead} onAnswer={v => set(step, a => [...a, v])} onBack={() => set(step, a => a.slice(0, -1))} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Question({ step, focusHead, onAnswer, onBack }) {
  const q = QUIZ[step];
  return (
    <div className="quiz__step">
      <p className="quiz__count">{String(step + 1).padStart(2, '0')} / {String(QUIZ.length).padStart(2, '0')}</p>
      <h3 className="quiz__q" tabIndex={-1} ref={focusHead}>{q.q}</h3>
      <div className="quiz__options">
        {q.a.map(([label, val]) => (
          <button key={label} className="quiz__opt" type="button" data-answer={val} onClick={() => onAnswer(val)}>
            <span>{label}</span>
          </button>
        ))}
      </div>
      {step > 0 && <button className="text-link quiz__back" type="button" onClick={onBack}>Previous question</button>}
    </div>
  );
}

function Result({ answers, focusHead, onRestart }) {
  const p = recommend(answers);
  const add = useStore(s => s.add), openProduct = useStore(s => s.openProduct);
  return (
    <div className="quiz__result">
      <ProductImage id={p.id} className="quiz__result-img" />
      <div>
        <p className="quiz__count">Your match</p>
        <h3 tabIndex={-1} ref={focusHead}>{p.name}</h3>
        <p className="quiz__result-tag">{p.tagline}</p>
        <p className="quiz__result-why">{FAMILY[p.family].why}</p>
        <div className="quiz__result-ctas">
          <button className="btn btn--solid" type="button" data-add={p.id} onClick={() => add(p.id)}>Add {DEFAULT_SIZE}ml — {money(p.prices[DEFAULT_SIZE])}</button>
          <button className="btn" type="button" data-open={p.id} onClick={() => openProduct(p.id)}>Discover</button>
        </div>
        <button className="text-link quiz__back" type="button" onClick={onRestart}>Retake</button>
      </div>
    </div>
  );
}
