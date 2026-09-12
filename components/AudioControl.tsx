"use client";

import { motion } from "motion/react";

export function AudioControl({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <motion.button
      className="sound-control"
      type="button"
      onClick={onToggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      aria-label={playing ? "Pause music" : "Play music"}
      title={playing ? "Pause music" : "Play music"}
    >
      <span className={playing ? "sound-wave is-playing" : "sound-wave"} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </motion.button>
  );
}
