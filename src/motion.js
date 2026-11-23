// Every timing in the site lives here. Tweens only (no springs): slow, decelerating, calm.
export const ease = [0.16, 1, 0.3, 1];        // long expo-out
export const easeInOut = [0.65, 0, 0.35, 1];

export const dur = { quick: 0.5, base: 1.1, slow: 1.6 };

export const viewport = { once: true, amount: 0.25 };

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: dur.base, ease, delay: d } }),
};

export const lineUp = {
  hidden: { y: '105%' },
  show: { y: '0%', transition: { duration: dur.slow, ease } },
};

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.7, ease } },
  exit: { opacity: 0, transition: { duration: 0.45, ease: easeInOut } },
};
