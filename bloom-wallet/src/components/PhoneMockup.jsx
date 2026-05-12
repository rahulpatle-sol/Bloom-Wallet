import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function PhoneMockup() {
  const containerRef = useRef(null)
  const phoneRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !phoneRef.current) return

      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 2 - 1
      const y = ((e.clientY - top) / height) * 2 - 1

      gsap.to(phoneRef.current, {
        rotationY: x * 15,
        rotationX: -y * 15,
        transformPerspective: 1000,
        ease: "power3.out",
        duration: 1.2
      })
    }

    const handleMouseLeave = () => {
      gsap.to(phoneRef.current, {
        rotationY: -10,
        rotationX: 5,
        ease: "elastic.out(1, 0.5)",
        duration: 1.5
      })
    }

    const container = containerRef.current
    window.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    gsap.set(phoneRef.current, { rotationY: -10, rotationX: 5, transformStyle: "preserve-3d" })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="phone-scene" ref={containerRef} style={{ perspective: '1200px', padding: '40px' }}>
      <div
        className="phone-3d-wrap"
        ref={phoneRef}
        style={{
          boxShadow: '20px 40px 60px rgba(139,115,85,0.12), -10px -10px 40px rgba(255,255,255,0.9)',
          borderRadius: '40px',
          background: '#fff'
        }}
      >
        <div className="phone-shell">
          <div className="phone-screen" style={{ background: '#FEFEFE', color: '#3A3228' }}>
            <div className="p-notch" style={{ background: '#3A3228' }} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div className="p-logo" style={{ fontWeight: 700, color: '#8B7355', letterSpacing: '2px' }}>BLOOM</div>
              <span style={{fontSize:8,color:'#4A7C59',background:'rgba(74,124,89,0.1)',padding:'4px 8px',borderRadius:20,fontWeight:700, fontFamily: "'Nunito', sans-serif"}}>DEVNET</span>
            </div>
            <div className="p-bal-lbl" style={{ color: '#B5AFA6', fontFamily: "'Nunito', sans-serif" }}>Total Balance</div>
            <div className="p-bal" style={{ fontSize: '32px', fontWeight: '600', color: '#3A3228', fontFamily: "'Josefin Sans', sans-serif" }}>12.4820 <span style={{color: '#B5AFA6'}}>SOL</span></div>
            <div className="p-addr" style={{ background: '#F5F1EA', padding: '8px', borderRadius: '8px', fontSize: '12px', marginTop: '10px', border: '1px solid rgba(139,115,85,0.15)', color: '#8B7355' }}>8xKf...mPq3</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', marginBottom: '14px', marginTop: '14px' }}>
              {[
                { i: 'ri-send-plane-fill', l: 'Send' },
                { i: 'ri-qr-code-fill', l: 'Receive' },
                { i: 'ri-exchange-fill', l: 'Swap' },
              ].map(a => (
                <div key={a.l} className="p-action" style={{ background: '#F5F1EA', border: '1px solid rgba(139,115,85,0.15)' }}>
                  <span style={{fontSize:14,display:'block',marginBottom:3}}><i className={a.i} /></span>
                  <span className="p-action-l" style={{fontSize:8,color:'#B5AFA6', fontFamily: "'Nunito', sans-serif"}}>{a.l}</span>
                </div>
              ))}
            </div>

            <div className="p-will" style={{ background: 'linear-gradient(135deg, rgba(232,168,124,0.08), rgba(212,196,168,0.08))', border: '1px solid rgba(232,168,124,0.2)', borderRadius: '16px', padding: '16px', marginTop: '4px', boxShadow: '0 4px 12px rgba(139,115,85,0.05)' }}>
              <span style={{fontSize:20}}>🌿</span>
              <div style={{ marginLeft: '12px' }}>
                <span className="p-will-t" style={{ display: 'block', fontWeight: 700, fontSize: '14px', color: '#8B7355', fontFamily: "'Josefin Sans', sans-serif" }}>Digital Will · Active</span>
                <span className="p-will-s" style={{ color: '#B5AFA6', fontSize: '12px', fontFamily: "'Nunito', sans-serif" }}>328 days until execution</span>
              </div>
            </div>

            <button style={{ width: '100%', background: '#4A7C59', color: '#fff', border: 'none', padding: '16px', borderRadius: '100px', marginTop: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontSize: '14px', boxShadow: '0 4px 12px rgba(74,124,89,0.2)' }}>
              🌱 Check In — I'm Alive
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
