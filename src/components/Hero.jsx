import { useTyping } from '../hooks/useTyping';
import { DATA, ROLES } from '../data';
import heroUrl from '../assets/hero.jpg';

export default function Hero() {
  const typed = useTyping(ROLES);
  return (
    <section className="hero" id="top">
      <div className="ph">
        <img className="ghost g2" alt="" src={heroUrl} />
        <img className="ghost g1" alt="" src={heroUrl} />
        <img className="main" alt="Portrait of the developer in a brown suit holding a coffee cup" src={heroUrl} />
      </div>
      <div className="hero-copy">
        <h1 id="hn">{DATA.name}</h1>
        <p id="ht">
          <b className="typed" style={{ display: 'block', fontSize: '1.3em', color: 'var(--suit)', minHeight: '1.4em' }}>{typed}</b>
          <span>{DATA.tagline}</span>
        </p>
        <p className="live"><span></span>Available for work</p>
      </div>
      <a className="cue" href="#stage"><i></i>Scroll down</a>
       
    </section>
    
  );
}
