import { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { fade } from '../motion.js';

export { Dialog };

/**
 * Accessible dialog (Radix: focus trap, Esc, scroll lock, inert page) with framer-motion enter/exit.
 * Children must include a <Dialog.Title>.
 */
export default function Overlay({ open, onOpenChange, id, className, motionProps, scrim = true, children }) {
  const returnTo = useRef(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {scrim && <Dialog.Overlay asChild forceMount><motion.div className="scrim" {...fade} /></Dialog.Overlay>}
            <Dialog.Content asChild forceMount aria-describedby={undefined}
              onOpenAutoFocus={() => { returnTo.current = document.activeElement; }}
              onCloseAutoFocus={e => {
                // opened from code (no Radix trigger): hand focus back to whatever opened it
                e.preventDefault();
                if (returnTo.current?.isConnected) returnTo.current.focus({ preventScroll: true });
              }}>
              <Panel id={id} className={className} motionProps={motionProps}>{children}</Panel>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

// Inert while animating out, so a double-click can't fire buttons on a closing panel.
function Panel({ motionProps, children, ...rest }) {
  const present = useIsPresent();
  return <motion.div {...rest} {...motionProps} data-lenis-prevent inert={!present || undefined}>{children}</motion.div>;
}
