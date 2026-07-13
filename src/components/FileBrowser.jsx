import { useState, useCallback, useMemo } from 'react'
import JSZip from 'jszip'
import './FileBrowser.css'

export default function FileBrowser({ extraction, onClose }) {
  const { tree, fileCount, folderCount, zip, fileName } = extraction
  const [expanded, setExpanded] = useState(new Set())
  const [selected, setSelected] = useState(new Set())
  const [downloading, setDownloading] = useState(false)

  // Gather all file paths and all folder paths
  const { allFiles, allFolders } = useMemo(() => {
    const files = []
    const folders = []
    function walk(node) {
      for (const child of node.children) {
        if (child.type === 'file') files.push(child.path)
        else {
          folders.push(child.path)
          walk(child)
        }
      }
    }
    walk(tree)
    return { allFiles: files, allFolders: folders }
  }, [tree])

  // Get all file paths under a folder
  const getFilesUnder = useCallback((node) => {
    const paths = []
    function walk(n) {
      for (const c of n.children) {
        if (c.type === 'file') paths.push(c.path)
        else walk(c)
      }
    }
    walk(node)
    return paths
  }, [])

  // Find node by path
  const findNode = useCallback((path) => {
    const parts = path.split('/')
    let current = tree
    for (const part of parts) {
      const child = current.children?.find(c => c.name === part)
      if (!child) return null
      current = child
    }
    return current
  }, [tree])

  // Toggle folder expand
  const toggleExpand = useCallback((path) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  // Expand all folders
  const expandAll = useCallback(() => {
    setExpanded(new Set(allFolders))
  }, [allFolders])

  // Collapse all
  const collapseAll = useCallback(() => {
    setExpanded(new Set())
  }, [])

  // Toggle selection for a file
  const toggleFileSelect = useCallback((path) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  // Toggle selection for a folder (selects/deselects all files inside)
  const toggleFolderSelect = useCallback((node) => {
    const filesUnder = getFilesUnder(node)
    setSelected(prev => {
      const next = new Set(prev)
      const allSelected = filesUnder.every(f => next.has(f))
      if (allSelected) {
        filesUnder.forEach(f => next.delete(f))
      } else {
        filesUnder.forEach(f => next.add(f))
      }
      return next
    })
  }, [getFilesUnder])

  // Select all
  const selectAll = useCallback(() => {
    setSelected(new Set(allFiles))
  }, [allFiles])

  // Deselect all
  const deselectAll = useCallback(() => {
    setSelected(new Set())
  }, [])

  // Check if folder is fully/partially selected
  const getFolderSelectionState = useCallback((node) => {
    const filesUnder = getFilesUnder(node)
    if (filesUnder.length === 0) return 'none'
    const selectedCount = filesUnder.filter(f => selected.has(f)).length
    if (selectedCount === 0) return 'none'
    if (selectedCount === filesUnder.length) return 'all'
    return 'partial'
  }, [selected, getFilesUnder])

  // Download selected files
  const downloadSelected = useCallback(async () => {
    if (selected.size === 0 || !zip) return
    setDownloading(true)

    try {
      if (selected.size === 1) {
        const path = [...selected][0]
        const blob = await zip.file(path)?.async('blob')
        if (blob) {
          const name = path.split('/').pop()
          triggerDownload(blob, name)
        }
      } else {
        const newZip = new JSZip()
        for (const path of selected) {
          const data = await zip.file(path)?.async('uint8array')
          if (data) newZip.file(path, data)
        }
        const blob = await newZip.generateAsync({ type: 'blob' })
        const name = fileName.replace(/\.zip$/i, '') + '-selected.zip'
        triggerDownload(blob, name)
      }
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }, [selected, zip, fileName])

  // Download a single file
  const downloadFile = useCallback(async (path) => {
    if (!zip) return
    try {
      const blob = await zip.file(path)?.async('blob')
      if (blob) {
        const name = path.split('/').pop()
        triggerDownload(blob, name)
      }
    } catch (err) {
      console.error('Download failed:', err)
    }
  }, [zip])

  // Download entire folder as zip
  const downloadFolder = useCallback(async (node) => {
    if (!zip) return
    setDownloading(true)
    try {
      const newZip = new JSZip()
      const files = getFilesUnder(node)
      for (const path of files) {
        const data = await zip.file(path)?.async('uint8array')
        if (data) {
          const relativePath = path.startsWith(node.path + '/') ? path.slice(node.path.length + 1) : path
          newZip.file(relativePath, data)
        }
      }
      const blob = await newZip.generateAsync({ type: 'blob' })
      triggerDownload(blob, node.name + '.zip')
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }, [zip, getFilesUnder])

  return (
    <div className="fbrowser">
      <div className="fbrowser__header">
        <div className="fbrowser__title-row">
          <div className="fbrowser__zip-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>
            </svg>
          </div>
          <div>
            <h3 className="fbrowser__name">{tree.name}</h3>
            <p className="fbrowser__stats">
              {folderCount} folder{folderCount !== 1 ? 's' : ''} · {fileCount} file{fileCount !== 1 ? 's' : ''} · {formatBytes(tree.size)}
            </p>
          </div>
          <button className="fbrowser__close" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="fbrowser__toolbar">
          <div className="fbrowser__toolbar-left">
            <button className="fbrowser__tool-btn" onClick={expandAll}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              Expand All
            </button>
            <button className="fbrowser__tool-btn" onClick={collapseAll}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              Collapse
            </button>
            <span className="fbrowser__tool-sep" />
            <button className="fbrowser__tool-btn" onClick={selectAll}>Select All</button>
            <button className="fbrowser__tool-btn" onClick={deselectAll}>Deselect</button>
          </div>
          <div className="fbrowser__toolbar-right">
            {selected.size > 0 && (
              <button
                className="btn-primary fbrowser__download-btn"
                onClick={downloadSelected}
                disabled={downloading}
              >
                {downloading ? (
                  <svg className="fbrowser__spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                )}
                Download {selected.size} file{selected.size !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="fbrowser__tree">
        {tree.children.map(child => (
          <TreeNode
            key={child.path}
            node={child}
            depth={0}
            expanded={expanded}
            selected={selected}
            onToggleExpand={toggleExpand}
            onToggleFileSelect={toggleFileSelect}
            onToggleFolderSelect={toggleFolderSelect}
            getFolderSelectionState={getFolderSelectionState}
            onDownloadFile={downloadFile}
            onDownloadFolder={downloadFolder}
          />
        ))}
      </div>
    </div>
  )
}

function TreeNode({
  node, depth, expanded, selected,
  onToggleExpand, onToggleFileSelect, onToggleFolderSelect,
  getFolderSelectionState, onDownloadFile, onDownloadFolder,
}) {
  const isFolder = node.type === 'folder'
  const isExpanded = expanded.has(node.path)
  const isSelected = !isFolder && selected.has(node.path)
  const folderState = isFolder ? getFolderSelectionState(node) : null

  return (
    <div className="tnode">
      <div
        className={`tnode__row ${isSelected ? 'tnode__row--selected' : ''} ${isFolder && folderState === 'all' ? 'tnode__row--folder-selected' : ''}`}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {isFolder ? (
          <>
            <button className="tnode__checkbox-wrap" onClick={() => onToggleFolderSelect(node)}>
              <div className={`tnode__checkbox ${folderState === 'all' ? 'tnode__checkbox--checked' : ''} ${folderState === 'partial' ? 'tnode__checkbox--partial' : ''}`}>
                {folderState === 'all' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {folderState === 'partial' && <div className="tnode__checkbox-dash" />}
              </div>
            </button>
            <button className="tnode__expand" onClick={() => onToggleExpand(node.path)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`tnode__chevron ${isExpanded ? 'tnode__chevron--open' : ''}`}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <span className="tnode__icon tnode__icon--folder" onClick={() => onToggleExpand(node.path)}>
              {isExpanded ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd93d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd93d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                </svg>
              )}
            </span>
            <span className="tnode__name tnode__name--folder" onClick={() => onToggleExpand(node.path)}>{node.name}</span>
            <span className="tnode__meta">{formatBytes(node.size)}</span>
            <button className="tnode__action" onClick={() => onDownloadFolder(node)} title="Download folder as ZIP">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
          </>
        ) : (
          <>
            <button className="tnode__checkbox-wrap" onClick={() => onToggleFileSelect(node.path)}>
              <div className={`tnode__checkbox ${isSelected ? 'tnode__checkbox--checked' : ''}`}>
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            </button>
            <span className="tnode__spacer" />
            <span className="tnode__icon">
              <FileTypeIcon name={node.name} />
            </span>
            <span className="tnode__name">{node.name}</span>
            <span className="tnode__meta">{formatBytes(node.size)}</span>
            <button className="tnode__action" onClick={() => onDownloadFile(node.path)} title="Download file">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {isFolder && isExpanded && (
        <div className="tnode__children">
          {node.children.map(child => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              selected={selected}
              onToggleExpand={onToggleExpand}
              onToggleFileSelect={onToggleFileSelect}
              onToggleFolderSelect={onToggleFolderSelect}
              getFolderSelectionState={getFolderSelectionState}
              onDownloadFile={onDownloadFile}
              onDownloadFolder={onDownloadFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FileTypeIcon({ name }) {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const colors = {
    js: '#ffd93d', jsx: '#ffd93d', ts: '#3178c6', tsx: '#3178c6',
    html: '#e34c26', css: '#264de4', scss: '#cd6799',
    json: '#a8b9cc', xml: '#f16529', yaml: '#cb171e', yml: '#cb171e',
    py: '#3572a5', rb: '#cc342d', go: '#00add8', rs: '#dea584',
    java: '#b07219', kt: '#A97BFF', swift: '#fa7343',
    c: '#555', cpp: '#f34b7d', h: '#555',
    md: '#083fa1', txt: '#6b7280',
    png: '#ff6b9d', jpg: '#ff6b9d', jpeg: '#ff6b9d', gif: '#ff6b9d',
    svg: '#ffb13b', webp: '#ff6b9d', ico: '#ff6b9d', bmp: '#ff6b9d',
    mp4: '#6c5ce7', mov: '#6c5ce7', avi: '#6c5ce7', mkv: '#6c5ce7', webm: '#6c5ce7',
    mp3: '#ff8a5c', wav: '#ff8a5c', flac: '#ff8a5c', ogg: '#ff8a5c', aac: '#ff8a5c',
    pdf: '#ff4444', doc: '#2b579a', docx: '#2b579a', xls: '#217346', xlsx: '#217346',
    ppt: '#d24726', pptx: '#d24726',
    zip: '#a068ff', rar: '#a068ff', '7z': '#a068ff', tar: '#a068ff', gz: '#a068ff',
  }
  const color = colors[ext] || 'var(--text-tertiary)'

  const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp']
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm']
  const audioExts = ['mp3', 'wav', 'flac', 'ogg', 'aac']
  const codeExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'rb', 'go', 'rs', 'java', 'kt', 'swift', 'c', 'cpp', 'h', 'html', 'css', 'scss', 'json', 'xml', 'yaml', 'yml']

  if (imageExts.includes(ext)) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  )
  if (videoExts.includes(ext)) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )
  if (audioExts.includes(ext)) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  )
  if (codeExts.includes(ext)) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>
    </svg>
  )
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(i > 1 ? 1 : 0)} ${sizes[i]}`
}
