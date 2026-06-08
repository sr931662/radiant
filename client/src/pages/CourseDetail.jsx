import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  ArrowLeft, BookOpen, PlayCircle, CheckCircle2, Clock, Users, Globe2,
  Award, ChevronDown, ChevronUp, IndianRupee, BadgeCheck,
  MonitorPlay, WifiOff, Shuffle, UserCircle2, GraduationCap, Lock,
} from 'lucide-react'
import { getCourse, enrollCourse, createCoursePaymentOrder, verifyCoursePayment } from '../services/coursesService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import styles from './CourseDetail.module.css'

const LEVEL_CLASS = {
  BEGINNER: styles.levelBeginner,
  INTERMEDIATE: styles.levelIntermediate,
  ADVANCED: styles.levelAdvanced,
}
const LEVEL_LABEL = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' }
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
    <div className={styles.accordion}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`${styles.accordionBtn} ${open ? styles.accordionBtnOpen : ''}`}
      >
        <span className={styles.accordionLeft}>
          <span className={styles.moduleNum}>{index + 1}</span>
          {mod.title}
        </span>
        <span className={styles.accordionRight}>
          {mod.lessons?.length || 0} lessons
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && mod.lessons?.length > 0 && (
        <div>
          {mod.lessons.map((lesson, li) => (
            <div key={lesson.id} className={styles.lesson}>
              {lesson.video_url
                ? <PlayCircle size={15} color="#7c3aed" style={{ flexShrink: 0 }} />
                : <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0 }} />}
              <span className={styles.lessonTitle}>{lesson.title}</span>
              {li > 1 && <Lock size={12} color="#cbd5e1" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CourseDetail() {
  const { slug } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => getCourse(slug),
  })

  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(slug),
    onSuccess: () => {
      toast.success('Enrolled successfully! Check My Courses to start learning.')
      qc.invalidateQueries({ queryKey: ['my-courses'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Enrollment failed.'),
  })

  const paymentMutation = useMutation({
    mutationFn: () => createCoursePaymentOrder(slug),
    onSuccess: async (order) => {
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
            await verifyCoursePayment(slug, {
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

  function handleEnroll() {
    if (!isAuthenticated) { navigate('/login'); return }
    if (course.price > 0) { paymentMutation.mutate(); return }
    enrollMutation.mutate()
  }

  if (isLoading) return <Spinner center size="lg" style={{ marginTop: '4rem' }} />
  if (isError || !course) return (
    <div className={styles.errorState}>
      <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
      <p className={styles.errorText}>Course not found.</p>
      <Link to="/courses" className={styles.errorLink}>← Back to Courses</Link>
    </div>
  )

  const levelClass = LEVEL_CLASS[course.level] || styles.levelBeginner
  const levelLabel = LEVEL_LABEL[course.level] || 'Beginner'
  const isPending = enrollMutation.isPending || paymentMutation.isPending
  const totalLessons = course.modules?.reduce((s, m) => s + (m.lessons?.length || 0), 0) || 0

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Link to="/courses" className={styles.backLink}>
            <ArrowLeft size={15} /> Back to Courses
          </Link>

          <div className={styles.heroGrid}>
            <div>
              <div className={styles.badges}>
                {course.level && <span className={levelClass}>{levelLabel}</span>}
                {course.mode && (
                  <span className={styles.modeBadge}>
                    {MODE_ICON[course.mode]} {course.mode}
                  </span>
                )}
                {course.certificate_offered && (
                  <span className={styles.certBadge}>
                    <Award size={11} /> Certificate
                  </span>
                )}
              </div>

              <h1 className={styles.heroTitle}>{course.title}</h1>

              {course.description && (
                <p className={styles.heroDesc}>{course.description}</p>
              )}

              <div className={styles.heroStats}>
                {course.duration_weeks && (
                  <span className={styles.heroStatItem}>
                    <Clock size={14} /> {course.duration_weeks} week{course.duration_weeks > 1 ? 's' : ''}
                  </span>
                )}
                {totalLessons > 0 && (
                  <span className={styles.heroStatItem}>
                    <BookOpen size={14} /> {totalLessons} lessons
                  </span>
                )}
                {course.enrollment_count > 0 && (
                  <span className={styles.heroStatItem}>
                    <Users size={14} /> {course.enrollment_count.toLocaleString('en-IN')} enrolled
                  </span>
                )}
                {course.language && (
                  <span className={styles.heroStatItem}>
                    <Globe2 size={14} /> {course.language}
                  </span>
                )}
              </div>

              {course.instructor && (
                <div className={styles.heroInstructor}>
                  <UserCircle2 size={18} />
                  <span>Instructor: <strong style={{ color: 'white' }}>{course.instructor}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className={`container ${styles.mainBody}`}>
        <div className={styles.mainGrid}>

          {/* Left column */}
          <div>
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className={styles.thumbnail} />
            )}

            {course.what_you_learn?.length > 0 && (
              <section className={styles.learnSection}>
                <h2 className={styles.sectionTitle}>
                  <GraduationCap size={20} color="#059669" /> What You'll Learn
                </h2>
                <div className={styles.learnGrid}>
                  {course.what_you_learn.map((item, i) => (
                    <div key={i} className={styles.learnItem}>
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {course.prerequisites && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitleSm}>Prerequisites</h2>
                <p className={styles.prereqText}>{course.prerequisites}</p>
              </section>
            )}

            {course.target_audience && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitleSm}>Who Is This For?</h2>
                <p className={styles.targetText}>{course.target_audience}</p>
              </section>
            )}

            {course.modules?.length > 0 && (
              <section className={styles.section}>
                <div className={styles.curriculumHeader}>
                  <h2 className={styles.sectionTitleSm} style={{ marginBottom: 0 }}>Course Curriculum</h2>
                  <span className={styles.curriculumMeta}>
                    {course.modules.length} modules · {totalLessons} lessons
                  </span>
                </div>
                {course.modules.map((mod, i) => (
                  <ModuleAccordion key={mod.id} mod={mod} index={i} />
                ))}
              </section>
            )}

            {course.instructor && (
              <div className={styles.instructorCard}>
                <h2 className={styles.sectionTitleSm}>Your Instructor</h2>
                <div className={styles.instructorRow}>
                  <div className={styles.instructorAvatar}>
                    <span className={styles.instructorInitial}>{course.instructor[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className={styles.instructorName}>{course.instructor}</p>
                    {course.instructor_bio && <p className={styles.instructorBio}>{course.instructor_bio}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              {!course.thumbnail && (
                <div className={styles.sidebarPlaceholder}>
                  <BookOpen size={48} color="white" opacity={0.4} />
                </div>
              )}
              {course.thumbnail && (
                <img src={course.thumbnail} alt="" className={styles.sidebarThumb} />
              )}

              <div className={styles.sidebarBody}>
                <div className={styles.priceRow}>
                  {course.price === 0 ? (
                    <span className={styles.priceFree}>Free</span>
                  ) : (
                    <>
                      <IndianRupee size={20} strokeWidth={2.5} color="#0f172a" style={{ marginTop: 6 }} />
                      <span className={styles.pricePaid}>{course.price.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={isPending}
                  className={`${styles.enrollBtn} ${course.price > 0 ? styles.enrollBtnPaid : styles.enrollBtnFree}`}
                >
                  {isPending ? 'Please wait…' : !isAuthenticated ? 'Sign In to Enroll' : course.price > 0 ? <><IndianRupee size={16} /> Pay & Enroll</> : 'Enroll for Free'}
                </button>

                {course.price > 0 && (
                  <p className={styles.secureNote}>Secure payment via Razorpay</p>
                )}

                <div className={styles.highlights}>
                  {course.duration_weeks && (
                    <div className={styles.highlightItem}>
                      <Clock size={15} color="#2563eb" />
                      <span><strong>{course.duration_weeks} weeks</strong> duration</span>
                    </div>
                  )}
                  {course.mode && (
                    <div className={styles.highlightItem}>
                      {MODE_ICON[course.mode]}
                      <span>{course.mode.charAt(0) + course.mode.slice(1).toLowerCase()} learning</span>
                    </div>
                  )}
                  {totalLessons > 0 && (
                    <div className={styles.highlightItem}>
                      <BookOpen size={15} color="#2563eb" />
                      <span><strong>{totalLessons} lessons</strong> across {course.modules?.length} modules</span>
                    </div>
                  )}
                  {course.max_seats && (
                    <div className={styles.highlightItem}>
                      <Users size={15} color="#2563eb" />
                      <span>Max <strong>{course.max_seats}</strong> seats</span>
                    </div>
                  )}
                  {course.language && (
                    <div className={styles.highlightItem}>
                      <Globe2 size={15} color="#2563eb" />
                      <span>{course.language}</span>
                    </div>
                  )}
                  {course.certificate_offered && (
                    <div className={styles.highlightItemGreen}>
                      <BadgeCheck size={15} color="#059669" />
                      <span>Certificate on completion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className={styles.browseLinkWrap}>
              <Link to="/courses" className={styles.browseLink}>← Browse all courses</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
