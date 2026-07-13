import { useInView } from '../hooks/useAnimations'
import './HowItWorks.css'

const steps = [
  {
    num: '01',
    title: 'Upload Your ZIP',
    desc: 'Drag and drop your ZIP file or click to browse. We support archives up to 10GB.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
      </svg>
    )
  },
  {
    num: '02',
    title: 'Browse Contents',
    desc: 'Explore your archive with a beautiful file explorer. Navigate folders, search files, and preview content.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    )
  },
  {
    num: '03',
    title: 'Select What You Need',
    desc: 'Pick individual files, entire folders, or any combination. Full control over what to download.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    )
  },
  {
    num: '04',
    title: 'Download',
    desc: 'Get your files instantly. Download individually, as folders, or re-packaged as a new ZIP.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    )
  }
]

export default function HowItWorks() {
  const [ref, inView] = useInView()

  return (
    <section id="how-it-works" ref={ref} className={`how-it-works ${inView ? 'how-it-works--visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">How It Works</span>
          <h2 className="section-title">
            Four simple steps to<br />
            <span className="gradient-text">extract anything</span>
          </h2>
          <p className="section-subtitle">
            No accounts, no downloads, no hassle. Just upload and go.
          </p>
        </div>
        <div className="steps">
          <div className="steps__line" />
          {steps.map((step, i) => (
            <div key={i} className="step" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="step__num-wrap">
                <div className="step__num">{step.num}</div>
                <div className="step__dot" />
              </div>
              <div className="step__icon">{step.icon}</div>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
