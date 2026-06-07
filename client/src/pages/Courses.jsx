import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookOpen, IndianRupee, Clock, Users, Award, MonitorPlay, WifiOff, Shuffle, Filter } from 'lucide-react'
import { getCourses } from '../services/coursesService'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'
import CourseCatalog from '../components/CourseCatalog/CourseCatalog.jsx'
import PhDGuidance from '../components/PhDGuidance/PhDGuidance.jsx'
import styles from './Courses.module.css'

const LEVEL_CLASS = {
  BEGINNER:     styles.levelBeginner,
  INTERMEDIATE: styles.levelIntermediate,
  ADVANCED:     styles.levelAdvanced,
}

const LEVEL_LABEL = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

const MODE_ICON = {
  ONLINE: <MonitorPlay size={12} />,
  OFFLINE: <WifiOff size={12} />,
  HYBRID: <Shuffle size={12} />,
}

function CourseCard({ course }) {
  const levelClass = LEVEL_CLASS[course.level] || styles.levelBeginner
  const levelLabel = LEVEL_LABEL[course.level] || 'Beginner'
  const isFree = course.price === 0

  return (
    <Link to={`/courses/${course.slug || course.id}`} className={styles.courseLink}>
      <div className={styles.card}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} className={styles.thumbnail} />
          : <div className={styles.thumbnailPlaceholder}>
              <BookOpen size={44} color="white" opacity={0.4} />
            </div>
        }

        <div className={styles.cardBody}>
          <div className={styles.badges}>
            {course.level && (
              <span className={levelClass}>{levelLabel}</span>
            )}
            {course.mode && (
              <span className={styles.modeBadge}>
                {MODE_ICON[course.mode]} {course.mode}
              </span>
            )}
            {course.certificate_offered && (
              <span className={styles.certBadge}>
                <Award size={10} /> Certificate
              </span>
            )}
          </div>

          <h3 className={styles.courseTitle}>{course.title}</h3>

          {course.instructor && (
            <p className={styles.instructor}>by {course.instructor}</p>
          )}

          {course.description && (
            <p className={styles.desc}>{course.description}</p>
          )}

          <div className={styles.metaRow}>
            {course.duration_weeks && (
              <span className={styles.metaItem}>
                <Clock size={12} /> {course.duration_weeks}w
              </span>
            )}
            {course.enrollment_count > 0 && (
              <span className={styles.metaItem}>
                <Users size={12} /> {course.enrollment_count.toLocaleString('en-IN')} enrolled
              </span>
            )}
          </div>

          <div className={styles.priceRow}>
            <span className={isFree ? styles.priceFree : styles.pricePaid}>
              {isFree ? 'Free' : <><IndianRupee size={14} strokeWidth={2.5} />{course.price.toLocaleString('en-IN')}</>}
            </span>
            <span className={styles.enrollBtn}>Enroll →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Courses() {
  const [page, setPage] = useState(1)
  const [levelFilter, setLevelFilter] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['courses', page],
    queryFn: () => getCourses(page, 12),
  })

  const courses = data?.items || []
  const filtered = levelFilter ? courses.filter((c) => c.level === levelFilter) : courses

  return (
    <div>
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroBadge}>
            <BookOpen size={12} /> E-Learning
          </div>
          <h1 className={styles.heroTitle}>Our Courses</h1>
          <p className={styles.heroDesc}>
            Skill-building programs for students, teachers, and communities. Learn from experts, earn certificates, and grow your career.
          </p>
          {data && (
            <div className={styles.statsRow}>
              {[
                { val: data.total, label: 'Courses' },
                { val: courses.filter(c => c.price === 0).length, label: 'Free' },
                { val: courses.filter(c => c.certificate_offered).length, label: 'With Certificate' },
              ].map(({ val, label }) => (
                <div key={label} className={styles.statItem}>
                  <div className={styles.statValue}>{val}</div>
                  <div className={styles.statLabel}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`container ${styles.body}`}>
        <div className={styles.filterBar}>
          <Filter size={15} color="#64748b" />
          {['', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
            <button
              key={lvl || 'ALL'}
              onClick={() => setLevelFilter(lvl)}
              className={`${styles.filterBtn} ${levelFilter === lvl ? styles.filterBtnActive : ''}`}
            >
              {lvl || 'All Levels'}
            </button>
          ))}
        </div>

        {isLoading && <Spinner center size="lg" />}
        {isError && <p className={styles.errorMsg}>Failed to load courses.</p>}

        {!isLoading && filtered.length === 0 && (
          <div className={styles.emptyState}>
            <BookOpen size={48} color="#cbd5e1" className={styles.emptyIcon} />
            <p className={styles.emptyMsg}>No courses found.</p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}

        <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />
      </div>

      <CourseCatalog />
      <PhDGuidance />
    </div>
  )
}
