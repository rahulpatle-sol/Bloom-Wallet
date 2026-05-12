import React, { useEffect, useState } from 'react';
import { isSetup } from '../utils/wallet';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Send from './pages/Send';
import Will from './pages/Will';
import Settings from './pages/Settings';

export type Page = 'home' | 'send' | 'will' | 'settings';

const C = {
  bg: '#010101', card: '#12121C', cardAlt: '#1A1A2E',
  border: '#2A2A40', primary: '#AB9FF2', primaryDark: '#5548D0',
  text: '#E8E8F0', muted: '#8888A8', accent: '#4ADE80',
  danger: '#F87171', warning: '#FBBF24', bloom: '#E8A87C',
};

export { C };

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

  if (!ready) {
    return (
      <div style={{ ...styles.center, backgroundColor: C.bg }}>
        <div style={{ ...styles.spinner, borderTopColor: C.primary }} />
      </div>
    );
  }

  if (!hasWallet) {
    return <Onboarding onComplete={() => setHasWallet(true)} />;
  }

  const nav = (p: Page) => setPage(p);

  return (
    <div style={{ ...styles.app, backgroundColor: C.bg }}>
      {page === 'home' && <Home nav={nav} />}
      {page === 'send' && <Send nav={nav} />}
      {page === 'will' && <Will nav={nav} />}
      {page === 'settings' && <Settings nav={nav} />}

      <div style={{ ...styles.bottomNav, borderTop: `1px solid ${C.border}` }}>
        {(['home', 'send', 'will', 'settings'] as Page[]).map((p) => {
          const icons: Record<string, string> = {
            home: '💰', send: '↗', will: '💀', settings: '⚙️',
          };
          const labels: Record<string, string> = {
            home: 'Wallet', send: 'Send', will: 'Will', settings: 'Settings',
          };
          return (
            <button
              key={p}
              onClick={() => nav(p)}
              style={{
                ...styles.navBtn,
                color: page === p ? C.primary : C.muted,
                borderTop: page === p ? `2px solid ${C.primaryDark}` : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: 18 }}>{icons[p]}</span>
              <span style={{ fontSize: 9, marginTop: 2, fontWeight: 600 }}>{labels[p]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: { display: 'flex', flexDirection: 'column', minHeight: '100vh', maxWidth: 400 },
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  spinner: { width: 32, height: 32, border: '3px solid #2A2A40', borderTopColor: '#AB9FF2', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  bottomNav: { display: 'flex', backgroundColor: '#0D0D14', paddingBottom: 4, marginTop: 'auto' },
  navBtn: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'inherit',
  },
};