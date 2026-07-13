import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTypewriter, useInView } from '../hooks/useAnimations'
import './Hero.css'

export default function Hero() {
  const [ref, inView] = useInView()
  const navigate = useNavigate()
  const { displayed, done } = useTypewriter(
    'Extract ZIP Files Instantly — Right in Your Browser',
    40,
    600
  )
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setShowCta(true), 300)
      return () => clearTimeout(t)
    }
  }, [done])

  return (
    <section id="hero" ref={ref} className={`hero ${inView ? 'hero--visible' : ''}`}>
      <div className="hero__bg">
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />
        <div className="hero__grid" />
      </div>
      <div className="hero__content container">
        <div className="hero__left">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Fast, Free & Secure
          </div>
          <h1 className="hero__title">
            <span className="hero__typed">{displayed}</span>
            {!done && <span className="hero__cursor" />}
          </h1>
          <p className="hero__desc">
            Upload any ZIP archive and browse, preview, or download files instantly.
            No installation needed. Works with archives of any size.
          </p>
          <div className={`hero__actions ${showCta ? 'hero__actions--visible' : ''}`}>
            <div className="btn-border-wrap">
              <button className="btn-primary btn-primary--lg" onClick={() => navigate('/upload')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                Upload ZIP
              </button>
            </div>
            <button className="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Try Demo
            </button>
          </div>
          <div className={`hero__stats ${showCta ? 'hero__stats--visible' : ''}`}>
            <div className="hero__stat">
              <strong>2M+</strong>
              <span>Files Extracted</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>500K+</strong>
              <span>Happy Users</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>10GB</strong>
              <span>Max File Size</span>
            </div>
          </div>
        </div>
        <div className="hero__right">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}

function HeroVisual() {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`hero-visual ${inView ? 'hero-visual--visible' : ''}`}>
      <div className="hero-visual__orbits">
        <div className="orbit orbit--1">
          <div className="orbit__ring" />
        </div>
        <div className="orbit orbit--2">
          <div className="orbit__ring" />
        </div>
        <div className="orbit orbit--3">
          <div className="orbit__ring" />
        </div>
      </div>
      <div className="hero-visual__center">
        <div className="hero-visual__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <span className="hero-visual__label">.ZIP</span>
      </div>

      <FloatingFile icon="folder" label="Folder A" className="ff--1" color="#A068FF" />
      <FloatingFile icon="image" label="photo.png" className="ff--2" color="#ff6b9d" />
      <FloatingFile icon="file" label="report.pdf" className="ff--3" color="#4ecdc4" />
      <FloatingFile icon="code" label="index.js" className="ff--4" color="#ffd93d" />
      <FloatingFile icon="video" label="demo.mp4" className="ff--5" color="#6c5ce7" />
      <FloatingFile icon="music" label="track.mp3" className="ff--6" color="#ff8a5c" />
    </div>
  )
}

function FloatingFile({ icon, label, className, color }) {
  const icons = {
    folder: <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    file: <><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></>,
    code: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    video: <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>,
    music: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>
  }

  return (
    <div className={`floating-file ${className}`} style={{ '--file-color': color }}>
      <div className="floating-file__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icons[icon]}
        </svg>
      </div>
      <span className="floating-file__label">{label}</span>
    </div>
  )
}
