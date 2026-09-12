type PointerState = { x: number; y: number; active: boolean };

class ExperienceStore {
  progress = 0;
  started = false;
  pointer: PointerState = { x: 0, y: 0, active: false };

  updateProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.progress = Math.min(1, Math.max(0, window.scrollY / max));
  }

  updatePointer(clientX: number, clientY: number) {
    this.pointer.x = (clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -((clientY / window.innerHeight) * 2 - 1);
    this.pointer.active = true;
  }
}

export const experienceStore = new ExperienceStore();
