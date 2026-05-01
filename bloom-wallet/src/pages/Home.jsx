import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroCanvas from '../components/HeroCanvas'
import PhoneMockup from '../components/PhoneMockup'
import { useScrollReveal } from '../hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

const HOW_STEPS = [
  { n:'01', icon:'🧬', title:'Scan your biometric', desc:'Face ID or fingerprint. Your biometric data never leaves the device — OS-level WebAuthn handles everything.' },
  { n:'02', icon:'🔑', title:'Wallet generated on-device', desc:"Solana keypair created locally. Private key split into 3 shares via Shamir's Secret Sharing. 2-of-3 to sign." },
  { n:'03', icon:'⚡', title:'Sign with your face', desc:'Every transaction requires biometric confirmation. Key reconstructed in RAM, wiped instantly after signing.' },
  { n:'04', icon:'💀', title:'Set your Digital Will', desc:'Configure beneficiaries and inactivity timer. Go dark — your assets auto-transfer on Solana. Permissionless.' },
]

const VIZ = [
  { icon:'🧬', title:'Biometric Auth', desc:'Device-level security. Your face never leaves your device.' },
  { icon:'🔐', title:'Key Splitting', desc:'3 shares. 2 needed. 1 biometric-locked, 1 you save, 1 on-chain future.' },
  { icon:'⚡', title:'Zero-exposure Signing', desc:'Key in RAM for milliseconds. Signed. Wiped. Gone.' },
  { icon:'📜', title:'On-chain Will', desc:'Permissionless execution. No lawyer. No middleman. Just Solana.' },
]

const BENTO = [
  { icon:'ri-message-3-line', title:'Chain Message', desc:'Secure, on-chain messaging. Directly linked to biometric id.', cls:'' },
  { icon:'ri-shadow-line', title:'Cram Shadows', desc:'Soft, sane depth. Physics-based 3D tracking (no neon glows).', cls:'' },
  { icon:'ri-file-user-line', title:'Digital Will', desc:'Permissionless assets auto-transfer. First on Solana.', cls:'' },
  { icon:'ri-layout-grid-fill', title:'Bento Features', desc:'Integrated data overview. Clean depth and minimal accents.', cls:'' },
]

const WILL_STEPS = [
  { t:'You set up your will', d:'Choose beneficiaries and inactivity period (e.g. 365 days)', on:true },
  { t:'Check in regularly', d:'One tap — biometric — to prove you\'re alive. Resets countdown.', on:true },
  { t:'Inactivity detected', d:'No check-in after the period. Will becomes executable by anyone.', on:true },
  { t:'Assets auto-transfer', d:'Permissionless execution on Solana. Split to beneficiaries instantly.', on:false },
]

const SEC = [
  { i:'ri-fingerprint-line', t:'Biometric-gated storage', d:'Share 1 requires face/fingerprint. Hardware secure enclave.' },
  { i:'ri-shield-keyhole-line', t:'Key never persisted whole', d:'Private key only in RAM during signing. Wiped immediately.' },
  { i:'ri-server-line', t:'No centralized server', d:'No Zengo-style MPC server. Fully trustless.' },
  { i:'ri-code-box-line', t:'Open source', d:'All code auditable. No black boxes, no hidden logic.' },
  { i:'ri-time-line', t:'Time-locked on-chain', d:'Will execution enforced by Solana program. Unbypassable.' },
  { i:'ri-lock-password-line', t:"Shamir's Secret Sharing", d:'2-of-3 threshold. Lose one share — still safe.' },
]

const MARQUEE_ITEMS = [
  'No Seed Phrase', 'Biometric Wallet', 'Digital Will', 'Solana', 'Non-Custodial',
  'Shamir SSS', 'Steel Program', 'Chrome Extension', 'React Native', 'Devnet Ready',
]

