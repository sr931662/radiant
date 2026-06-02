import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import styles from './ImpactCounter.module.css'

async function getPublicStats() {
  const { data } = await api.get('/api/v1/public/stats')
  return data.data ?? data
}

function Counter({ target, format }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    animated.current = false
    setCount(0)
  }, [target])

  useEffect(() => {
    if (target === 0) return
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
  const { data, isLoading } = useQuery({
    queryKey: ['public-stats'],
    queryFn: getPublicStats,
    staleTime: 5 * 60 * 1000,
  })

  const stats = data
    ? [
        {
          target: data.total_students || 0,
          label: 'Students Enrolled',
          format: (n) => n.toLocaleString('en-IN'),
        },
        {
          target: data.total_courses || 0,
          label: 'Courses Available',
          format: (n) => n.toLocaleString('en-IN'),
        },
        {
          target: data.total_enrollments || 0,
          label: 'Total Enrollments',
          format: (n) => n.toLocaleString('en-IN'),
        },
        {
          target: data.total_volunteers || 0,
          label: 'Volunteers Active',
          format: (n) => n.toLocaleString('en-IN'),
        },
        {
          target: Math.round((data.total_donations || 0) / 1000),
          label: 'Donations (₹ thousands)',
          format: (n) => `₹${n.toLocaleString('en-IN')}K`,
        },
      ]
    : Array(5).fill({ target: 0, label: '—', format: () => '—' })

  return (
    <section id="impact" className={styles.section}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Live Impact — Right Now</h2>
          <p className={styles.sub}>
            Numbers in motion. Every counter reflects real students, real courses, real change.
          </p>
        </div>
        <div className={styles.grid}>
          {isLoading
            ? Array(5).fill(null).map((_, i) => (
                <div key={i} className={styles.card}>
                  <p className={styles.statNum} style={{ opacity: 0.3 }}>—</p>
                  <p className={styles.statLabel}>Loading…</p>
                </div>
              ))
            : stats.map(({ target, label, format }) => (
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
