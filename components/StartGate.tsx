"use client";

import { AnimatePresence, motion } from "motion/react";

export function StartGate({ started, onStart }: { started: boolean; onStart: () => void }) {
  return (
    <AnimatePresence>
      {!started && (
        <motion.div
          className="start-gate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="small-moon" aria-hidden="true" />
          <motion.button
            type="button"
            className="begin-cue magnetic"
            data-magnetic
            onClick={onStart}
            whileTap={{ scale: 0.97 }}
            aria-label="Begin Hayati's experience"
          >
            <span>Hayati.</span>
            <small>touch to begin</small>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
