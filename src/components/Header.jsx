import { useNavigate } from 'react-router-dom'
import { useInView } from '../hooks/useAnimations'
import './Header.css'

const LOGO_URL = 'https://i.ibb.co/DPVCN452/file-00000000eccc7208ad23c060c309106a.png'

export default function Header() {
  const [ref, inView] = useInView()
  const navigate = useNavigate()

  return (
    <header ref={ref} className={`header ${inView ? 'header--visible' : ''}`}>
      <div className="header__inner container">
        <div className="header__left">
          <a href="/" className="header__logo">
            <img src={LOGO_URL} alt="UnZip Web" height="36" />
          </a>
          <nav className="header__nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#formats">Formats</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
        <div className="header__right">
          <div className="btn-border-wrap">
            <button className="btn-primary" onClick={() => navigate('/upload')}>
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
