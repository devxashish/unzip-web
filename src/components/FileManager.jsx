import { useState } from 'react'
import { useInView } from '../hooks/useAnimations'
import './FileManager.css'

const mockFiles = [
  { name: 'Project Assets', type: 'folder', size: '2.4 GB', items: 156, modified: '2 hours ago' },
  { name: 'Design Files', type: 'folder', size: '890 MB', items: 43, modified: '1 day ago' },
  { name: 'Documents', type: 'folder', size: '124 MB', items: 28, modified: '3 days ago' },
  { name: 'hero-banner.png', type: 'image', size: '4.2 MB', modified: '2 hours ago' },
  { name: 'presentation.pdf', type: 'pdf', size: '12.8 MB', modified: '1 day ago' },
  { name: 'styles.css', type: 'code', size: '28 KB', modified: '5 hours ago' },
  { name: 'demo-video.mp4', type: 'video', size: '156 MB', modified: '2 days ago' },
  { name: 'background-music.mp3', type: 'audio', size: '8.4 MB', modified: '1 week ago' },
  { name: 'data-export.json', type: 'code', size: '2.1 MB', modified: '4 days ago' },
  { name: 'readme.md', type: 'code', size: '4 KB', modified: '1 day ago' },
]

const typeIcons = {
  folder: <svg width="18" height="18" viewBox="0 0 24 24" fill="#A068FF" stroke="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  image: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b9d" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  pdf: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="1.5"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  code: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd93d" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  video: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="1.5"><polygon points="23 7 16 12 23 17"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  audio: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff8a5c" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
}

export default function FileManager() {
  const [ref, inView] = useInView()
  const [selected, setSelected] = useState(new Set([0, 3, 6]))

  const toggleSelect = (i) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const selectedCount = selected.size
  const folderCount = [...selected].filter(i => mockFiles[i]?.type === 'folder').length
  const fileCount = selectedCount - folderCount

  return (
    <section ref={ref} className={`file-manager-section ${inView ? 'file-manager-section--visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">File Manager</span>
          <h2 className="section-title">
            A desktop-class<br />
            <span className="gradient-text">file explorer</span>
          </h2>
          <p className="section-subtitle">
            Browse, select, and download files with a beautiful, intuitive interface.
          </p>
        </div>

        <div className="fm-window">
          <div className="fm-toolbar">
            <div className="fm-toolbar__dots">
              <span /><span /><span />
            </div>
            <div className="fm-breadcrumb">
              <span className="fm-breadcrumb__item fm-breadcrumb__item--root">Project.zip</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="fm-breadcrumb__item fm-breadcrumb__item--active">Root</span>
            </div>
            <div className="fm-toolbar__search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Search files...</span>
            </div>
          </div>

          {selectedCount > 0 && (
            <div className="fm-selection-bar">
              <div className="fm-selection-info">
                <span className="fm-selection-count">{selectedCount} items selected</span>
                {folderCount > 0 && <span className="fm-selection-detail">{folderCount} folders</span>}
                {fileCount > 0 && <span className="fm-selection-detail">{fileCount} files</span>}
              </div>
              <div className="fm-selection-actions">
                <button className="fm-btn fm-btn--ghost">Select All</button>
                <button className="fm-btn fm-btn--ghost">Clear</button>
                <button className="fm-btn fm-btn--primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </button>
              </div>
            </div>
          )}

          <div className="fm-list">
            <div className="fm-list__header">
              <div className="fm-col fm-col--check" />
              <div className="fm-col fm-col--name">Name</div>
              <div className="fm-col fm-col--size">Size</div>
              <div className="fm-col fm-col--modified">Modified</div>
            </div>
            {mockFiles.map((file, i) => (
              <div
                key={i}
                className={`fm-row ${selected.has(i) ? 'fm-row--selected' : ''}`}
                onClick={() => toggleSelect(i)}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="fm-col fm-col--check">
                  <div className={`fm-checkbox ${selected.has(i) ? 'fm-checkbox--checked' : ''}`}>
                    {selected.has(i) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                </div>
                <div className="fm-col fm-col--name">
                  <div className="fm-file-icon">{typeIcons[file.type]}</div>
                  <span>{file.name}</span>
                  {file.items && <span className="fm-item-count">{file.items} items</span>}
                </div>
                <div className="fm-col fm-col--size">{file.size}</div>
                <div className="fm-col fm-col--modified">{file.modified}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
