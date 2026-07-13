import { useState, useCallback } from 'react'
import JSZip from 'jszip'

/**
 * Builds a nested tree structure from flat JSZip entries.
 * Each node: { name, path, type: 'file'|'folder', size, children: [], blob }
 */
function buildTree(zipEntries) {
  const root = { name: 'root', path: '', type: 'folder', children: [], size: 0 }
  const folderMap = new Map()
  folderMap.set('', root)

  // Ensure all parent folders exist
  function ensureFolder(folderPath) {
    if (folderMap.has(folderPath)) return folderMap.get(folderPath)
    const parts = folderPath.replace(/\/$/, '').split('/')
    const name = parts[parts.length - 1]
    const parentPath = parts.slice(0, -1).join('/')
    const parent = ensureFolder(parentPath)
    const folder = {
      name,
      path: folderPath.replace(/\/$/, ''),
      type: 'folder',
      children: [],
      size: 0,
    }
    parent.children.push(folder)
    folderMap.set(folderPath.replace(/\/$/, ''), folder)
    return folder
  }

  // Sort entries so folders come first
  const sorted = [...zipEntries].sort((a, b) => {
    if (a.dir && !b.dir) return -1
    if (!a.dir && b.dir) return 1
    return a.name.localeCompare(b.name)
  })

  for (const entry of sorted) {
    const cleanPath = entry.name.replace(/\/$/, '')
    const parts = cleanPath.split('/')
    const name = parts[parts.length - 1]
    if (!name) continue

    const parentPath = parts.slice(0, -1).join('/')
    const parent = ensureFolder(parentPath)

    if (entry.dir) {
      ensureFolder(cleanPath)
    } else {
      const fileNode = {
        name,
        path: cleanPath,
        type: 'file',
        size: entry._data?.uncompressedSize || 0,
        zipEntry: entry,
      }
      parent.children.push(fileNode)
    }
  }

  // Sort children: folders first, then files, alphabetical
  function sortChildren(node) {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type === 'folder' && b.type === 'file') return -1
        if (a.type === 'file' && b.type === 'folder') return 1
        return a.name.localeCompare(b.name)
      })
      node.children.forEach(sortChildren)
    }
  }
  sortChildren(root)

  // Calculate folder sizes
  function calcSize(node) {
    if (node.type === 'file') return node.size
    let total = 0
    for (const child of node.children) {
      total += calcSize(child)
    }
    node.size = total
    return total
  }
  calcSize(root)

  return root
}

export default function useExtractor() {
  const [extractions, setExtractions] = useState(new Map())

  const extractZip = useCallback(async (uploadId, file) => {
    setExtractions(prev => {
      const next = new Map(prev)
      next.set(uploadId, { status: 'extracting', progress: 0, tree: null, error: null, fileName: file.name })
      return next
    })

    try {
      const zip = await JSZip.loadAsync(file, {
        // Progress callback
      })

      const entries = []
      zip.forEach((relativePath, zipEntry) => {
        entries.push(zipEntry)
      })

      const tree = buildTree(entries)
      tree.name = file.name.replace(/\.zip$/i, '')
      tree.zipInstance = zip

      // Count total files
      let fileCount = 0
      let folderCount = 0
      function count(node) {
        for (const child of node.children) {
          if (child.type === 'file') fileCount++
          else { folderCount++; count(child) }
        }
      }
      count(tree)

      setExtractions(prev => {
        const next = new Map(prev)
        next.set(uploadId, {
          status: 'done',
          progress: 100,
          tree,
          error: null,
          fileName: file.name,
          fileCount,
          folderCount,
          zip,
        })
        return next
      })
    } catch (err) {
      setExtractions(prev => {
        const next = new Map(prev)
        next.set(uploadId, {
          status: 'error',
          progress: 0,
          tree: null,
          error: err.message || 'Failed to extract ZIP',
          fileName: file.name,
        })
        return next
      })
    }
  }, [])

  const getExtraction = useCallback((uploadId) => {
    return extractions.get(uploadId) || null
  }, [extractions])

  const removeExtraction = useCallback((uploadId) => {
    setExtractions(prev => {
      const next = new Map(prev)
      next.delete(uploadId)
      return next
    })
  }, [])

  return {
    extractions,
    extractZip,
    getExtraction,
    removeExtraction,
  }
}
