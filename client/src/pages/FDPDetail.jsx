import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Calendar, MapPin, Users, GraduationCap, UserCircle2,
  IndianRupee, CheckCircle2, Clock, Award, AlertCircle, BookOpen,
  Share2, BadgeCheck,
} from 'lucide-react'
import { getFdp, registerFdp } from '../services/fdpService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import styles from './FDPDetail.module.css'

function fmt(iso, opts = {}) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', ...opts,
  })
}

function duration(start, end) {
  if (!start || !end) return null
  const days = Math.round((new Date(end) - new Date(start)) / 86400000)
  if (days === 0) return '1 day'
  return `${days + 1} day${days + 1 > 1 ? 's' : ''}`
}

export default function FDPDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: fdp, isLoading, isError } = useQuery({
    queryKey: ['fdp', id],
    queryFn: () => getFdp(id),
  })

  const registerMutation = useMutation({
    mutationFn: () => registerFdp(id),
    onSuccess: () => {
      toast.success('Registered! A confirmation will be sent to your email.')
      qc.invalidateQueries({ queryKey: ['fdp', id] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Registration failed.'),
  })

  function handleRegister() {
    if (!isAuthenticated) { navigate('/login'); return }
    registerMutation.mutate()
  }

  if (isLoading) return <Spinner center size="lg" style={{ marginTop: '4rem' }} />

  if (isError || !fdp) return (
    <div className={styles.errorState}>
      <GraduationCap size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
      <p className={styles.errorText}>Program not found.</p>
      <Link to="/fdp" className={styles.errorLink}>← Back to Programs</Link>
    </div>
  )

  const isPast = fdp.end_date && new Date(fdp.end_date) < new Date()
  const isFull = fdp.seats_remaining === 0
  const isLow = !isFull && fdp.seats_remaining <= Math.ceil((fdp.max_seats || 10) * 0.2)
  const hasFee = fdp.fee > 0
  const dur = duration(fdp.start_date, fdp.end_date)
  const seatsUsed = fdp.max_seats ? fdp.max_seats - (fdp.seats_remaining ?? fdp.max_seats) : 0
  const seatsPct = fdp.max_seats ? Math.round((seatsUsed / fdp.max_seats) * 100) : 0

  const seatsFillClass = isFull ? styles.seatsFillFull : isLow ? styles.seatsFillLow : styles.seatsFillNormal

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroInner}`}>
          <Link to="/fdp" className={styles.backLink}>
            <ArrowLeft size={15} /> All Programs
          </Link>

          <div className={styles.heroContent}>
            <div>
              <div className={styles.badges}>
                <span className={styles.fdpBadge}>
                  <GraduationCap size={11} /> Faculty Development
                </span>
                {hasFee && (
                  <span className={styles.feeBadge}>₹{fdp.fee.toLocaleString('en-IN')} Fee</span>
                )}
                {!hasFee && <span className={styles.freeBadge}>Free</span>}
                {isPast && <span className={styles.pastBadge}>Completed</span>}
                {!isPast && isFull && <span className={styles.fullBadge}>Fully Booked</span>}
                {!isPast && isLow && !isFull && (
                  <span className={styles.lowBadge}><AlertCircle size={11} /> Filling Fast</span>
                )}
              </div>

              <h1 className={styles.heroTitle}>{fdp.title}</h1>

              <div className={styles.metaStrip}>
                <span className={styles.metaItem}>
                  <Calendar size={15} /> {fmt(fdp.start_date, { month: 'short' })} – {fmt(fdp.end_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {dur && <span className={styles.metaItem}><Clock size={15} /> {dur}</span>}
                {fdp.venue && <span className={styles.metaItem}><MapPin size={15} /> {fdp.venue}</span>}
                {fdp.max_seats && <span className={styles.metaItem}><Users size={15} /> {fdp.max_seats} seats</span>}
              </div>

              {fdp.resource_person && (
                <div className={styles.resourcePerson}>
                  <UserCircle2 size={18} />
                  <span>Led by <strong style={{ color: 'white' }}>{fdp.resource_person}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`container ${styles.mainBody}`}>
        <div className={styles.mainGrid}>

          {/* Left column */}
          <div>
            {fdp.description && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>About This Program</h2>
                <p className={styles.description}>{fdp.description}</p>
              </section>
            )}

            <section className={styles.highlightsSection}>
              <h2 className={styles.highlightsTitle}>
                <BadgeCheck size={20} color="#059669" /> Program Highlights
              </h2>
              <div className={styles.highlightsGrid}>
                {[
                  'Completion Certificate', 'Expert-led Sessions', 'Hands-on Activities',
                  'Networking Opportunities', 'Resource Materials Included', 'Post-program Support',
                ].map((text) => (
                  <div key={text} className={styles.highlightItem}>
                    <CheckCircle2 size={15} color="#059669" /> {text}
                  </div>
                ))}
              </div>
            </section>

            {fdp.resource_person && (
              <section className={styles.resourceCard}>
                <h2 className={styles.sectionTitle}>Resource Person</h2>
                <div className={styles.resourceRow}>
                  <div className={styles.resourceAvatar}>
                    <span className={styles.resourceInitial}>{fdp.resource_person[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className={styles.resourceName}>{fdp.resource_person}</p>
                    <p className={styles.resourceRole}>Program Facilitator · Radiant Education Trust</p>
                  </div>
                </div>
              </section>
            )}

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Schedule</h2>
              <div className={styles.scheduleGrid}>
                {[
                  { label: 'Start Date', value: fmt(fdp.start_date), icon: <Calendar size={16} color="#d97706" /> },
                  { label: 'End Date', value: fmt(fdp.end_date), icon: <Calendar size={16} color="#d97706" /> },
                  { label: 'Duration', value: dur || '—', icon: <Clock size={16} color="#d97706" /> },
                  { label: 'Venue', value: fdp.venue || 'To be announced', icon: <MapPin size={16} color="#d97706" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className={styles.scheduleCard}>
                    <div className={styles.scheduleLabelRow}>
                      {icon}
                      <span className={styles.scheduleLabel}>{label}</span>
                    </div>
                    <p className={styles.scheduleValue}>{value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <div className={`${styles.sidebarHeader} ${isPast ? styles.sidebarHeaderPast : styles.sidebarHeaderActive}`}>
                  {hasFee ? (
                    <div>
                      <p className={`${styles.sidebarFeeLabel} ${isPast ? styles.sidebarFeeLabelPast : styles.sidebarFeeLabelActive}`}>
                        Registration Fee
                      </p>
                      <p className={`${styles.sidebarFeeAmount} ${isPast ? styles.sidebarFeeAmountPast : styles.sidebarFeeAmountActive}`}>
                        <IndianRupee size={20} strokeWidth={2.5} /> {fdp.fee.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className={`${styles.sidebarFeeLabel} ${isPast ? styles.sidebarFeeLabelPast : styles.sidebarFeeLabelActive}`}>
                        Registration
                      </p>
                      <p className={`${styles.sidebarFeeAmount} ${isPast ? styles.sidebarFeeAmountPast : styles.sidebarFeeAmountActive}`}>
                        Free
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.sidebarBody}>
                  {fdp.max_seats && !isPast && (
                    <div className={styles.seatsBar}>
                      <div className={styles.seatsInfo}>
                        <span className={isFull ? styles.seatsFull : isLow ? styles.seatsLow : styles.seatsNormal}>
                          {isFull ? 'Fully Booked' : `${fdp.seats_remaining} of ${fdp.max_seats} seats left`}
                        </span>
                        <span className={styles.seatsPct}>{seatsPct}% filled</span>
                      </div>
                      <div className={styles.seatsTrack}>
                        <div
                          className={`${styles.seatsFill} ${seatsFillClass}`}
                          style={{ width: `${seatsPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleRegister}
                    disabled={registerMutation.isPending || isFull || isPast}
                    className={`${styles.ctaBtn} ${isPast || isFull ? styles.ctaBtnDisabled : styles.ctaBtnActive}`}
                  >
                    {isPast ? 'Program Ended' : isFull ? 'Fully Booked' : registerMutation.isPending ? 'Registering…' : hasFee ? `Register — ₹${fdp.fee.toLocaleString('en-IN')}` : 'Register Free'}
                  </button>

                  <div className={styles.quickInfo}>
                    {[
                      { icon: <Calendar size={14} color="#d97706" />, text: fmt(fdp.start_date, { month: 'short' }) },
                      fdp.venue && { icon: <MapPin size={14} color="#d97706" />, text: fdp.venue },
                      fdp.max_seats && { icon: <Users size={14} color="#d97706" />, text: `${fdp.max_seats} seats total` },
                      { icon: <Award size={14} color="#059669" />, text: 'Certificate on completion', green: true },
                    ].filter(Boolean).map(({ icon, text, green }) => (
                      <div key={text} className={green ? styles.quickInfoItemGreen : styles.quickInfoItem}>
                        {icon} {text}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigator.share
                      ? navigator.share({ title: fdp.title, url: window.location.href })
                      : navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied!'))}
                    className={styles.shareBtn}
                  >
                    <Share2 size={14} /> Share Program
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
