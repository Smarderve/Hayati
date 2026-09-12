export type AudioAvailability = "checking" | "ready" | "missing" | "blocked";

export class AudioDirector {
  private audio: HTMLAudioElement | null = null;
  private fadeFrame = 0;
  availability: AudioAvailability = "checking";
  isPlaying = false;

  async prepare() {
    try {
      const response = await fetch("/audio/love-kouz1.licensed.mp3", { method: "HEAD" });
      if (!response.ok) {
        this.availability = "missing";
        return false;
      }
      this.audio = new Audio("/audio/love-kouz1.licensed.mp3");
      this.audio.preload = "metadata";
      this.audio.loop = false;
      this.audio.volume = 0;
      this.audio.addEventListener("ended", () => (this.isPlaying = false));
      this.availability = "ready";
      return true;
    } catch {
      this.availability = "missing";
      return false;
    }
  }

  async start() {
    if (!this.audio && !(await this.prepare())) return false;
    try {
      await this.audio?.play();
      this.isPlaying = true;
      this.fadeTo(0.58, 1800);
      return true;
    } catch {
      this.availability = "blocked";
      return false;
    }
  }

  async toggle() {
    if (!this.audio) return false;
    if (this.audio.paused) {
      try {
        await this.audio.play();
        this.isPlaying = true;
        this.fadeTo(0.58, 500);
      } catch {
        this.availability = "blocked";
      }
    } else {
      this.fadeTo(0, 350, () => this.audio?.pause());
      this.isPlaying = false;
    }
    return this.isPlaying;
  }

  handleVisibility(hidden: boolean) {
    if (!this.audio) return;
    if (hidden && !this.audio.paused) this.audio.pause();
  }

  private fadeTo(target: number, duration: number, done?: () => void) {
    if (!this.audio) return;
    cancelAnimationFrame(this.fadeFrame);
    const audio = this.audio;
    const startVolume = audio.volume;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      audio.volume = startVolume + (target - startVolume) * (t * (2 - t));
      if (t < 1) this.fadeFrame = requestAnimationFrame(tick);
      else done?.();
    };
    this.fadeFrame = requestAnimationFrame(tick);
  }

  destroy() {
    cancelAnimationFrame(this.fadeFrame);
    this.audio?.pause();
    this.audio = null;
  }
}
