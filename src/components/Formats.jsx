import { useInView } from '../hooks/useAnimations'
import './Formats.css'

const categories = [
  {
    name: 'Images',
    color: '#ff6b9d',
    formats: ['PNG', 'JPG', 'GIF', 'SVG', 'WEBP', 'ICO', 'BMP'],
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  },
  {
    name: 'Videos',
    color: '#6c5ce7',
    formats: ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM'],
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
  },
  {
    name: 'Audio',
    color: '#ff8a5c',
    formats: ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC'],
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  },
  {
    name: 'Documents',
    color: '#4ecdc4',
    formats: ['PDF', 'DOC', 'DOCX', 'TXT', 'RTF', 'CSV', 'XLS'],
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
  },
  {
    name: 'Code',
    color: '#ffd93d',
    formats: ['JS', 'TS', 'PY', 'HTML', 'CSS', 'JSON', 'MD'],
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  },
  {
    name: 'Archives',
    color: '#A068FF',
    formats: ['ZIP', 'RAR', '7Z', 'TAR', 'GZ', 'BZ2'],
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
  }
]

export default function Formats() {
  const [ref, inView] = useInView()

  return (
    <section id="formats" ref={ref} className={`formats ${inView ? 'formats--visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Supported Formats</span>
          <h2 className="section-title">
            Preview and extract<br />
            <span className="gradient-text">any file type</span>
          </h2>
          <p className="section-subtitle">
            Built-in viewers for images, videos, audio, documents, code, and more.
          </p>
        </div>
        <div className="formats__grid">
          {categories.map((cat, i) => (
            <div key={i} className="format-card" style={{ animationDelay: `${i * 0.1}s`, '--cat-color': cat.color }}>
              <div className="format-card__header">
                <div className="format-card__icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
              </div>
              <div className="format-card__tags">
                {cat.formats.map((f, j) => (
                  <span key={j} className="format-tag">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
