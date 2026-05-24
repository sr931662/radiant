import { useEffect, useRef, useState } from 'react'
import styles from './ImpactCounter.module.css'

const STATS = [
  { target: 120000, label: 'Children Educated',    format: (n) => n.toLocaleString('en-IN') },
  { target: 340,    label: 'Schools Built',         format: (n) => n.toLocaleString('en-IN') },
  { target: 18,     label: 'Countries Reached',     format: (n) => n.toString() },
  { target: 8500,   label: 'Scholarships Awarded',  format: (n) => n.toLocaleString('en-IN') },
  { target: 2400,   label: 'Volunteers Active',     format: (n) => n.toLocaleString('en-IN') },
]

function Counter({ target, format }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const duration = 2000
          const step = target / (duration / 16)
          let current = 0
          const tick = () => {
            current = Math.min(current + step, target)
            setCount(Math.floor(current))
            if (current < target) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return (
    <p ref={ref} className={styles.statNum}>
      {format(count)}
    </p>
  )
}

export default function ImpactCounter() {
  return (
    <section id="impact" className={styles.section}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Live Impact — Right Now</h2>
          <p className={styles.sub}>
            Numbers in motion. Every counter reflects real children, real schools, real change.
          </p>
        </div>
        <div className={styles.grid}>
          {STATS.map(({ target, label, format }) => (
            <div key={label} className={styles.card}>
              <Counter target={target} format={format} />
              <p className={styles.statLabel}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
