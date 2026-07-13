import { useState, useRef, useCallback } from 'react'

const CHUNK_SIZE = 1024 * 1024 * 2 // 2MB chunks

const STATUS = {
  WAITING: 'waiting',
  PREPARING: 'preparing',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  RETRYING: 'retrying',
  CANCELLED: 'cancelled',
  PAUSED: 'paused',
}

let idCounter = 0

function createUploadItem(file) {
  return {
    id: `upload-${++idCounter}-${Date.now()}`,
    file,
    fileName: file.name,
    fileSize: file.size,
    status: STATUS.WAITING,
    progress: 0,
    uploadedBytes: 0,
    speed: 0,
    remainingTime: 0,
    error: null,
    lastChunkIndex: 0,
  }
}

function simulateChunkUpload(chunkIndex, totalChunks) {
  return new Promise((resolve, reject) => {
    const delay = 80 + Math.random() * 200
    const failChance = 0.02
    setTimeout(() => {
      if (Math.random() < failChance && chunkIndex > 2 && chunkIndex < totalChunks - 1) {
        reject(new Error('Network error: connection interrupted'))
      } else {
        resolve()
      }
    }, delay)
  })
}

export default function useUpload() {
  const [uploads, setUploads] = useState([])
  const abortControllers = useRef(new Map())
  const speedHistory = useRef(new Map())

  const updateUpload = useCallback((id, updates) => {
    setUploads(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
  }, [])

  const processUpload = useCallback(async (item, resumeFrom = 0) => {
    const { id, file } = item
    const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))
    const controller = new AbortController()
    abortControllers.current.set(id, controller)
    speedHistory.current.set(id, [])

    updateUpload(id, { status: STATUS.PREPARING, progress: 0 })

    await new Promise(r => setTimeout(r, 300 + Math.random() * 400))

    if (controller.signal.aborted) {
      updateUpload(id, { status: STATUS.CANCELLED })
      return
    }

    const startByte = resumeFrom * CHUNK_SIZE
    const startProgress = file.size > 0 ? (startByte / file.size) * 100 : 0

    updateUpload(id, {
      status: STATUS.UPLOADING,
      progress: startProgress,
      uploadedBytes: startByte,
    })

    let uploadedBytes = startByte
    let lastTime = performance.now()
    let lastBytes = uploadedBytes

    for (let i = resumeFrom; i < totalChunks; i++) {
      if (controller.signal.aborted) {
        updateUpload(id, { status: STATUS.CANCELLED, lastChunkIndex: i })
        return
      }

      try {
        await simulateChunkUpload(i, totalChunks)

        const chunkBytes = Math.min(CHUNK_SIZE, file.size - i * CHUNK_SIZE)
        uploadedBytes += chunkBytes

        const now = performance.now()
        const elapsed = (now - lastTime) / 1000
        const bytesThisTick = uploadedBytes - lastBytes

        let speed = elapsed > 0 ? bytesThisTick / elapsed : 0
        const history = speedHistory.current.get(id) || []
        history.push(speed)
        if (history.length > 10) history.shift()
        speedHistory.current.set(id, history)
        const avgSpeed = history.reduce((a, b) => a + b, 0) / history.length

        const remaining = file.size - uploadedBytes
        const remainingTime = avgSpeed > 0 ? remaining / avgSpeed : 0

        lastTime = now
        lastBytes = uploadedBytes

        updateUpload(id, {
          progress: file.size > 0 ? (uploadedBytes / file.size) * 100 : 100,
          uploadedBytes,
          speed: avgSpeed,
          remainingTime,
          lastChunkIndex: i + 1,
        })
      } catch (err) {
        updateUpload(id, {
          status: STATUS.FAILED,
          error: err.message,
          lastChunkIndex: i,
        })
        abortControllers.current.delete(id)
        speedHistory.current.delete(id)
        return
      }
    }

    updateUpload(id, { status: STATUS.PROCESSING, progress: 100, uploadedBytes: file.size })
    await new Promise(r => setTimeout(r, 500 + Math.random() * 800))

    if (controller.signal.aborted) {
      updateUpload(id, { status: STATUS.CANCELLED })
      return
    }

    updateUpload(id, {
      status: STATUS.COMPLETED,
      progress: 100,
      uploadedBytes: file.size,
      speed: 0,
      remainingTime: 0,
    })

    abortControllers.current.delete(id)
    speedHistory.current.delete(id)
  }, [updateUpload])

  const addFiles = useCallback((files) => {
    const newItems = Array.from(files)
      .filter(f => f.name.toLowerCase().endsWith('.zip') || f.type === 'application/zip' || f.type === 'application/x-zip-compressed')
      .map(createUploadItem)

    if (newItems.length === 0) return

    setUploads(prev => [...prev, ...newItems])
    newItems.forEach(item => processUpload(item))
  }, [processUpload])

  const retryUpload = useCallback((id) => {
    setUploads(prev => {
      const item = prev.find(u => u.id === id)
      if (!item || (item.status !== STATUS.FAILED && item.status !== STATUS.CANCELLED)) return prev
      return prev.map(u => u.id === id ? { ...u, status: STATUS.RETRYING, error: null } : u)
    })

    setUploads(prev => {
      const item = prev.find(u => u.id === id)
      if (item) {
        processUpload(item, item.lastChunkIndex)
      }
      return prev
    })
  }, [processUpload])

  const cancelUpload = useCallback((id) => {
    const controller = abortControllers.current.get(id)
    if (controller) controller.abort()
    updateUpload(id, { status: STATUS.CANCELLED })
    abortControllers.current.delete(id)
  }, [updateUpload])

  const cancelAll = useCallback(() => {
    uploads.forEach(u => {
      if (u.status === STATUS.UPLOADING || u.status === STATUS.PREPARING || u.status === STATUS.WAITING) {
        const controller = abortControllers.current.get(u.id)
        if (controller) controller.abort()
        abortControllers.current.delete(u.id)
      }
    })
    setUploads(prev => prev.map(u =>
      [STATUS.UPLOADING, STATUS.PREPARING, STATUS.WAITING].includes(u.status)
        ? { ...u, status: STATUS.CANCELLED }
        : u
    ))
  }, [uploads])

  const retryFailed = useCallback(() => {
    uploads
      .filter(u => u.status === STATUS.FAILED)
      .forEach(u => retryUpload(u.id))
  }, [uploads, retryUpload])

  const removeCompleted = useCallback(() => {
    setUploads(prev => prev.filter(u => u.status !== STATUS.COMPLETED))
  }, [])

  const removeUpload = useCallback((id) => {
    const controller = abortControllers.current.get(id)
    if (controller) controller.abort()
    abortControllers.current.delete(id)
    setUploads(prev => prev.filter(u => u.id !== id))
  }, [])

  const clearQueue = useCallback(() => {
    abortControllers.current.forEach(c => c.abort())
    abortControllers.current.clear()
    speedHistory.current.clear()
    setUploads([])
  }, [])

  return {
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
  }
}
