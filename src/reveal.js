// Scroll-reveal observer shared by every section (+ the "decrypt" heading effect).
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let io = null;

function scramble(el) {
  if (reduce()) return;
  const f = el.textContent, ch = '01<>/{}#$%&', t0 = performance.now();
  (function s(now) {
    const p = Math.min((now - t0) / 800, 1), n = Math.floor(p * f.length);
    let o = '';
    for (let i = 0; i < f.length; i++) o += i < n || f[i] === ' ' ? f[i] : ch[Math.floor(Math.random() * ch.length)];
    el.textContent = o;
    if (p < 1) requestAnimationFrame(s);
  })(t0);
}

function getIO() {
  if (!io) {
    io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          if (e.target.classList.contains('t')) scramble(e.target);
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
  }
  return io;
}

export function observeAll() {
  document.querySelectorAll('.rv:not(.in)').forEach((el) => getIO().observe(el));
}
export function resetReveal() { if (io) { io.disconnect(); io = null; } }
