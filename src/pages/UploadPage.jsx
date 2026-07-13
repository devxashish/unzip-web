import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useUpload from '../hooks/useUpload'
import useExtractor from '../hooks/useExtractor'
import FileBrowser from '../components/FileBrowser'
import '../components/FileBrowser.css'
import './UploadPage.css'

const LOGO_URL = 'https://i.ibb.co/DPVCN452/file-00000000eccc7208ad23c060c309106a.png'

export default function UploadPage() {
  return (
    <div className="upload-page">
      <div className="upload-page__bg">
        <div className="upload-page__glow upload-page__glow--1" />
        <div className="upload-page__glow upload-page__glow--2" />
        <div className="upload-page__grid" />
      </div>
      <UploadHeader />
      <UploadContent />
    </div>
  )
}

function UploadHeader() {
  return (
    <header className="upload-header">
      <div className="upload-header__inner container">
        <Link to="/" className="upload-header__logo">
          <img src={LOGO_URL} alt="UnZip Web" height="36" />
        </Link>
        <Link to="/" className="btn-secondary upload-header__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
      </div>
    </header>
  )
}

function UploadContent() {
  const {
    uploads,
    addFiles,
    retryUpload,
    cancelUpload,
    cancelAll,
    retryFailed,
    removeCompleted,
    removeUpload,
    clearQueue,
    STATUS,
  } = useUpload()

  const { extractions, extractZip, removeExtraction } = useExtractor()
  const extractedIds = useRef(new Set())

  // Auto-extract when upload completes
  useEffect(() => {
    for (const upload of uploads) {
      if (upload.status === STATUS.COMPLETED && !extractedIds.current.has(upload.id)) {
        extractedIds.current.add(upload.id)
        extractZip(upload.id, upload.file)
      }
    }
  }, [uploads, STATUS, extractZip])

  return (
    <main className="upload-main container">
      <div className="upload-main__header">
        <span className="section-label">Upload</span>
        <h1 className="upload-main__title">
          Upload your <span className="gradient-text">ZIP files</span>
        </h1>
        <p className="upload-main__desc">
          Drag & drop or select ZIP files to begin extraction. Upload multiple files simultaneously.
        </p>
      </div>

      <UploadZone onFiles={addFiles} />

      {uploads.length > 0 && (
        <div className="upload-queue">
          <QueueControls
            uploads={uploads}
            onRetryFailed={retryFailed}
            onCancelAll={cancelAll}
            onRemoveCompleted={removeCompleted}
            onClearQueue={() => { clearQueue(); extractedIds.current.clear() }}
            STATUS={STATUS}
          />
          <div className="upload-queue__list">
            {uploads.map(upload => (
              <div key={upload.id}>
                <UploadCard
                  upload={upload}
                  onRetry={retryUpload}
                  onCancel={cancelUpload}
                  onRemove={(id) => { removeUpload(id); removeExtraction(id); extractedIds.current.delete(id) }}
                  STATUS={STATUS}
                />
                {/* Show extraction status / file browser */}
                <ExtractionView
                  uploadId={upload.id}
                  extraction={extractions.get(upload.id)}
                  onClose={() => removeExtraction(upload.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

function ExtractionView({ uploadId, extraction, onClose }) {
  if (!extraction) return null

  if (extraction.status === 'extracting') {
    return (
      <div className="fbrowser fbrowser--extracting">
        <div className="fbrowser__extract-spinner">
          <svg className="fbrowser__spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        </div>
        <p className="fbrowser__extract-title">Extracting files...</p>
        <p className="fbrowser__extract-desc">Reading ZIP contents</p>
      </div>
    )
  }

  if (extraction.status === 'error') {
    return (
      <div className="fbrowser fbrowser--extracting">
        <div className="fbrowser__extract-spinner" style={{ background: 'rgba(255,107,107,0.1)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
        <p className="fbrowser__extract-title fbrowser__extract-error">Extraction Failed</p>
        <p className="fbrowser__extract-desc">{extraction.error}</p>
      </div>
    )
  }

  if (extraction.status === 'done' && extraction.tree) {
    return <FileBrowser extraction={extraction} onClose={onClose} />
  }

  return null
}

function UploadZone({ onFiles }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFolderDrag, setIsFolderDrag] = useState(false)
  const dragCounter = useRef(0)
  const inputRef = useRef(null)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++

    if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items)
      const hasFolder = items.some(item => item.webkitGetAsEntry?.()?.isDirectory)
      setIsFolderDrag(hasFolder)
    }
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragOver(false)
      setIsFolderDrag(false)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragOver(false)
    setIsFolderDrag(false)

    if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items)
      const hasFolder = items.some(item => item.webkitGetAsEntry?.()?.isDirectory)
      if (hasFolder) return
    }

    const files = Array.from(e.dataTransfer.files)
    if (files.length) onFiles(files)
  }, [onFiles])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    if (files.length) onFiles(files)
    e.target.value = ''
  }, [onFiles])

  useEffect(() => {
    function handlePaste(e) {
      const files = Array.from(e.clipboardData?.files || [])
      if (files.length) onFiles(files)
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [onFiles])

  return (
    <div
      className={`upload-zone ${isDragOver ? 'upload-zone--active' : ''} ${isFolderDrag ? 'upload-zone--folder' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        multiple
        className="upload-zone__input"
        onChange={handleInputChange}
      />

      <div className="upload-zone__particles">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`upload-zone__particle upload-zone__particle--${i + 1}`} />
        ))}
      </div>

      <div className="upload-zone__border" />

      <div className="upload-zone__content">
        {isFolderDrag ? (
          <>
            <div className="upload-zone__icon upload-zone__icon--warning">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 className="upload-zone__title">Folders Not Supported</h3>
            <p className="upload-zone__desc">Please select individual ZIP files instead of folders.</p>
          </>
        ) : isDragOver ? (
          <>
            <div className="upload-zone__icon upload-zone__icon--drop">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h3 className="upload-zone__title">Drop to Upload</h3>
            <p className="upload-zone__desc">Release to start uploading your ZIP files.</p>
          </>
        ) : (
          <>
            <div className="upload-zone__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <h3 className="upload-zone__title">Drag & Drop ZIP Files</h3>
            <p className="upload-zone__desc">
              or <span className="upload-zone__link">click to browse</span> your files
            </p>
            <div className="upload-zone__hints">
              <span className="upload-zone__hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Multiple files
              </span>
              <span className="upload-zone__hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Auto-extract
              </span>
              <span className="upload-zone__hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Paste supported
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function QueueControls({ uploads, onRetryFailed, onCancelAll, onRemoveCompleted, onClearQueue, STATUS }) {
  const hasFailed = uploads.some(u => u.status === STATUS.FAILED)
  const hasActive = uploads.some(u => [STATUS.UPLOADING, STATUS.PREPARING, STATUS.WAITING].includes(u.status))
  const hasCompleted = uploads.some(u => u.status === STATUS.COMPLETED)

  return (
    <div className="queue-controls">
      <span className="queue-controls__count">
        {uploads.length} file{uploads.length !== 1 ? 's' : ''} in queue
      </span>
      <div className="queue-controls__actions">
        {hasFailed && (
          <button className="queue-btn queue-btn--retry" onClick={onRetryFailed}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
            </svg>
            Retry Failed
          </button>
        )}
        {hasActive && (
          <button className="queue-btn queue-btn--cancel" onClick={onCancelAll}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            </svg>
            Cancel All
          </button>
        )}
        {hasCompleted && (
          <button className="queue-btn" onClick={onRemoveCompleted}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Remove Completed
          </button>
        )}
        <button className="queue-btn queue-btn--clear" onClick={onClearQueue}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
          Clear Queue
        </button>
      </div>
    </div>
  )
}

function UploadCard({ upload, onRetry, onCancel, onRemove, STATUS }) {
  const { id, fileName, fileSize, status, progress, uploadedBytes, speed, remainingTime, error } = upload

  const statusConfig = {
    [STATUS.WAITING]: { label: 'Waiting...', color: 'var(--text-tertiary)', icon: 'clock' },
    [STATUS.PREPARING]: { label: 'Preparing...', color: 'var(--primary)', icon: 'loader' },
    [STATUS.UPLOADING]: { label: 'Uploading...', color: 'var(--primary)', icon: 'upload' },
    [STATUS.PROCESSING]: { label: 'Processing...', color: '#4ecdc4', icon: 'loader' },
    [STATUS.COMPLETED]: { label: 'Completed — Extracting...', color: '#4ecdc4', icon: 'check' },
    [STATUS.FAILED]: { label: 'Upload Failed', color: '#ff6b6b', icon: 'x' },
    [STATUS.RETRYING]: { label: 'Retrying...', color: '#ffd93d', icon: 'loader' },
    [STATUS.CANCELLED]: { label: 'Cancelled', color: 'var(--text-tertiary)', icon: 'x' },
    [STATUS.PAUSED]: { label: 'Paused', color: '#ffd93d', icon: 'pause' },
  }

  const cfg = statusConfig[status] || statusConfig[STATUS.WAITING]

  return (
    <div className={`upload-card upload-card--${status}`}>
      <div className="upload-card__icon-wrap" style={{ '--status-color': cfg.color }}>
        <StatusIcon type={cfg.icon} />
      </div>

      <div className="upload-card__info">
        <div className="upload-card__top">
          <span className="upload-card__name" title={fileName}>{fileName}</span>
          <span className="upload-card__size">{formatBytes(fileSize)}</span>
        </div>

        <div className="upload-card__status-row">
          <span className="upload-card__status" style={{ color: cfg.color }}>{cfg.label}</span>
          {status === STATUS.UPLOADING && (
            <div className="upload-card__meta">
              <span>{formatBytes(uploadedBytes)} / {formatBytes(fileSize)}</span>
              <span className="upload-card__meta-sep">|</span>
              <span>{formatSpeed(speed)}</span>
              <span className="upload-card__meta-sep">|</span>
              <span>{formatTime(remainingTime)}</span>
            </div>
          )}
        </div>

        {(status === STATUS.UPLOADING || status === STATUS.RETRYING || status === STATUS.PREPARING || status === STATUS.PROCESSING) && (
          <div className="upload-card__progress-wrap">
            <div className="upload-card__progress-bg">
              <div
                className={`upload-card__progress-fill ${status === STATUS.PROCESSING ? 'upload-card__progress-fill--shimmer' : ''}`}
                style={{ width: `${Math.min(progress, 100)}%`, background: cfg.color }}
              />
            </div>
            <span className="upload-card__percent">{Math.round(progress)}%</span>
          </div>
        )}

        {status === STATUS.COMPLETED && (
          <div className="upload-card__progress-wrap">
            <div className="upload-card__progress-bg">
              <div className="upload-card__progress-fill" style={{ width: '100%', background: cfg.color }} />
            </div>
            <span className="upload-card__percent">100%</span>
          </div>
        )}

        {error && <p className="upload-card__error">{error}</p>}
      </div>

      <div className="upload-card__actions">
        {(status === STATUS.FAILED || status === STATUS.CANCELLED) && (
          <button className="upload-card__btn upload-card__btn--retry" onClick={() => onRetry(id)} title="Retry">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
            </svg>
          </button>
        )}
        {[STATUS.UPLOADING, STATUS.PREPARING, STATUS.WAITING].includes(status) && (
          <button className="upload-card__btn upload-card__btn--cancel" onClick={() => onCancel(id)} title="Cancel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        <button className="upload-card__btn upload-card__btn--remove" onClick={() => onRemove(id)} title="Remove">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

function StatusIcon({ type }) {
  if (type === 'clock') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
  if (type === 'loader') return (
    <svg className="upload-card__spinner" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  )
  if (type === 'upload') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
    </svg>
  )
  if (type === 'check') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
  if (type === 'x') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
  if (type === 'pause') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
  )
  return null
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(i > 1 ? 1 : 0)} ${sizes[i]}`
}

function formatSpeed(bytesPerSec) {
  if (bytesPerSec === 0) return '—'
  return `${formatBytes(bytesPerSec)}/s`
}

function formatTime(seconds) {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) return '—'
  if (seconds < 60) return `${Math.ceil(seconds)}s remaining`
  const m = Math.floor(seconds / 60)
  const s = Math.ceil(seconds % 60)
  return `${m}m ${s < 10 ? '0' : ''}${s}s remaining`
}
