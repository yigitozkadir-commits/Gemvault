const listeners = {};

export const bus = {
  on(event, fn) {
    (listeners[event] ??= []).push(fn);
    return () => this.off(event, fn);
  },
  off(event, fn) {
    listeners[event] = (listeners[event] || []).filter((f) => f !== fn);
  },
  emit(event, data) {
    (listeners[event] || []).slice().forEach((fn) => fn(data));
  },
  once(event, fn) {
    const wrap = (data) => { fn(data); this.off(event, wrap); };
    this.on(event, wrap);
  },
};
