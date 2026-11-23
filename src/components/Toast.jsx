import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store.js';
import { ease } from '../motion.js';

export default function Toast() {
  const toast = useStore(s => s.toast);
  const hideToast = useStore(s => s.hideToast);
  const setBagOpen = useStore(s => s.setBagOpen);
  const [hoverKey, setHoverKey] = useState(null);

  useEffect(() => {
    if (!toast || hoverKey === toast.key) return;
    const t = setTimeout(hideToast, 4000);
    return () => clearTimeout(t);
  }, [toast, hoverKey, hideToast]);

  return (
    <div id="toast" className={`toast-region${toast ? ' is-shown' : ''}`} role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.key} className="toast"
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.8, ease } }} exit={{ opacity: 0, transition: { duration: 0.35 } }}
            onPointerEnter={() => setHoverKey(toast.key)} onPointerLeave={() => setHoverKey(null)}>
            <span>{toast.text}</span>
            <button type="button" onClick={() => setBagOpen(true)}>View bag</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
