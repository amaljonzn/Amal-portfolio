import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Stage from './components/Stage';
import Dock from './components/Dock';
import { Marquee, Experience, Projects, Education, Skills, Contact, Footer } from './components/Sections';
import { useSiteEffects } from './hooks/useSiteEffects';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useSiteEffects();

  // loading screen: hide shortly after the page has finished loading
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t;
    const hide = () => { t = setTimeout(() => setLoaded(true), reduce ? 0 : 1200); };
    if (document.readyState === 'complete') hide();
    else addEventListener('load', hide);
    return () => { removeEventListener('load', hide); clearTimeout(t); };
  }, []);

  return (
    <>
      <div className={'load' + (loaded ? ' done' : '')} aria-hidden="true"><div><b>AJ</b><i></i></div></div>
      <Hero />
      <Stage />
      <Marquee />
      <Experience />
      <Projects />
      <Education />
      <Skills />
      <Contact />
      <Footer />
      <Dock />
      <div className="ring" id="ring"></div>
      <div className="spb"></div>
    </>
  );
}
