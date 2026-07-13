import { useInView, useCountUp } from '../hooks/useAnimations'
import './Performance.css'

const metrics = [
  { value: 10, suffix: 'GB', label: 'Max Archive Size' },
  { value: 100, suffix: 'K+', label: 'Files Per Archive' },
  { value: 3, suffix: 's', label: 'Average Extract Time' },
  { value: 0, suffix: 'bytes', label: 'Sent to Server', display: '0' }
]

export default function Performance() {
  const [ref, inView] = useInView()

  return (
    <section ref={ref} className={`performance ${inView ? 'performance--visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Performance</span>
          <h2 className="section-title">
            Built for speed,<br />
            <span className="gradient-text">at any scale</span>
          </h2>
          <p className="section-subtitle">
            Streaming extraction, virtualized rendering, and lazy loading keep everything fast — even with thousands of files.
          </p>
        </div>
        <div className="performance__grid">
          {metrics.map((m, i) => (
            <MetricCard key={i} metric={m} index={i} animate={inView} />
          ))}
        </div>
        <div className="performance__features">
          <div className="perf-feature">
            <div className="perf-feature__bar">
              <div className="perf-feature__fill" style={{ '--fill-width': '95%', animationDelay: '0.3s' }} />
            </div>
            <span>Streaming extraction</span>
          </div>
          <div className="perf-feature">
            <div className="perf-feature__bar">
              <div className="perf-feature__fill" style={{ '--fill-width': '90%', animationDelay: '0.5s' }} />
            </div>
            <span>Virtualized file lists</span>
          </div>
          <div className="perf-feature">
            <div className="perf-feature__bar">
              <div className="perf-feature__fill" style={{ '--fill-width': '98%', animationDelay: '0.7s' }} />
            </div>
            <span>Lazy loading previews</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({ metric, index, animate }) {
  const count = useCountUp(metric.value, 2000, animate ? 400 + index * 200 : 99999)

  return (
    <div className="metric-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="metric-card__value">
        <span className="metric-card__number">
          {metric.display !== undefined ? metric.display : count}
        </span>
        <span className="metric-card__suffix">{metric.suffix}</span>
      </div>
      <p className="metric-card__label">{metric.label}</p>
    </div>
  )
}
