import { useEffect } from 'react';
import { observeAll, resetReveal } from '../reveal';

// Scroll + pointer effects for the whole page: hero parallax, section parallax,
// timeline progress, top progress bar, card tilt, magnetic buttons, cursor ring.
export function useSiteEffects() {
  useEffect(() => {
    const d = document, $ = (s) => d.querySelector(s), all = (s) => [...d.querySelectorAll(s)];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (x) => Math.max(0, Math.min(1, x));
    const cleanups = [];
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); cleanups.push(() => t.removeEventListener(e, f, o)); };

    d.documentElement.classList.add('js');
    observeAll();
    cleanups.push(resetReveal);

    // hero: scroll progress (--p) + mouse depth (--mx / --my)
    const hero = $('#top');
    let hx = 0, hy = 0, tx = 0, ty = 0, raf = 0;
    on(window, 'pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; });
    const loop = () => {
      if (hero) {
        hero.style.setProperty('--p', (reduce ? 0 : clamp(scrollY / (hero.offsetHeight * 0.8))).toFixed(3));
        if (!reduce) {
          hx += (tx - hx) * 0.06; hy += (ty - hy) * 0.06;
          hero.style.setProperty('--mx', hx.toFixed(3));
          hero.style.setProperty('--my', hy.toFixed(3));
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    cleanups.push(() => cancelAnimationFrame(raf));

    // timelines, per-section parallax (--sp) and the top progress bar
    const bar = $('.spb');
    const onScroll = () => {
      all('.tl').forEach((t) => {
        const r = t.getBoundingClientRect();
        t.style.setProperty('--tp', clamp((innerHeight * 0.7 - r.top) / r.height));
      });
      all('.sec').forEach((s) => {
        const r = s.getBoundingClientRect();
        s.style.setProperty('--sp', clamp((innerHeight - r.top) / (innerHeight + r.height)).toFixed(3));
      });
      const h = d.documentElement;
      if (bar) bar.style.transform = `scaleX(${scrollY / (h.scrollHeight - innerHeight) || 0})`;
    };
    on(window, 'scroll', onScroll, { passive: true });
    onScroll();

    // tilt cards + magnetic buttons
    if (!reduce) {
      all('.tilt').forEach((c) => {
        on(c, 'pointermove', (e) => {
          const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        on(c, 'pointerleave', () => { c.style.transform = ''; });
      });
      all('[data-mag]').forEach((b) => {
        on(b, 'pointermove', (e) => {
          const r = b.getBoundingClientRect();
          b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
        });
        on(b, 'pointerleave', () => { b.style.transform = ''; });
      });
    }

    // cursor ring (mouse only)
    const ring = $('#ring');
    if (ring && matchMedia('(pointer:fine)').matches && !reduce) {
      let rx = 0, ry = 0, cx = 0, cy = 0, r2 = 0;
      on(window, 'pointermove', (e) => {
        cx = e.clientX; cy = e.clientY;
        ring.style.opacity = 1;
        ring.classList.toggle('big', !!(e.target.closest && e.target.closest('a,button,.tilt,canvas')));
      });
      const m = () => {
        rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
        ring.style.transform = `translate(${rx}px,${ry}px)`;
        r2 = requestAnimationFrame(m);
      };
      m();
      cleanups.push(() => cancelAnimationFrame(r2));
    }

    return () => cleanups.forEach((f) => f());
  }, []);
}
