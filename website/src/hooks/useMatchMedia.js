import { useState, useEffect } from 'react';

/**
 * SSR-safe matchMedia: defaults to false until the client runs the query.
 * @param {string} query - e.g. '(max-width: 1100px)'
 */
export function useMatchMedia(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
