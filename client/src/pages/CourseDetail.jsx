import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  ArrowLeft, BookOpen, PlayCircle, CheckCircle2, Clock, Users, Globe2,
  Award, ChevronDown, ChevronUp, IndianRupee, BadgeCheck, Star,
  MonitorPlay, WifiOff, Shuffle, UserCircle2, GraduationCap, Lock,
} from 'lucide-react'
import { getCourse, enrollCourse, createCoursePaymentOrder, verifyCoursePayment } from '../services/coursesService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import DemoPaymentModal from '../components/ui/DemoPaymentModal'

const LEVEL_META = {
  BEGINNER:     { label: 'Beginner',     color: '#166534', bg: '#dcfce7' },
  INTERMEDIATE: { label: 'Intermediate', color: '#1e40af', bg: '#dbeafe' },
  ADVANCED:     { label: 'Advanced',     color: '#9d174d', bg: '#fce7f3' },
}
const MODE_ICON = { ONLINE: <MonitorPlay size={14} />, OFFLINE: <WifiOff size={14} />, HYBRID: <Shuffle size={14} /> }

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

function ModuleAccordion({ mod, index }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.6rem' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: '100%', padding: '0.875rem 1.1rem', background: open ? '#eff6ff' : '#f8fafc', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>{index + 1}</span>
          {mod.title}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>
          {mod.lessons?.length || 0} lessons
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && mod.lessons?.length > 0 && (
        <div>
          {mod.lessons.map((lesson, li) => (
            <div key={lesson.id} style={{ padding: '0.6rem 1.1rem 0.6rem 2.75rem', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #f1f5f9', fontSize: '0.875rem', color: '#475569', background: 'white' }}>
              {lesson.video_url
                ? <PlayCircle size={15} color="#7c3aed" style={{ flexShrink: 0 }} />
                : <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0 }} />}
              <span style={{ flex: 1 }}>{lesson.title}</span>
              {li > 1 && <Lock size={12} color="#cbd5e1" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CourseDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [demoOrder, setDemoOrder] = useState(null)

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id),
  })

  // Free enroll
  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(id),
    onSuccess: () => {
      toast.success('Enrolled successfully! Check My Courses to start learning.')
      qc.invalidateQueries({ queryKey: ['my-courses'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Enrollment failed.'),
  })

  // Paid enroll via Razorpay (or demo modal)
  const paymentMutation = useMutation({
    mutationFn: () => createCoursePaymentOrder(id),
    onSuccess: async (order) => {
      // Demo mode — show our own payment UI
      if (order.demo || order.order_id?.startsWith('demo_')) {
        setDemoOrder(order)
        return
      }

      // Real Razorpay
      const loaded = await loadRazorpay()
      if (!loaded) { toast.error('Razorpay failed to load.'); return }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        order_id: order.order_id,
        name: 'Radiant Education Trust',
        description: `Enrollment: ${order.course_title}`,
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#2563eb' },
        handler: async (response) => {
          try {
            await verifyCoursePayment(id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            toast.success('Payment successful! You are now enrolled.')
            qc.invalidateQueries({ queryKey: ['my-courses'] })
          } catch {
            toast.error('Payment verification failed. Contact support.')
          }
        },
        modal: { ondismiss: () => toast('Payment cancelled.') },
      }
      new window.Razorpay(options).open()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Could not initiate payment.'),
  })

  async function handleDemoSuccess() {
    try {
      await verifyCoursePayment(id, {
        razorpay_order_id: demoOrder.order_id,
        razorpay_payment_id: `demo_pay_${Date.now()}`,
        razorpay_signature: 'demo_signature',
      })
      toast.success('Enrolled successfully!')
      qc.invalidateQueries({ queryKey: ['my-courses'] })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Enrollment failed.')
    } finally {
      setDemoOrder(null)
    }
  }

  function handleEnroll() {
    if (!isAuthenticated) { navigate('/login'); return }
    if (course.price > 0) { paymentMutation.mutate(); return }
    enrollMutation.mutate()
  }

  if (isLoading) return <Spinner center size="lg" style={{ marginTop: '4rem' }} />
  if (isError || !course) return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
      <p style={{ color: '#ef4444', fontWeight: 600 }}>Course not found.</p>
      <Link to="/courses" style={{ color: 'var(--clr-primary)', marginTop: '0.5rem', display: 'inline-block' }}>← Back to Courses</Link>
    </div>
  )

  const level = LEVEL_META[course.level] || LEVEL_META.BEGINNER
  const isPending = enrollMutation.isPending || paymentMutation.isPending
  const totalLessons = course.modules?.reduce((s, m) => s + (m.lessons?.length || 0), 0) || 0

  return (
    <div>
      {/* ── Hero banner ── */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#1e1b4b 100%)', color: 'white', padding: '3rem 0 0' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={15} /> Back to Courses
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end', paddingBottom: '2rem' }}>
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {course.level && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: level.bg, color: level.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {level.label}
                  </span>
                )}
                {course.mode && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '99px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {MODE_ICON[course.mode]} {course.mode}
                  </span>
                )}
                {course.certificate_offered && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '99px', background: 'rgba(251,191,36,0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={11} /> Certificate
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.4rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', color: 'white' }}>
                {course.title}
              </h1>

              {course.description && (
                <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, maxWidth: '640px', fontSize: '1rem', marginBottom: '1.5rem' }}>
                  {course.description}
                </p>
              )}

              {/* Quick stats */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                {course.duration_weeks && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {course.duration_weeks} week{course.duration_weeks > 1 ? 's' : ''}
                  </span>
                )}
                {totalLessons > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <BookOpen size={14} /> {totalLessons} lessons
                  </span>
                )}
                {course.enrollment_count > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={14} /> {course.enrollment_count.toLocaleString('en-IN')} enrolled
                  </span>
                )}
                {course.language && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Globe2 size={14} /> {course.language}
                  </span>
                )}
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.25rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  <UserCircle2 size={18} />
                  <span>Instructor: <strong style={{ color: 'white' }}>{course.instructor}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content + sidebar ── */}
      <div className="container" style={{ maxWidth: 1100, padding: '2.5rem 1rem' }}>
        <style>{`.crs-grid{display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:start}@media(min-width:900px){.crs-grid{grid-template-columns:1fr 320px}}`}</style>
        <div className="crs-grid">

          {/* Left column */}
          <div>
            {/* Thumbnail */}
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }} />
            )}

            {/* What you'll learn */}
            {course.what_you_learn?.length > 0 && (
              <section style={{ marginBottom: '2rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={20} color="#059669" /> What You'll Learn
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem' }}>
                  {course.what_you_learn.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#1e4032' }}>
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prerequisites */}
            {course.prerequisites && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>Prerequisites</h2>
                <p style={{ color: '#475569', lineHeight: 1.7, background: '#fafafa', borderLeft: '3px solid #2563eb', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  {course.prerequisites}
                </p>
              </section>
            )}

            {/* Target audience */}
            {course.target_audience && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>Who Is This For?</h2>
                <p style={{ color: '#475569', lineHeight: 1.7 }}>{course.target_audience}</p>
              </section>
            )}

            {/* Course curriculum */}
            {course.modules?.length > 0 && (
              <section style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Course Curriculum</h2>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {course.modules.length} modules · {totalLessons} lessons
                  </span>
                </div>
                {course.modules.map((mod, i) => (
                  <ModuleAccordion key={mod.id} mod={mod} index={i} />
                ))}
              </section>
            )}

            {/* Instructor bio */}
            {course.instructor && (
              <section style={{ marginBottom: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Your Instructor</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem' }}>{course.instructor[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{course.instructor}</p>
                    {course.instructor_bio && <p style={{ color: '#64748b', marginTop: '0.4rem', lineHeight: 1.65, fontSize: '0.9rem' }}>{course.instructor_bio}</p>}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar */}
          <div style={{ position: 'sticky', top: '88px', order: -1 }}
            className="crs-sidebar"
          >
            <style>{`.crs-sidebar{order:-1}@media(min-width:900px){.crs-sidebar{order:unset}}`}</style>
            <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
              {!course.thumbnail && (
                <div style={{ height: 140, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={48} color="white" opacity={0.4} />
                </div>
              )}
              {course.thumbnail && <img src={course.thumbnail} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />}

              <div style={{ padding: '1.25rem' }}>
                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '1rem' }}>
                  {course.price === 0 ? (
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#059669' }}>Free</span>
                  ) : (
                    <>
                      <IndianRupee size={20} strokeWidth={2.5} color="#0f172a" style={{ marginTop: 6 }} />
                      <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>{course.price.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleEnroll}
                  disabled={isPending}
                  style={{ width: '100%', padding: '0.9rem', background: course.price > 0 ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#059669', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: isPending ? 'wait' : 'pointer', opacity: isPending ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.15s' }}
                >
                  {isPending ? 'Please wait…' : !isAuthenticated ? 'Sign In to Enroll' : course.price > 0 ? <><IndianRupee size={16} /> Pay & Enroll</> : 'Enroll for Free'}
                </button>

                {course.price > 0 && (
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.5rem' }}>
                    Secure payment via Razorpay
                  </p>
                )}

                {/* Highlights */}
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {course.duration_weeks && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                      <Clock size={15} color="#2563eb" />
                      <span><strong>{course.duration_weeks} weeks</strong> duration</span>
                    </div>
                  )}
                  {course.mode && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                      {MODE_ICON[course.mode]}
                      <span>{course.mode.charAt(0) + course.mode.slice(1).toLowerCase()} learning</span>
                    </div>
                  )}
                  {totalLessons > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                      <BookOpen size={15} color="#2563eb" />
                      <span><strong>{totalLessons} lessons</strong> across {course.modules?.length} modules</span>
                    </div>
                  )}
                  {course.max_seats && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                      <Users size={15} color="#2563eb" />
                      <span>Max <strong>{course.max_seats}</strong> seats</span>
                    </div>
                  )}
                  {course.language && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
                      <Globe2 size={15} color="#2563eb" />
                      <span>{course.language}</span>
                    </div>
                  )}
                  {course.certificate_offered && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#059669', fontWeight: 600 }}>
                      <BadgeCheck size={15} color="#059669" />
                      <span>Certificate on completion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Share / back links */}
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <Link to="/courses" style={{ color: '#64748b', textDecoration: 'none' }}>← Browse all courses</Link>
            </p>
          </div>
        </div>
      </div>

      <DemoPaymentModal
        open={!!demoOrder}
        amount={demoOrder?.amount || 0}
        description={demoOrder?.course_title || ''}
        onSuccess={handleDemoSuccess}
        onClose={() => setDemoOrder(null)}
      />
    </div>
  )
}
