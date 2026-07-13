import './LogoTicker.css'

const logos = [
  { name: 'Google Drive', color: '#4285F4' },
  { name: 'Dropbox', color: '#0061FF' },
  { name: 'OneDrive', color: '#0078D4' },
  { name: 'iCloud', color: '#3693F5' },
  { name: 'Box', color: '#0061D5' }
]

function LogoIcon({ name, color }) {
  const icons = {
    'Google Drive': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M8.267 14.68l-1.6 2.769H19.2l1.6-2.769H8.267zm6.933-10.32L9.067 14.6 10.667 17.369 16.8 7.13l-1.6-2.77zm-7.467 0L2 14.68l1.6 2.769L9.333 7.13 7.733 4.36z"/>
      </svg>
    ),
    'Dropbox': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M12 6.134L6.069 9.797 12 13.459l5.931-3.662L12 6.134zM6.069 14.134L12 17.797l5.931-3.663L12 10.472 6.069 14.134zM12 2L6.069 5.663 12 9.325l5.931-3.662L12 2z"/>
      </svg>
    ),
    'OneDrive': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M10.5 15.5c0-.55.45-1 1-1h6c1.1 0 2-.9 2-2s-.9-2-2-2h-.5C16.17 8.57 14.5 7 12.5 7c-1.65 0-3.08.99-3.73 2.41C7.33 9.64 6.25 10.75 6.25 12.15c0 .72.29 1.37.75 1.85-.16.14-.25.34-.25.5 0 .55.45 1 1 1h2.75z"/>
      </svg>
    ),
    'iCloud': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>
    ),
    'Box': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18l6.5 3.64v7.36L12 18.82l-6.5-3.64V7.82L12 4.18z"/>
      </svg>
    )
  }
  return icons[name] || null
}

export default function LogoTicker() {
  const repeatedLogos = [...logos, ...logos, ...logos, ...logos]

  return (
    <div className="logo-ticker">
      <div className="logo-ticker__mask">
        <div className="logo-ticker__track">
          {repeatedLogos.map((logo, i) => (
            <div key={i} className="logo-ticker__item">
              <LogoIcon name={logo.name} color={logo.color} />
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="logo-ticker__label">Works with files from any cloud storage</p>
    </div>
  )
}
