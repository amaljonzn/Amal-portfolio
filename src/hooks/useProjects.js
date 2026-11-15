import { useEffect, useState } from 'react';
import { PROJECT_CARDS } from '../data';

const API = import.meta.env.VITE_API_URL ?? '';

// Starts with the local cards, then swaps in projects from MongoDB when the API answers.
export function useProjects() {
  const [list, setList] = useState(PROJECT_CARDS);
  useEffect(() => {
    const ctl = new AbortController();
    fetch(`${API}/api/projects`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (Array.isArray(d) && d.length)
          setList(d.map((p) => ({ title: p.title, desc: p.desc, stack: p.stack || [], live: p.live, repo: p.repo, shot: p.shot })));
      })
      .catch(() => {});
    return () => ctl.abort();
  }, []);
  return list;
}
