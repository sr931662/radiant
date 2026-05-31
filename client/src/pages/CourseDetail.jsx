import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, BookOpen, PlayCircle, IndianRupee, CheckCircle2 } from 'lucide-react'
import { getCourse, enrollCourse } from '../services/coursesService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'

export default function CourseDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id),
  })

  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(id),
    onSuccess: () => { toast.success('Successfully enrolled!'); qc.invalidateQueries({ queryKey: ['my-courses'] }) },
    onError: (err) => toast.error(err?.response?.data?.message || 'Enrollment failed.'),
  })

  function handleEnroll() {
    if (!isAuthenticated) { navigate('/login'); return }
    enrollMutation.mutate()
  }

  if (isLoading) return <Spinner center size="lg" />
  if (isError || !course) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <p style={{ color: '#ef4444' }}>Course not found.</p>
      <Link to="/courses" style={{ color: 'var(--clr-primary)' }}>← Back to Courses</Link>
    </div>
  )

  return (
    <div className="container" style={{ maxWidth: '900px', padding: '3rem 1rem' }}>
      <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        <div>
          {course.thumbnail
            ? <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
            : <div style={{ width: '100%', height: '280px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><BookOpen size={64} color="white" opacity={0.5} /></div>
          }
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>{course.title}</h1>
          {course.description && <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>{course.description}</p>}

          {course.modules?.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Course Content</h2>
              {course.modules.map((mod) => (
                <div key={mod.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} color="#2563eb" /> {mod.title}
                  </div>
                  {mod.lessons?.map((lesson) => (
                    <div key={lesson.id} style={{ padding: '0.6rem 1rem 0.6rem 2rem', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#475569' }}>
                      {lesson.video_url ? <PlayCircle size={15} color="#7c3aed" /> : <CheckCircle2 size={15} color="#059669" />}
                      {lesson.title}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', top: '100px', background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: course.price === 0 ? '#059669' : '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {course.price === 0 ? 'Free' : <><IndianRupee size={24} />{course.price.toLocaleString('en-IN')}</>}
          </div>
          <button
            onClick={handleEnroll}
            disabled={enrollMutation.isPending}
            style={{ width: '100%', padding: '0.875rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.15s' }}
          >
            {enrollMutation.isPending ? 'Enrolling…' : isAuthenticated ? 'Enroll Now' : 'Sign In to Enroll'}
          </button>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.75rem' }}>
            Completion certificate issued upon finishing the course.
          </p>
        </div>
      </div>
    </div>
  )
}