export default function Home() {
  const [activeViz, setActiveViz] = useState(0)
  const heroRef = useRef(null)
  const phoneContainerRef = useRef(null);
  useScrollReveal()

  // SKEW LIGHT Reveal Entrance (Hero + Bento + Phone)
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 })
    
    // The main headline "Your Wallet. Your Face." unrolls
    tl.fromTo('.hero-h1', 
      { opacity: 0, y: 80, skewY: 7 }, 
      { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' })
    .fromTo('.hero-desc', 
      { opacity: 0, y: 40, skewY: 3 }, 
      { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power4.out' }, '-=0.9')
    .fromTo('.hero-btns', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    // Stats and Marquee appear together
    .fromTo(['.stats-integrate', '.marquee-wrap'], 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    // The central structure: Left bento + central phone + Right description
    .fromTo(['.bento-overview-col'], 
      { opacity: 0, y: 60, skewY: 4 }, 
      {
        opacity: 1, y: 0, skewY: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out',
        scrollTrigger: { trigger: '.bento-overview', start: 'top 85%' }
      })
    .fromTo('.phone-scene', 
      { opacity: 0, scale: 0.9, y: 100 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'expo.out' }, '-=0.8')
      
    return () => tl.kill()
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <div className="hero" ref={heroRef} style={{ background: '#FAF9F6' }}>
        <HeroCanvas />
        
        {/* Nav is integrated here for perspective alignment */}
        <nav className="nav stuck" style={{ position: 'absolute', inset: '0 0 auto', padding: '0 56px', height: '72px' }}>
          <Link to="/" className="nav-logo" style={{ color: '#111' }}>Bloom Wallet</Link>
          <ul className="nav-links" style={{ gap: '40px' }}>
            <li><a href="/#features" style={{ color: '#666' }}>Features</a></li>
            <li><a href="/#integration" style={{ color: '#666' }}>Integration</a></li>
            <li><a href="/#pricing" style={{ color: '#666' }}>Pricing</a></li>
            <li><a href="/#about" style={{ color: '#666' }}>About us</a></li>
            <li><a href="/#contact" style={{ color: '#666' }}>Contact</a></li>
          </ul>
          <div className="nav-right">
            <button className="btn-outline" style={{ border: 'none', background: 'none', color: '#111' }}>Login</button>
            <button className="btn-glow" style={{ background: '#111', color: '#fff' }}>Learn your free</button>
          </div>
        </nav>

        <div className="hero-inner" style={{ padding: '140px 24px', textAlign: 'left', margin: '0 auto', maxWidth: '1280px', display: 'flex', gap: '80px', alignItems: 'center' }}>
          {/* Main Integrated Layout Group (desc + phone + left bento) */}
          <div style={{ flex: '1' }}>
            <h1 className="hero-h1" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(56px, 9vw, 128px)', fontWeight: '800', lineHeight: '0.92', letterSpacing: '-4px', color: '#111' }}>
              Your Wallet.<br /><em style={{ color: '#059669' }}>Your Face.</em>
            </h1>
            <p className="hero-desc" style={{ color: '#666', fontSize: 'clamp(16px, 1.8vw, 20px)', maxWidth: '540px', margin: '20px 0 48px', lineHeight: '1.75' }}>
              Bloom a solana seedless biometric wallet with on-chain digital will. No seed phrase. No centralized server. Just you — and your legacy.
            </p>
            <div className="hero-btns" style={{ display: 'flex', gap: '14px' }}>
              <Link to="/download">
                <button className="btn-glow" style={{ background: '#111', color: '#fff', fontSize: '15px' }}>
                  Start Your Wallet
                </button>
              </Link>
              <button className="btn-outline" style={{ border: 'none', background: 'none', color: '#111', textDecoration: 'underline' }}>
                Elom Startovy
              </button>
            </div>
          </div>

          {/* Central Large 3D Phone Mockup (Tracks Mouse) */}
          <div ref={phoneContainerRef} style={{ flex: '0 0 450px', position: 'relative' }}>
            <PhoneMockup />
          </div>
        </div>
      </div>

      {/* ── CENTRAL STRUCTURE OVERVIEW (Bento Left + Description Right) ── */}
      <section className="bento-overview" id="features" style={{ padding: '80px 56px', maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
        
        {/* Left Bento Flank */}
        <div className="bento-overview-col" style={{ flex: '0 0 320px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {BENTO.map((b, i) => (
            <div key={i} className={`bento-card ${b.cls}`} style={{ background: '#fff', border: '1px solid #E8E6DF', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)' }}>
              <div className="bento-icon" style={{ background: 'rgba(5,150,105,0.07)', color: '#059669', fontSize: '24px', marginBottom: '24px' }}><i className={b.icon} /></div>
              <div className="bento-t" style={{ fontWeight: '800', fontSize: '20px', color: '#111' }}>{b.title}</div>
              <div className="bento-d" style={{ color: '#666', fontSize: '14px' }}>{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Right Description Text Flank */}
        <div style={{ flex: '1', textAlign: 'left' }}>
          <div className="tag" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669' }}>Cram Shadows</div>
          <h2 className="h2" style={{ fontFamily: "'Syne', sans-serif", fontSize: '48px', fontWeight: '800', color: '#111' }}>Soft, sane <em style={{ color: '#059669' }}>drop shadows (no neon).</em></h2>
          <p className="sub" style={{ color: '#666', fontSize: '18px', marginTop: '16px' }}>Ensamblement and non-icons. Light track character icons. soft, sane depth. No hacker neon glow. Institutional-grade trust.</p>
        </div>
      </section>

      {/* ── Integrated Stats and Marquee ── */}
      <div className="stats-marquee-wrap" style={{ borderTop: '1px solid #E8E6DF', borderBottom: '1px solid #E8E6DF', padding: '18px 0', background: 'rgba(5,150,105,0.02)' }}>
        <div className="marquee-wrap" style={{ overflow: 'hidden' }}>
          <div className="marquee-track" style={{ display: 'flex', gap: '40px', color: '#666', animation: 'marquee 20s linear infinite', whiteSpace: 'nowrap' }}>
            Marquee text • Solana seedless biometric wallet with on-chain digital will • Enemite and content • Bloan mode.
            Marquee text • Solana seedless biometric wallet with on-chain digital will • Enemite and content • Bloan mode.
          </div>
        </div>
        
        {/* Integrated Stats Row from image_1.png */}
        <div className="stats-integrate" style={{ margin: '40px auto 0', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', color: '#111', textAlign: 'left' }}>
          {[
            { n: '12.4820 SOL', l: 'Total balance' },
            { n: '63K', l: 'Avg sol weelis' },
            { n: '830M', l: 'Consumets' },
            { n: '238', l: 'Miillon stats' },
            { n: '30minitors', l: 'Total amount' },
          ].map(s => (
            <div key={s.l}>
              <div className="stat-n" style={{ fontWeight: '800', fontSize: '24px' }}>{s.n}</div>
              <div className="stat-l" style={{ color: '#666', fontSize: '14px' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The original How, Digital Will, Security sections remain as structured logic, adapted to the new aesthetic */}

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how">
        <div className="sr">
          <div className="tag">How it works</div>
          <h2 className="h2">Simple as <em>your face.</em></h2>
        </div>
        <div className="how-grid">
          <div className="steps-list">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="step-item sr" onMouseEnter={() => setActiveViz(i)}>
                <span className="step-n">{s.n}</span>
                <div>
                  <div className="step-t">{s.icon} {s.title}</div>
                  <div className="step-d">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="how-viz sr">
            <span className="viz-tag">LIVE PREVIEW</span>
            <span className="viz-icon">{VIZ[activeViz].icon}</span>
            <div className="viz-title">{VIZ[activeViz].title}</div>
            <div className="viz-desc">{VIZ[activeViz].desc}</div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-sec" style={{ background: '#FAF9F6' }}>
        <div className="sr">
          <h2 className="cta-h" style={{ color: '#111' }}>Ready to<br /><em style={{ color: '#059669' }}>bloom?</em></h2>
          <p className="sub" style={{margin:'20px auto 48px', textAlign:'center', color: '#666'}}>Join the waitlist. Be first to protect your legacy on Solana.</p>
          <div className="hero-btns" style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <button className="btn-glow" style={{fontSize:17,padding:'18px 44px', background: '#111', color: '#fff'}}>
              <i className="ri-seedling-line" /> Join Waitlist
            </button>
            <Link to="/download">
              <button className="btn-outline" style={{fontSize:17,padding:'18px 44px', border: '1px solid #111', color: '#111'}}>
                <i className="ri-download-line" /> Get the App
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#fff', borderTop: '1px solid #E8E6DF', color: '#111' }}>
        <div>
          <div className="footer-logo">Bloom Wallet</div>
          <div className="footer-badge" style={{ color: '#059669' }}><i className="ri-checkbox-circle-fill" /> Built on Solana</div>
        </div>
        <div className="footer-links">
          <Link to="/" style={{color:'#666',textDecoration:'none'}}>Wallet</Link>
          <a href="#" style={{color:'#666',textDecoration:'none'}}>Features</a>
          <a href="#" style={{color:'#666',textDecoration:'none'}}>Integration</a>
          <a href="#" style={{color:'#666',textDecoration:'none'}}>Pricing</a>
          <a href="#" style={{color:'#666',textDecoration:'none'}}>About us</a>
          <a href="#" style={{color:'#666',textDecoration:'none'}}>Contact</a>
          <button className="btn-glow" style={{ background: '#111', color: '#fff' }}>Learn your free</button>
          <Link to="#" style={{color:'#666',textDecoration:'none'}}>Login</Link>
        </div>
        <div className="footer-copy" style={{ color: '#666' }}>
          © 2025 Bloom Wallet<br />
          Colosseum Frontier Hackathon
        </div>
      </footer>
    </>
  )
}