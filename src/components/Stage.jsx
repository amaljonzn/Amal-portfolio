import { useEffect, useRef, useState } from 'react';
import DeskCanvas from './DeskCanvas';
import { DATA } from '../data';
import heroUrl from '../assets/hero.jpg';

const NAV = [['about', 'About'], ['projects', 'Projects'], ['skills', 'Skills'], ['contact', 'Contact']];
// desk objects that scroll to a page section instead of opening a popup
const SCROLL_TO = { projects: 'work', skills: 'sk', contact: 'ct' };

function About() {
  return (
    <>
      <div className="ab">
        <img src={heroUrl} alt="" />
        <div>
          <h2>Hi, I’m {DATA.name.split(' ')[0]}</h2>
          <p className="role">{DATA.role} · Wayanad, Kerala</p>
        </div>
      </div>
      <p>{DATA.about}</p>
      <div className="tiles">
        <div><b>MERN</b><span>certified stack</span></div>
        <div><b>2</b><span>live projects</span></div>
        <div><b>6</b><span>certifications</span></div>
        <div><b>BCA</b><span>Bengaluru City University</span></div>
      </div>
      <h3>What I bring</h3>
      <ul className="chk">
        <li>Full stack apps from database to deployment</li>
        <li>An IT-support mindset: I fix real user problems</li>
        <li>Finance and SAP background for business-style apps</li>
      </ul>
      <div className="tags">{DATA.skills.slice(0, 8).map((t) => <span key={t}>{t}</span>)}</div>
    </>
  );
}

export default function Stage() {
  const stageRef = useRef(null);
  const timers = useRef([]);
  const [active, setActive] = useState('home');
  const [failed, setFailed] = useState(false);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  function go(sec) {
    clearTimers();
    setActive(sec);
    const target = SCROLL_TO[sec];
    if (target) {
      // camera flies to the object first, then the page scrolls to the matching section
      timers.current.push(setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 600));
      timers.current.push(setTimeout(() => setActive('home'), 2400));
    }
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') go('home'); };
    addEventListener('keydown', onKey);
    return () => { removeEventListener('keydown', onKey); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) {
    return (
      <section className="stage" id="stage" style={{ height: 'auto', minHeight: 0 }}>
        <div className="sec"><div className="wrap">
          <h2 className="t">Welcome</h2>
          <p className="sub">The interactive 3D desk isn’t supported on this device. Scroll down to see my experience, projects and skills.</p>
        </div></div>
      </section>
    );
  }

  return (
    <section className="stage" id="stage" ref={stageRef}>
      <DeskCanvas stageRef={stageRef} active={active} onPick={go} onFail={() => setFailed(true)} />
      <div className="bar">
        <button className="brand" onClick={() => go('home')}>{DATA.name}</button>
        <nav aria-label="Sections">
          {NAV.map(([id, label]) => (
            <button key={id} aria-current={active === id} onClick={() => go(id)}>{label}</button>
          ))}
        </nav>
      </div>
      <div className={'intro' + (active !== 'home' ? ' off' : '')} id="intro">
        <h2>Welcome to my desk.</h2>
        <p>Click the monitor, laptop, mug or lamp to explore.</p>
      </div>
      <section className={'panel' + (active === 'about' ? ' on' : '')} id="panel" aria-live="polite">
        <button className="x" id="close" aria-label="Close" onClick={() => go('home')}>×</button>
        <div id="pc"><About /></div>
      </section>
    </section>
  );
}
