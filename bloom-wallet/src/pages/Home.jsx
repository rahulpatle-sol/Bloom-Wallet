import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroCanvas from '../components/HeroCanvas'
import PhoneMockup from '../components/PhoneMockup'
import { useScrollReveal } from '../hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

const HOW_STEPS = [
  { n:'01', icon:'🌿', title:'Plant your biometric', desc:'Face ID or fingerprint. Your biometric data never leaves the device — OS-level WebAuthn handles everything.' },
  { n:'02', icon:'🌱', title:'Seedless key grows', desc:"Solana keypair blooms on-device. Private key split into 3 shares via Shamir's Secret Sharing. 2-of-3 to sign." },
  { n:'03', icon:'🌸', title:'Sign with your nature', desc:'Every transaction requires biometric confirmation. Key reconstructed in RAM, wiped instantly after signing.' },
  { n:'04', icon:'🌾', title:'Set your Living Will', desc:'Choose beneficiaries and inactivity period. Go peacefully — your assets bloom onward to loved ones.' },
]

const VIZ = [
  { icon:'🌿', title:'Biometric Growth', desc:'Device-level security. Your face never leaves your device.' },
  { icon:'🔐', title:'Key Splitting', desc:'3 shares. 2 needed. 1 biometric-locked, 1 you save, 1 on-chain.' },
  { icon:'⚡', title:'Zero-exposure', desc:'Key in RAM for milliseconds. Signed. Wiped. Gone.' },
  { icon:'📜', title:'On-chain Legacy', desc:'Permissionless execution. No lawyer. No middleman. Just Solana.' },
]

const BENTO = [
  { icon:'ri-message-3-line', title:'Chain Message', desc:'Secure, on-chain messaging. Directly linked to biometric id.', cls:'' },
  { icon:'ri-leaf-line', title:'Nature First', desc:'Soft, organic depth. Physics-based 3D tracking. Like a garden.', cls:'b-sage' },
  { icon:'ri-file-user-line', title:'Living Will', desc:'Permissionless assets auto-transfer. First on Solana.', cls:'' },
  { icon:'ri-layout-grid-fill', title:'Bento View', desc:'Integrated data overview. Clean, calm, and organized.', cls:'b-rose' },
  { icon:'ri-shield-check-line', title:'Biometric Lock', desc:'Your face is the only key. Hardware secure enclave.', cls:'b-lavender' },
  { icon:'ri-global-line', title:'Solana Native', desc:'Built on Solana. Fast, cheap, and decentralized.', cls:'' },
]

const WILL_STEPS = [
  { t:'You plant your will', d:'Choose beneficiaries and inactivity period (e.g. 365 days)', on:true },
  { t:'Tend to it regularly', d:'One tap — biometric — to prove you\'re alive. Resets the cycle.', on:true },
  { t:'Season ends', d:'No check-in after the period. Will becomes harvestable by anyone.', on:true },
  { t:'Assets bloom onward', d:'Permissionless execution on Solana. Naturally split to beneficiaries.', on:false },
]

const SEC = [
  { i:'ri-fingerprint-line', t:'Biometric-gated storage', d:'Share 1 requires face/fingerprint. Hardware secure enclave.' },
  { i:'ri-shield-keyhole-line', t:'Key never persisted whole', d:'Private key only in RAM during signing. Wiped immediately.' },
  { i:'ri-server-line', t:'No centralized server', d:'No Zengo-style MPC server. Fully trustless.' },
  { i:'ri-code-box-line', t:'Open source', d:'All code auditable. No black boxes, no hidden logic.' },
  { i:'ri-time-line', t:'Time-locked on-chain', d:'Will execution enforced by Solana program. Unbypassable.' },
  { i:'ri-lock-password-line', t:"Shamir's Secret Sharing", d:'2-of-3 threshold. Lose one share — still safe.' },
]

