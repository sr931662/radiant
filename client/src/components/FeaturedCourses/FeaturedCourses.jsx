import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookOpen, IndianRupee } from 'lucide-react'
import { getCourses } from '../../services/coursesService'
import Spinner from '../ui/Spinner'
import styles from './FeaturedCourses.module.css'

const LEVEL_BADGE = {
  BEGINNER:     { bg: '#dcfce7', color: '#166534' },
  INTERMEDIATE: { bg: '#dbeafe', color: '#1e40af' },
  ADVANCED:     { bg: '#fce7f3', color: '#9d174d' },
}

export default function FeaturedCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ['courses', 1],
    queryFn: () => getCourses(1, 3),
    staleTime: 2 * 60 * 1000,
  })

  const courses = data?.items?.slice(0, 3) || []

  if (!isLoading && courses.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="section-label">E-Learning</p>
            <h2 className="section-heading">Latest Courses</h2>
          </div>
          <Link to="/courses" className={styles.viewAll}>Browse All Courses →</Link>
        </div>

        {isLoading && <Spinner center />}

        {!isLoading && (
          <div className={styles.grid}>
            {courses.map((c) => {
              const badge = LEVEL_BADGE[c.level] || LEVEL_BADGE.BEGINNER
              return (
                <Link key={c.id} to={`/courses/${c.id}`} className={styles.cardLink}>
                  <div className={styles.card}>
                    {c.thumbnail
                      ? <img src={c.thumbnail} alt={c.title} className={styles.thumb} />
                      : <div className={styles.thumbFallback}><BookOpen size={40} color="white" opacity={0.5} /></div>}
                    <div className={styles.body}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        {c.level && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: badge.bg, color: badge.color, textTransform: 'uppercase' }}>
                            {c.level}
                          </span>
                        )}
                        {c.mode && (
                          <span style={{ fontSize: '0.7rem', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '99px' }}>
                            {c.mode}
                          </span>
                        )}
                      </div>
                      <h3 className={styles.title}>{c.title}</h3>
                      {c.description && (
                        <p className={styles.desc}>{c.description}</p>
                      )}
                      <div className={styles.footer}>
                        <span className={styles.price} style={{ color: c.price === 0 ? '#059669' : '#0f172a' }}>
                          {c.price === 0
                            ? 'Free'
                            : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><IndianRupee size={13} />{c.price.toLocaleString('en-IN')}</span>}
                        </span>
                        <span className={styles.enroll}>Enroll →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
