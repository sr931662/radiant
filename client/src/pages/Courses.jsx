import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookOpen, IndianRupee, Clock, Users, Award, MonitorPlay, WifiOff, Shuffle, Filter } from 'lucide-react'
import { getCourses } from '../services/coursesService'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'

const LEVEL_META = {
  BEGINNER:     { label: 'Beginner',     color: '#166534', bg: '#dcfce7' },
  INTERMEDIATE: { label: 'Intermediate', color: '#1e40af', bg: '#dbeafe' },
  ADVANCED:     { label: 'Advanced',     color: '#9d174d', bg: '#fce7f3' },
}

const MODE_ICON = {
  ONLINE: <MonitorPlay size={12} />,
  OFFLINE: <WifiOff size={12} />,
  HYBRID: <Shuffle size={12} />,
}

function CourseCard({ course }) {
  const level = LEVEL_META[course.level] || LEVEL_META.BEGINNER
  const isFree = course.price === 0

  return (
    <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
      <div style={{
        background: 'white', borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9',
        display: 'flex', flexDirection: 'column', width: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}
      >
        {/* Thumbnail */}
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: 180, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={44} color="white" opacity={0.4} />
            </div>
        }

        <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            {course.level && (
              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: level.bg, color: level.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {level.label}
              </span>
            )}
            {course.mode && (
              <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: '#f1f5f9', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                {MODE_ICON[course.mode]} {course.mode}
              </span>
            )}
            {course.certificate_offered && (
              <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: '#fef3c7', color: '#92400e', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Award size={10} /> Certificate
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, marginBottom: '0.4rem' }}>
            {course.title}
          </h3>

          {course.instructor && (
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.5rem' }}>by {course.instructor}</p>
          )}

          {course.description && (
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
              {course.description}
            </p>
          )}

          {/* Meta row */}
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
            {course.duration_weeks && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Clock size={12} /> {course.duration_weeks}w
              </span>
            )}
            {course.enrollment_count > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Users size={12} /> {course.enrollment_count.toLocaleString('en-IN')} enrolled
              </span>
            )}
          </div>

          {/* Price + CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: isFree ? '#059669' : '#0f172a', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              {isFree ? 'Free' : <><IndianRupee size={14} strokeWidth={2.5} />{course.price.toLocaleString('en-IN')}</>}
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '4px 12px', borderRadius: 8 }}>
              Enroll →
            </span>
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
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#047857)', padding: '4rem 0', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <BookOpen size={12} /> E-Learning
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, margin: '0 0 1rem' }}>Our Courses</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '540px', margin: '0 auto 2rem', lineHeight: 1.65 }}>
            Skill-building programs for students, teachers, and communities. Learn from experts, earn certificates, and grow your career.
          </p>
          {/* Stats */}
          {data && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { val: data.total, label: 'Courses' },
                { val: courses.filter(c => c.price === 0).length, label: 'Free' },
                { val: courses.filter(c => c.certificate_offered).length, label: 'With Certificate' },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{val}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={15} color="#64748b" />
          {['', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
            <button
              key={lvl || 'ALL'}
              onClick={() => setLevelFilter(lvl)}
              style={{
                padding: '5px 14px', borderRadius: 99, border: '1px solid',
                borderColor: levelFilter === lvl ? '#2563eb' : '#e2e8f0',
                background: levelFilter === lvl ? '#2563eb' : 'white',
                color: levelFilter === lvl ? 'white' : '#475569',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {lvl || 'All Levels'}
            </button>
          ))}
        </div>

        {isLoading && <Spinner center size="lg" />}
        {isError && <p style={{ textAlign: 'center', color: '#ef4444', padding: '2rem' }}>Failed to load courses.</p>}

        {!isLoading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
            <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No courses found.</p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: '1.5rem' }}>
            {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}

        <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />
      </div>
    </div>
  )
}
