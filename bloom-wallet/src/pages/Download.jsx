import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useScrollReveal } from '../hooks/useScrollReveal'

const DOWNLOADS = [
  {
    icon: '📱',
    title: 'Android App',
    desc: 'React Native Expo app. Biometric wallet + Digital Will on your phone.',
    badge: 'APK · Devnet',
    btnText: 'Download APK',
    btnIcon: 'ri-android-line',
    href: '#',
    status: 'coming-soon',
  },
  {
    icon: '🌐',
    title: 'Chrome Extension',
    desc: 'Browser wallet with WebAuthn biometric. No seed phrase in your browser.',
    badge: 'Devnet · Unpacked',
    btnText: 'Download ZIP',
    btnIcon: 'ri-chrome-line',
    href: '#',
    status: 'available',
  },
  {
    icon: '🍎',
    title: 'iOS App',
    desc: 'TestFlight beta coming soon. Face ID native support on iPhone.',
    badge: 'TestFlight · Soon',
    btnText: 'Join TestFlight',
    btnIcon: 'ri-apple-line',
    href: '#',
    status: 'soon',
  },
]

const STEPS = [
  { n:'01', t:'Download ZIP', d:'Click the download button for Chrome Extension below.' },
  { n:'02', t:'Open chrome://extensions', d:'Type chrome://extensions in your address bar and hit Enter.' },
  { n:'03', t:'Enable Developer Mode', d:'Toggle "Developer mode" in the top-right corner.' },
  { n:'04', t:'Load unpacked', d:'Click "Load unpacked" → select the extracted dist/ folder.' },
  { n:'05', t:'Bloom appears!', d:'Click the Bloom icon in your Chrome toolbar. Set up biometric and go.' },
]

export default function Download() {
  useScrollReveal()

  useEffect(() => {
    gsap.fromTo('.dl-card', { opacity: 0, y: 80, scale: 0.95 }, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.8, stagger: 0.15,
      ease: 'power3.out', delay: 0.3
    })
  }, [])

  return (
    <>
      <div className="dl-hero">
        {/* Background orbs */}
        <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
          <div style={{position:'absolute',top:'-10%',left:'20%',width:600,height:600,background:'radial-gradient(circle,rgba(0,255,163,0.07),transparent 70%)',borderRadius:'50%'}} />
          <div style={{position:'absolute',bottom:'0',right:'10%',width:500,height:500,background:'radial-gradient(circle,rgba(77,124,255,0.07),transparent 70%)',borderRadius:'50%'}} />
        </div>

        <div style={{position:'relative',zIndex:2,textAlign:'center',marginBottom:80}}>
          <div className="tag" style={{justifyContent:'center', marginBottom:24}}>
            <i className="ri-download-cloud-line" /> Downloads
          </div>
          <h1 className="h2" style={{fontSize:'clamp(48px,7vw,96px)',letterSpacing:'-3px',marginBottom:20}}>
            Get <em>Bloom</em>
          </h1>
          <p className="sub" style={{margin:'0 auto',textAlign:'center'}}>
            Mobile app, Chrome extension, or both. Start protecting your wallet and legacy today.
          </p>
        </div>

        {/* Download cards */}
        <div className="dl-cards" style={{position:'relative',zIndex:2}}>
          {DOWNLOADS.map((d, i) => (
            <div key={i} className="dl-card" style={{opacity:0}}>
              <span className="dl-card-icon">{d.icon}</span>
              <span className="dl-card-badge">{d.badge}</span>
              <div className="dl-card-title">{d.title}</div>
              <p className="dl-card-desc">{d.desc}</p>
              <a
                href={d.href}
                className="btn-glow"
                style={{
                  display:'inline-flex', gap:10, alignItems:'center',
                  width:'100%', justifyContent:'center',
                  opacity: d.status === 'soon' ? 0.5 : 1,
                  pointerEvents: d.status === 'soon' ? 'none' : 'auto',
                  textDecoration:'none',
                }}
              >
                <i className={d.btnIcon} /> {d.btnText}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* How to install extension */}
      <section className="section">
        <div className="sr">
          <div className="tag">Installation Guide</div>
          <h2 className="h2" style={{fontSize:'clamp(32px,4vw,56px)'}}>
            Chrome Extension<br /><em>in 5 steps</em>
          </h2>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:64}}>
          {STEPS.map((s, i) => (
            <div key={i} className={`sec-card sr`} style={{transitionDelay:i*0.08+'s', alignItems:'flex-start'}}>
              <div className="sec-ic" style={{fontFamily:'var(--font-h)',fontWeight:800,fontSize:13,color:'var(--bloom)'}}>
                {s.n}
              </div>
              <div>
                <div className="sec-t">{s.t}</div>
                <div className="sec-d">{s.d}</div>
              </div>
            </div>
          ))}
          {/* Big download btn in last slot */}
          <div className="sec-card sr" style={{background:'rgba(0,255,163,0.04)',borderColor:'rgba(0,255,163,0.15)',flexDirection:'column',alignItems:'flex-start',gap:16}}>
            <div style={{fontSize:32}}>🎉</div>
            <div className="sec-t">That's it!</div>
            <div className="sec-d">Bloom Wallet is live in your Chrome. Set up biometric, get devnet SOL, and test your Digital Will.</div>
            <a href="#" className="btn-glow" style={{textDecoration:'none', marginTop:8, width:'100%', justifyContent:'center'}}>
              <i className="ri-download-line" /> Download Extension ZIP
            </a>
          </div>
        </div>
      </section>

      {/* Mobile coming soon */}
      <div style={{textAlign:'center',padding:'80px 56px 140px'}}>
        <div className="sr">
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:32,padding:'64px',maxWidth:600,margin:'0 auto'}}>
            <div style={{fontSize:56,marginBottom:20}}>📱</div>
            <h3 style={{fontFamily:'var(--font-h)',fontSize:28,fontWeight:800,marginBottom:12}}>Android App — Coming Soon</h3>
            <p style={{color:'var(--muted)',lineHeight:1.7,marginBottom:32}}>
              We're finalizing the React Native build with full biometric integration and Digital Will support. Leave your email to get notified first.
            </p>
            <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  background:'rgba(255,255,255,0.04)',border:'1px solid var(--border)',
                  borderRadius:100,padding:'14px 24px',color:'var(--text)',
                  fontSize:14,outline:'none',minWidth:240,fontFamily:'var(--font-b)'
                }}
              />
              <button className="btn-glow">
                <i className="ri-notification-line" /> Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div>
          <div className="footer-logo">Bloom Wallet</div>
          <div className="footer-badge"><i className="ri-checkbox-circle-fill" /> Built on Solana</div>
        </div>
        <div className="footer-links">
          <Link to="/" style={{color:'inherit',textDecoration:'none'}}>Home</Link>
          <a href="#">GitHub</a>
          <a href="#">Twitter</a>
          <a href="#">Discord</a>
        </div>
        <div className="footer-copy">© 2025 Bloom Wallet · Colosseum Frontier</div>
      </footer>
    </>
  )
}
