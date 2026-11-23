import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ease } from '../motion.js';
import { Reveal, Lines } from './fx.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const inputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', msg: '' });

  const submit = e => {
    e.preventDefault();
    const v = email.trim();
    if (!v || !EMAIL_RE.test(v)) {
      setState({ status: 'error', msg: v ? 'Please enter a valid email address.' : 'Please enter your email address.' });
      inputRef.current?.focus();
      return;
    }
    setState({ status: 'success', msg: `Thank you — your first letter is on its way to ${v}.` });
  };
  const err = state.status === 'error', ok = state.status === 'success';

  return (
    <section className="section newsletter" id="newsletter" tabIndex={-1}>
      <div className="container newsletter__inner">
        <div>
          <Reveal as="p" className="label">Le Cercle</Reveal>
          <Lines className="title" lines={['Letters from', 'the Maison']} />
        </div>
        <Reveal delay={0.15}>
          <p className="lead">Early access to limited editions, stories from the atelier, and a discovery vial with your first order.</p>
          <form className={`news-form${err ? ' is-error' : ''}${ok ? ' is-success' : ''}`} id="newsForm" noValidate onSubmit={submit}>
            <AnimatePresence initial={false}>
              {!ok && (
                <motion.div className="news-form__row" exit={{ opacity: 0, transition: { duration: 0.4, ease } }}>
                  <label className="visually-hidden" htmlFor="email">Email address</label>
                  <input ref={inputRef} id="email" name="email" type="email" placeholder="Email address" autoComplete="email" required
                    aria-invalid={err || undefined} aria-describedby="emailMsg" value={email}
                    onChange={e => { setEmail(e.target.value); if (err) setState({ status: 'idle', msg: '' }); }} />
                  <button className="text-link" type="submit">Subscribe</button>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="news-form__msg" id="emailMsg" role="status">
              {ok ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease, delay: 0.3 }}>{state.msg}</motion.span> : state.msg}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
