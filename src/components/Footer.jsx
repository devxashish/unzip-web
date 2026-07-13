import { useNavigate } from 'react-router-dom'
import './Footer.css'

const LOGO_URL = 'https://i.ibb.co/DPVCN452/file-00000000eccc7208ad23c060c309106a.png'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <h2 className="section-title">
            Ready to extract?<br />
            <span className="gradient-text">Try it now — free.</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 32px' }}>
            No sign-up required. Just drag, drop, and download.
          </p>
          <div className="btn-border-wrap">
            <button className="btn-primary btn-primary--lg" onClick={() => navigate('/upload')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Upload Your First ZIP
            </button>
          </div>
        </div>

        <div className="divider" style={{ margin: '64px 0 40px' }} />

        <div className="footer__bottom">
          <div className="footer__brand">
            <img src={LOGO_URL} alt="UnZip Web" height="28" />
            <p>Extract ZIP files instantly in your browser. Fast, free, and private.</p>
          </div>
          <div className="footer__links">
            <div className="footer__col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#formats">Formats</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer__col">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer__copy">
          <p>&copy; {new Date().getFullYear()} UnZip Web. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
