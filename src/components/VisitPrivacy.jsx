import { useEffect } from 'react';
import { rememberVisit } from './utils/visits';

export default function VisitPrivacy() {
  useEffect(() => {
    rememberVisit();
    // A browser back/forward cache can retain the whole page, including an
    // in-memory login. Hide its snapshot and reload at login on restoration.
    const hidePage = () => { document.documentElement.dataset.pageHidden = 'true'; };
    const restorePage = (event) => {
      if (event.persisted) window.location.replace('/login');
      else delete document.documentElement.dataset.pageHidden;
    };
    window.addEventListener('pagehide', hidePage);
    window.addEventListener('pageshow', restorePage);
    return () => {
      window.removeEventListener('pagehide', hidePage);
      window.removeEventListener('pageshow', restorePage);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);
  return null;
}
