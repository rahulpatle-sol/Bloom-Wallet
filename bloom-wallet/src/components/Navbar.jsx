import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [stuck, setStuck] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`nav ${stuck ? 'stuck' : ''}`}>
      <Link to="/" className="nav-logo">
        <span className="nav-logo-dot" />
        Bloom
      </Link>
      <ul className="nav-links">
        <li><a href="/#how">How it works</a></li>
        <li><a href="/#features">Features</a></li>
        <li><a href="/#will">Digital Will</a></li>
        <li><a href="/#security">Security</a></li>
      </ul>
      <div className="nav-right">
        <Link to="/download"><button className="nav-btn-ghost">Download</button></Link>
        <button className="nav-btn-solid">Early Access</button>
      </div>
    </nav>
  )
}
