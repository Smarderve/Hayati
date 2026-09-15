class CinematicStore {
  progress = 0;
  pointer = { x: 0, y: 0 };
  velocity = 0;
  previous = 0;
  updateProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const next = Math.max(0, Math.min(1, scrollY / max));
    this.velocity = this.velocity * .72 + (next - this.previous) * .28;
    this.progress = next;
    this.previous = next;
  }
  updatePointer(x: number, y: number) {
    this.pointer.x = x / innerWidth * 2 - 1;
    this.pointer.y = -(y / innerHeight * 2 - 1);
  }
}
export const cinematicStore = new CinematicStore();
