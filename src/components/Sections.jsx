import { useEffect, useState } from 'react';
import { DATA, EMAIL, EXPERIENCE, EDUCATION, CERTS, SKILL_GROUPS } from '../data';
import { useProjects } from '../hooks/useProjects';
import { observeAll } from '../reveal';
import { ShotService, ShotComplaint } from './Shots';

const API = import.meta.env.VITE_API_URL ?? '';
const SHOTS = { service: ShotService, complaint: ShotComplaint };

export function Marquee() {
  const items = [0, 1, 2, 3].flatMap(() => DATA.skills);
  return (
    <div className="mq" aria-hidden="true">
      <div>{items.map((s, i) => <span key={i}>{s}</span>)}</div>
    </div>
  );
}

export function Experience() {
  return (
    <section className="sec" id="exp"><div className="wrap">
      <h2 className="t rv">Experience</h2>
      <p className="sub rv">Hands-on support work that taught me how real users and systems behave.</p>
      <div className="tl rv">
        {EXPERIENCE.map((e, i) => (
          <div className="it rv" style={{ '--d': `${i * 0.12}s` }} key={e.title}>
            <h3>{e.title}</h3>
            <p className="m">{e.meta}</p>
            <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        ))}
      </div>
    </div></section>
  );
}

export function Projects() {
  const list = useProjects();
  useEffect(() => { observeAll(); }, [list]);
  return (
    <section className="sec alt" id="work"><div className="wrap">
      <h2 className="t rv">Projects</h2>
      <p className="sub rv">Two full stack apps, deployed and live.</p>
      <div className="grid2">
        {list.map((p, i) => {
          const Shot = SHOTS[p.shot];
          return (
            <div className="rv" style={i % 2 ? { '--d': '.12s' } : undefined} key={p.title}>
              <article className="card tilt">
                {Shot ? <Shot /> : <div className="shot">{p.title}</div>}
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                {p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}<br />
                {p.live && <a className="btn fill" data-mag href={p.live} target="_blank" rel="noopener noreferrer">Live demo</a>}
                {p.repo && <a className="btn" data-mag href={p.repo} target="_blank" rel="noopener noreferrer">GitHub</a>}
              </article>
            </div>
          );
        })}
      </div>
    </div></section>
  );
}

export function Education() {
  return (
    <section className="sec" id="edu"><div className="wrap">
      <h2 className="t rv">Education &amp; certifications</h2>
      <p className="sub rv">Formal degree, full stack training, and certificates across development, cloud and business tools.</p>
      <div className="tl rv">
        {EDUCATION.map((e, i) => (
          <div className="it rv" style={{ '--d': `${i * 0.12}s` }} key={e.title}>
            <h3>{e.title}</h3>
            <p className="m">{e.meta}</p>
          </div>
        ))}
      </div>
      <div className="certs">
        {CERTS.map((c, i) => (
          <div className="rv" style={{ '--d': ['0s', '.06s', '.12s'][i % 3] }} key={c.title}>
            <div className="card">
              <h3>{c.title}</h3>
              <p className="m">{c.meta}</p>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div></section>
  );
}

export function Skills() {
  return (
    <section className="sec alt" id="sk"><div className="wrap">
      <h2 className="t rv">Skills</h2>
      <p className="sub rv">The MERN stack, plus the cloud and design tools around it.</p>
      <div id="groups">
        {SKILL_GROUPS.map(([title, chips], i) => (
          <div className="grp rv" style={{ '--d': `${i * 0.05}s` }} key={title}>
            <h3>{title}</h3>
            {chips.map((c) => <span className="chip" key={c}>{c}</span>)}
          </div>
        ))}
      </div>
      <div className="rv">
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ marginTop: 0 }}>Beyond code</h3>
          <p style={{ margin: 0 }}>Before development I trained in accounting and taxation, SAP FICO &amp; MM and Tally. That gives me a practical feel for business workflows, which helps when building finance, service and admin-style apps.</p>
        </div>
      </div>
    </div></section>
  );
}

export function Contact() {
  const [f, setF] = useState({ name: '', email: '', msg: '' });
  const [ok, setOk] = useState('');
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const n = f.name.trim(), m = f.email.trim(), b = f.msg.trim();
    if (!n || !/^\S+@\S+\.\S+$/.test(m) || !b) { setOk('Please fill in your name, a valid email and a message.'); return; }
    setOk('Sending…');
    try {
      // MERN path: save the message in MongoDB through the Express API
      const r = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, email: m, message: b }),
      });
      if (!r.ok) throw new Error('api');
      setOk(`Thanks, ${n}! Your message was sent.`);
      setF({ name: '', email: '', msg: '' });
    } catch {
      // fallback when the API is not running: open the visitor's email app
      setOk(`Thanks, ${n}! Opening your email app…`);
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Portfolio message from ' + n)}&body=${encodeURIComponent(b + '\n\n' + n + ' (' + m + ')')}`;
    }
  }

  return (
    <section className="sec" id="ct"><div className="wrap cgrid">
      <div>
        <h2 className="t rv">Let’s work together</h2>
        <p className="sub rv">I’m looking for a Full Stack Developer role. Send a message, or grab my CV.</p>
        <div className="rv">
          <a className="btn fill" data-mag href="/Amal-Johnson-CV.pdf" download>Download CV</a>
          <a className="btn" data-mag href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
          <a className="btn" data-mag href="https://github.com/amaljohnzn" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="btn" data-mag href="https://linkedin.com/in/amaljonzn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
      <form id="cf" className="rv" onSubmit={submit} noValidate>
        <div className="fld"><input id="fn" placeholder=" " autoComplete="name" value={f.name} onChange={set('name')} /><label htmlFor="fn">Your name</label></div>
        <div className="fld"><input id="fe" type="email" placeholder=" " autoComplete="email" value={f.email} onChange={set('email')} /><label htmlFor="fe">Your email</label></div>
        <div className="fld"><textarea id="fm" rows="5" placeholder=" " value={f.msg} onChange={set('msg')}></textarea><label htmlFor="fm">Message</label></div>
        <button className="btn fill" data-mag type="submit">Send message</button>
        <a className="btn" data-mag href="/Amal-Johnson-CV.pdf" download>Download CV</a>
        <p className="ok" id="ok" role="status">{ok}</p>
      </form>
    </div></section>
  );
}

export function Footer() {
  return <footer>© {new Date().getFullYear()} Amal Johnson · Built with three.js</footer>;
}
