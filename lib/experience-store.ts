type PointerState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  active: boolean;
  coarse: boolean;
  pressed: boolean;
};

class ExperienceStore {
  progress = 0;
  scrollVelocity = 0;
  stillness = 0;
  started = false;
  pointer: PointerState = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    speed: 0,
    active: false,
    coarse: false,
    pressed: false,
  };
  tapPulse = 0;
  bloomPulse = 0;
  private lastProgress = 0;
  private lastPointer = { x: 0, y: 0 };
  private lastActivity = performance.now();

  updateProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const next = Math.min(1, Math.max(0, window.scrollY / max));
    this.scrollVelocity = this.scrollVelocity * 0.72 + (next - this.lastProgress) * 0.28;
    this.progress = next;
    this.lastProgress = next;
    this.markActivity();
  }

  updatePointer(clientX: number, clientY: number, coarse = false) {
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -((clientY / window.innerHeight) * 2 - 1);
    this.pointer.dx = x - this.lastPointer.x;
    this.pointer.dy = y - this.lastPointer.y;
    this.pointer.speed = Math.min(1, Math.hypot(this.pointer.dx, this.pointer.dy) * 8);
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.active = true;
    this.pointer.coarse = coarse;
    this.lastPointer = { x, y };
    this.markActivity();
  }

  beginPress(clientX: number, clientY: number, coarse: boolean) {
    this.updatePointer(clientX, clientY, coarse);
    this.pointer.pressed = true;
  }

  endPress(wasTap: boolean) {
    this.pointer.pressed = false;
    if (wasTap) this.tapPulse += 1;
    this.markActivity();
  }

  bloom() {
    this.bloomPulse += 1;
    this.markActivity();
  }

  tick(delta: number) {
    this.pointer.dx *= Math.pow(0.03, delta);
    this.pointer.dy *= Math.pow(0.03, delta);
    this.pointer.speed *= Math.pow(0.05, delta);
    this.scrollVelocity *= Math.pow(0.018, delta);
    this.stillness = Math.min(1, (performance.now() - this.lastActivity - 900) / 4200);
  }

  private markActivity() {
    this.lastActivity = performance.now();
    this.stillness = 0;
  }
}

export const experienceStore = new ExperienceStore();
