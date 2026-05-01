import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function PhoneMockup() {
  const containerRef = useRef(null)
  const phoneRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !phoneRef.current) return
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      // Calculate cursor position relative to the center of the component (-1 to 1)
      const x = ((e.clientX - left) / width) * 2 - 1
      const y = ((e.clientY - top) / height) * 2 - 1

      // Premium 3D tilt logic (limit rotation to ~15 degrees)
      gsap.to(phoneRef.current, {
        rotationY: x * 15,
        rotationX: -y * 15,
        transformPerspective: 1000,
        ease: "power3.out",
        duration: 1.2
      })
    }

    const handleMouseLeave = () => {
      // Snap back to original position gently
      gsap.to(phoneRef.current, {
        rotationY: -10, // Default slight isometric angle
        rotationX: 5,
        ease: "elastic.out(1, 0.5)",
        duration: 1.5
      })
    }

    const container = containerRef.current
    window.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Initial setup state
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
          boxShadow: '20px 40px 60px rgba(0,0,0,0.08), -10px -10px 40px rgba(255,255,255,0.8)',
          borderRadius: '40px',
          background: '#ffffff'
        }}
      >
        <div className="phone-shell">
          <div className="phone-screen" style={{ background: '#FAF9F6', color: '#111' }}>
            <div className="p-notch" style={{ background: '#111' }} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div className="p-logo" style={{ fontWeight: 800 }}>BLOOM</div>
              <span style={{fontSize:8,color:'#059669',background:'rgba(5,150,105,0.1)',padding:'4px 8px',borderRadius:20,fontWeight:700}}>DEVNET</span>
            </div>
            <div className="p-bal-lbl" style={{ color: '#666' }}>Total Balance</div>
            <div className="p-bal" style={{ fontSize: '32px', fontWeight: '800' }}>12.4820 <span style={{color: '#888'}}>SOL</span></div>
            <div className="p-addr" style={{ background: '#F0EFEB', padding: '8px', borderRadius: '8px', fontSize: '12px', marginTop: '10px' }}>8xKf...mPq3 ⎘ Copy</div>
            
            <div className="p-will" style={{ background: '#ffffff', border: '1px solid #E5E5E5', borderRadius: '16px', padding: '16px', marginTop: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <span style={{fontSize:20}}>💀</span>
              <div style={{ marginLeft: '12px' }}>
                <span className="p-will-t" style={{ display: 'block', fontWeight: 700, fontSize: '14px' }}>Digital Will · Active</span>
                <span className="p-will-s" style={{ color: '#666', fontSize: '12px' }}>328 days until execution</span>
              </div>
            </div>
            
            <button style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '16px', borderRadius: '100px', marginTop: '24px', fontWeight: 600, cursor: 'pointer' }}>
              💓 Check In — I'm Alive
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}