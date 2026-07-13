import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, duration = 2000, delay = 0) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now()
      const animate = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * target))
        if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    }, delay)
    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, delay])

  return count
}

export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}

export function useTypewriter(text, speed = 35, delay = 400) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    let i = 0
    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          clearInterval(intervalRef.current)
        }
      }, speed)
    }, delay)
    return () => {
      clearTimeout(timeout)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, speed, delay])

  return { displayed, done }
}
