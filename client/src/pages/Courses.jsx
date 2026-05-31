import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BookOpen, Users, IndianRupee } from 'lucide-react'
import { getCourses } from '../services/coursesService'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'

export default function Courses() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['courses', page],
    queryFn: () => getCourses(page, 12),
  })

  const courses = data?.items || []
  const pages = data?.pages || 1

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#047857)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <p className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>E-Learning</p>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 700, margin: '0.5rem 0' }}>Our Courses</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '36rem', margin: '0 auto' }}>
            Skill-building programs for students, teachers, and communities.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1rem' }}>
        {isLoading && <Spinner center size="lg" />}
        {isError && <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load courses.</p>}
        {!isLoading && courses.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No courses available yet.</p>
        )}
        {!isLoading && courses.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
            {courses.map((c) => (
              <Link key={c.id} to={`/courses/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', transition: 'transform 0.2s', height: '100%' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                >
                  {c.thumbnail && <img src={c.thumbnail} alt={c.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
                  {!c.thumbnail && <div style={{ width: '100%', height: '160px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={48} color="white" opacity={0.5} /></div>}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>{c.title}</h3>
                    {c.description && <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 700, color: c.price === 0 ? '#059669' : '#0f172a' }}>
                        {c.price === 0 ? 'Free' : <><IndianRupee size={14} />{c.price.toLocaleString('en-IN')}</>}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>Enroll →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>
    </div>
  )
}
