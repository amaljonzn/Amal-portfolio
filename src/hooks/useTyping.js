import { useEffect, useState } from 'react';

// Types out each role, deletes it, then moves to the next one.
export function useTyping(roles) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setText(roles[0]); return; }
    let ri = 0, ci = 0, del = false, id;
    const tick = () => {
      const w = roles[ri];
      ci += del ? -1 : 1;
      setText(w.slice(0, ci));
      let wait = del ? 35 : 70;
      if (!del && ci === w.length) { del = true; wait = 1400; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 350; }
      id = setTimeout(tick, wait);
    };
    tick();
    return () => clearTimeout(id);
  }, [roles]);
  return text;
}
