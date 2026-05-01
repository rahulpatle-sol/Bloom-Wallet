import React, { useEffect, useState } from 'react';
import { isSetup } from '../utils/wallet';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Send from './pages/Send';
import Will from './pages/Will';

export type Page = 'home' | 'send' | 'will' | 'settings';

export default function App() {
  const [ready, setReady] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    isSetup().then((done) => {
      setHasWallet(done);
      setReady(true);
    });
  }, []);

  if (!ready) return <div style={styles.center}><div style={styles.spinner} /></div>;

  if (!hasWallet) {
    return <Onboarding onComplete={() => setHasWallet(true)} />;
  }

  const nav = (p: Page) => setPage(p);

  return (
    <div style={styles.app}>
      {page === 'home' && <Home nav={nav} />}
      {page === 'send' && <Send nav={nav} />}
      {page === 'will' && <Will nav={nav} />}

      {/* Bottom nav */}
      <div style={styles.bottomNav}>
        {(['home', 'send', 'will'] as Page[]).map((p) => (
          <button
            key={p}
            onClick={() => nav(p)}
            style={{
              ...styles.navBtn,
              color: page === p ? '#A78BFA' : '#64748B',
              borderTop: page === p ? '2px solid #7C3AED' : '2px solid transparent',
            }}
          >
            {p === 'home' ? '💰' : p === 'send' ? '↗' : '💀'}
            <span style={{ fontSize: 10, marginTop: 2 }}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  spinner: { width: 32, height: 32, border: '3px solid #2D2D5E', borderTop: '3px solid #7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  bottomNav: { display: 'flex', borderTop: '1px solid #2D2D5E', backgroundColor: '#12122A', marginTop: 'auto' },
  navBtn: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 20, fontFamily: 'inherit',
  },
};
