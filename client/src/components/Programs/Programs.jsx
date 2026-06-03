import { BookOpen, IndianRupee, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getCourses } from '../../services/coursesService'
import Spinner from '../ui/Spinner'
import styles from './Programs.module.css'

const LEVEL_COLORS = {
  BEGINNER: { bg: '#dcfce7', text: '#166534' },
  INTERMEDIATE: { bg: '#dbeafe', text: '#1e40af' },
  ADVANCED: { bg: '#fce7f3', text: '#9d174d' },
}

function CourseCard({ course }) {
  const level = course.level || 'BEGINNER'
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS.BEGINNER

  return (
    <Link to={`/courses/${course.slug || course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={styles.card}>
        <div className={styles.iconBox}>
          {course.thumbnail
            ? <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }} />
            : <BookOpen size={22} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px',
            background: colors.bg, color: colors.text, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {level}
          </span>
          {course.mode && (
            <span style={{ fontSize: '0.7rem', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '99px' }}>
              {course.mode}
            </span>
          )}
        </div>
        <h3 className={styles.cardTitle}>{course.title}</h3>
        {course.description && (
          <p className={styles.cardDesc} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.description}
          </p>
        )}
        <button type="button" className={styles.learnMore}>
          {course.price === 0
            ? 'Enroll Free →'
            : <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}><IndianRupee size={12} />{course.price?.toLocaleString('en-IN')} · Enroll →</span>}
        </button>
      </div>
    </Link>
  )
}

export default function Programs() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['courses', 1],
    queryFn: () => getCourses(1, 8),
    staleTime: 2 * 60 * 1000,
  })

  const courses = data?.items || []
  const beginner = courses.filter((c) => c.level === 'BEGINNER' || !c.level)
  const advanced = courses.filter((c) => c.level === 'INTERMEDIATE' || c.level === 'ADVANCED')

  return (
    <section id="programs" className={styles.section}>
      <div className="container">
        <div className={styles.headerRow}>
          <div>
            <p className="section-label">Our Courses</p>
            <h2 className="section-heading">Programs For Every Learner</h2>
            <p className="section-sub">
              All courses are managed through our admin panel — enroll and start learning today.
            </p>
          </div>
          <Link to="/courses">
            <button className={styles.viewAllBtn}>View All Courses →</button>
          </Link>
        </div>

        {isLoading && <Spinner center />}

        {isError && (
          <p style={{ textAlign: 'center', color: '#ef4444', padding: '2rem' }}>
            Failed to load courses.
          </p>
        )}

        {!isLoading && !isError && courses.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>
            No courses published yet. Check back soon!
          </p>
        )}

        {!isLoading && beginner.length > 0 && (
          <>
            <div className={styles.categoryLabel}>
              <BookOpen size={18} color="var(--clr-primary)" />
              Beginner &amp; Foundational
            </div>
            <div className={styles.grid}>
              {beginner.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </>
        )}

        {!isLoading && advanced.length > 0 && (
          <>
            <div className={`${styles.categoryLabel} ${styles.categoryLabelAmber}`}>
              <Sparkles size={18} color="var(--clr-accent)" />
              Intermediate &amp; Advanced
            </div>
            <div className={styles.grid}>
              {advanced.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