export default function Home() {
  const [activeViz, setActiveViz] = useState(0)
  const heroRef = useRef(null)
  const phoneContainerRef = useRef(null)
  useScrollReveal()

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 })

    tl.fromTo('.hero-h1',
      { opacity: 0, y: 80, skewY: 3 },
      { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' })
    .fromTo('.hero-p',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }, '-=0.9')
    .fromTo('.hero-btns',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .fromTo('.hero-chip',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.8')
    .fromTo('.phone-scene',
      { opacity: 0, scale: 0.9, y: 100 },
      { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'expo.out' }, '-=0.8')

    return () => tl.kill()
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <div className="hero" ref={heroRef}>
        <HeroCanvas />

        <div className="hero-inner" style={{ display: 'flex', padding: '140px 56px', textAlign: 'left', margin: '0 auto', maxWidth: '1280px', gap: '80px', alignItems: 'center' }}>
          <div style={{ flex: '1' }}>
            <div className="hero-chip">
              <i className="ri-seedling-line" />
              Colosseum Frontier Hackathon
            </div>
            <h1 className="hero-h1" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, color: '#3A3228' }}>
              Your Wallet.<br /><em>Your Face.</em>
            </h1>
            <p className="hero-p">
              Bloom a seedless biometric Solana wallet with an on-chain Living Will. No seed phrase. No centralized server. Just you — and your legacy.
            </p>
            <div className="hero-btns">
              <Link to="/download">
                <button className="btn-bloom" style={{ fontSize: '15px' }}>
                  <i className="ri-seedling-line" /> Start Your Wallet
                </button>
              </Link>
              <a href="#how">
                <button className="btn-outline" style={{ fontSize: '15px' }}>
                  <i className="ri-arrow-down-line" /> See How It Works
                </button>
              </a>
            </div>
          </div>

          <div ref={phoneContainerRef} style={{ flex: '0 0 450px', position: 'relative' }}>
            <PhoneMockup />
          </div>
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {['No Seed Phrase', 'Biometric Wallet', 'Living Will', 'Solana', 'Non-Custodial', 'Shamir SSS', 'Seedless', 'Chrome Extension', 'React Native', 'Devnet Ready'].map((m, i) => (
            <span key={i} className="marquee-item">
              <i className="ri-seedling-line" /> {m}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES BENTO ── */}
      <section className="section" id="features">
        <div className="sr">
          <div className="tag">Features</div>
          <h2 className="h2">Everything you need.<br /><em>Nothing you don't.</em></h2>
          <p className="sub" style={{ marginTop: '16px' }}>A wallet that grows with you — biometric, seedless, and always in bloom.</p>
        </div>

        <div className="bento sr">
          {BENTO.map((b, i) => (
            <div key={i} className={`bento-card ${b.cls}`}>
              <div className="bento-icon"><i className={b.icon} /></div>
              <div className="bento-t">{b.title}</div>
              <div className="bento-d">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how" style={{ background: 'var(--white)' }}>
        <div className="sr">
          <div className="tag">How It Works</div>
          <h2 className="h2">Simple as <em>your nature.</em></h2>
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

      {/* ── WILL SECTION ── */}
      <section className="section" id="will">
        <div className="sr">
          <div className="tag">Living Will</div>
          <h2 className="h2">Your legacy,<br /><em>naturally.</em></h2>
          <p className="sub" style={{ marginTop: '16px' }}>Set it once. Tend to it. And let your assets bloom onward — permissionlessly on Solana.</p>
        </div>

        <div className="will-wrap sr" style={{ marginTop: '60px' }}>
          <div>
            <div className="timeline">
              {WILL_STEPS.map((s, i) => (
                <div key={i} className="tl-item">
                  <div className="tl-left">
                    <div className={`tl-dot ${s.on ? '' : 'off'}`} />
                    <div className={`tl-line ${s.on ? '' : 'off'}`} />
                  </div>
                  <div>
                    <div className="tl-t">{s.t}</div>
                    <div className="tl-d">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '120px', marginBottom: '24px' }}>🌻</div>
            <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '28px', fontWeight: 300, color: '#3A3228', marginBottom: '12px' }}>
              Plant today.
            </div>
            <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '28px', fontWeight: 300, color: '#3A3228', marginBottom: '12px' }}>
              Harvest tomorrow.
            </div>
            <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '28px', fontWeight: 300, color: '#E8A87C', fontStyle: 'italic' }}>
              Let it bloom.
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section className="section" id="security" style={{ background: 'var(--white)' }}>
        <div className="sr">
          <div className="tag">Security</div>
          <h2 className="h2">Built on <em>trust.</em></h2>
          <p className="sub" style={{ marginTop: '16px' }}>No seed phrase to lose. No server to breach. Your key is nature itself.</p>
        </div>

        <div className="sec-grid">
          {SEC.map((s, i) => (
            <div key={i} className="sec-card sr">
              <div className="sec-ic"><i className={s.i} /></div>
              <div>
                <div className="sec-t">{s.t}</div>
                <div className="sec-d">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-sec">
        <div className="cta-blur" />
        <div className="sr">
          <h2 className="cta-h">Ready to<br /><em>bloom?</em></h2>
          <p className="sub" style={{margin:'20px auto 48px', textAlign:'center', color: '#8C8278'}}>
            Join the waitlist. Be first to protect your legacy on Solana.
          </p>
          <div className="hero-btns" style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <button className="btn-bloom" style={{fontSize:17, padding:'18px 44px'}}>
              <i className="ri-notification-line" /> Join Waitlist
            </button>
            <Link to="/download">
              <button className="btn-outline" style={{fontSize:17, padding:'18px 44px'}}>
                <i className="ri-download-line" /> Get the App
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div>
          <div className="footer-logo">🌸 Bloom Wallet</div>
          <div className="footer-badge" style={{ color: '#8B7355' }}>
            <i className="ri-checkbox-circle-fill" /> Built on Solana
          </div>
        </div>
        <div className="footer-links">
          <Link to="/" style={{color:'inherit',textDecoration:'none'}}>Home</Link>
          <a href="#features" style={{color:'inherit',textDecoration:'none'}}>Features</a>
          <a href="#how" style={{color:'inherit',textDecoration:'none'}}>How</a>
          <a href="#will" style={{color:'inherit',textDecoration:'none'}}>Will</a>
          <a href="#security" style={{color:'inherit',textDecoration:'none'}}>Security</a>
          <Link to="/download" style={{color:'inherit',textDecoration:'none'}}>Download</Link>
        </div>
        <div className="footer-copy" style={{ color: '#B5AFA6' }}>
          © 2025 Bloom Wallet<br />
          Colosseum Frontier Hackathon
        </div>
      </footer>
    </>
  )
}
