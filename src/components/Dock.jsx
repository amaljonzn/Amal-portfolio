import { useEffect, useState } from 'react';

const LINKS = [['stage', 'Desk'], ['exp', 'Experience'], ['work', 'Projects'], ['edu', 'Education'], ['sk', 'Skills'], ['ct', 'Contact']];

// Floating section menu: appears after the desk and highlights the section in view.
export default function Dock() {
  const [on, setOn] = useState(false);
  const [act, setAct] = useState('stage');
  useEffect(() => {
    const onScroll = () => {
      const stage = document.getElementById('stage');
      if (stage) setOn(stage.getBoundingClientRect().bottom < innerHeight * 0.3);
      let a = LINKS[0][0];
      LINKS.forEach(([id]) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.4) a = id;
      });
      setAct(a);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={'dock' + (on ? ' on' : '')} id="dock" aria-label="Page sections">
      {LINKS.map(([id, label]) => <a key={id} href={`#${id}`} className={act === id ? 'act' : ''}>{label}</a>)}
    </nav>
  );
}
