import { useInView } from '../hooks/useAnimations'
import './Security.css'

const items = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Client-Side Only',
    desc: 'Your files never touch our servers. All processing happens in your browser using WebAssembly.'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    title: 'Zero Data Storage',
    desc: 'Nothing is stored, cached, or logged. Once you close the tab, all data is gone permanently.'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 12 15 22 5" opacity="0.5"/></svg>,
    title: 'No Account Required',
    desc: 'Use the full platform without signing up. No email, no tracking, no cookies for analytics.'
  }
]

export default function Security() {
  const [ref, inView] = useInView()

  return (
    <section ref={ref} className={`security ${inView ? 'security--visible' : ''}`}>
      <div className="container">
        <div className="security__inner">
          <div className="security__header">
            <span className="section-label">Security</span>
            <h2 className="section-title">
              Your files stay<br />
              <span className="gradient-text">yours. Always.</span>
            </h2>
            <p className="section-subtitle">
              Privacy isn't a feature — it's our foundation. Everything runs locally in your browser.
            </p>
          </div>
          <div className="security__items">
            {items.map((item, i) => (
              <div key={i} className="security-item" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="security-item__icon">{item.icon}</div>
                <div>
                  <h3 className="security-item__title">{item.title}</h3>
                  <p className="security-item__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
