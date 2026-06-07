import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Calendar, MapPin, Users, GraduationCap, Clock, UserCircle2,
  IndianRupee, CheckCircle2, AlertCircle, ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getFdps, registerFdp } from '../services/fdpService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'
import styles from './FDPPage.module.css'

function formatDate(iso, opts = {}) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', ...opts })
}

function SeatsBar({ remaining, max }) {
  if (!max) return null
  const pct = Math.round(((max - remaining) / max) * 100)
  const low = remaining <= Math.ceil(max * 0.2)
  return (
    <div>
      <div className={styles.seatsInfo}>
        <span className={`${low ? styles.seatsLabelLow : styles.seatsLabelNormal}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {low && <AlertCircle size={12} />}
          {remaining === 0 ? 'Fully Booked' : `${remaining} seat${remaining !== 1 ? 's' : ''} left`}
        </span>
        <span className={styles.seatsPct}>{pct}% filled</span>
      </div>
      <div className={styles.seatsTrack}>
        <div
          className={`${styles.seatsFill} ${low ? styles.seatsFillLow : styles.seatsFillNormal}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function FDPPage() {
  const [page, setPage] = useState(1)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['fdps', page],
    queryFn: () => getFdps(page, 8),
  })

  const registerMutation = useMutation({
    mutationFn: (fdpId) => registerFdp(fdpId),
    onSuccess: () => {
      toast.success('Registered! A confirmation email will be sent shortly.')
      qc.invalidateQueries({ queryKey: ['fdps'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Registration failed.'),
  })

  function handleRegister(fdpId) {
    if (!isAuthenticated) { navigate('/login'); return }
    registerMutation.mutate(fdpId)
  }

  const fdps = data?.items || []

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroBadge}>
            <GraduationCap size={13} /> Professional Development
          </div>
          <h1 className={styles.heroTitle}>Faculty Development Programs</h1>
          <p className={styles.heroDesc}>
            Capacity-building workshops, certification programs and hands-on training sessions designed for educators and school administrators.
          </p>
          <div className={styles.heroFeatures}>
            {[
              { icon: <CheckCircle2 size={16} />, text: 'Completion Certificate' },
              { icon: <Users size={16} />, text: 'Expert-led Sessions' },
              { icon: <Calendar size={16} />, text: 'Flexible Schedules' },
            ].map(({ icon, text }) => (
              <span key={text} className={styles.heroFeatureItem}>{icon}{text}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={`container ${styles.body}`}>
        {isLoading && <Spinner center size="lg" />}
        {isError && <p className={styles.errorMsg}>Failed to load programs.</p>}

        {!isLoading && fdps.length === 0 && (
          <div className={styles.emptyState}>
            <GraduationCap size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p className={styles.emptyTitle}>No upcoming FDP programs right now.</p>
            <p className={styles.emptySubtitle}>Check back soon — new programs are added regularly.</p>
          </div>
        )}

        {!isLoading && fdps.length > 0 && (
          <div className={styles.grid}>
            {fdps.map((fdp) => {
              const isFull = fdp.seats_remaining === 0
              const isLow = fdp.seats_remaining > 0 && fdp.seats_remaining <= Math.ceil((fdp.max_seats || 10) * 0.2)
              const isPast = new Date(fdp.end_date) < new Date()
              const hasFee = fdp.fee > 0

              const barBg = isFull || isPast
                ? '#e2e8f0'
                : isLow
                  ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
                  : 'linear-gradient(90deg,#d97706,#2563eb)'

              return (
                <div key={fdp.id} className={styles.card}>
                  <div className={styles.cardBar} style={{ background: barBg }} />

                  <div className={styles.cardBody}>
                    <div className={styles.badges}>
                      {hasFee && (
                        <span className={styles.feeBadge}>
                          <IndianRupee size={10} />{fdp.fee.toLocaleString('en-IN')} fee
                        </span>
                      )}
                      {!hasFee && <span className={styles.freeBadge}>Free</span>}
                      {isPast && <span className={styles.pastBadge}>Completed</span>}
                      {!isPast && isFull && <span className={styles.fullBadge}>Fully Booked</span>}
                      {!isPast && isLow && !isFull && <span className={styles.lowBadge}>Filling Fast</span>}
                    </div>

                    <h3 className={styles.cardTitle}>{fdp.title}</h3>

                    {fdp.description && (
                      <p className={styles.cardDesc}>{fdp.description}</p>
                    )}

                    <div className={styles.metaList}>
                      <div className={styles.metaItem}>
                        <Calendar size={14} color="#d97706" style={{ flexShrink: 0 }} />
                        <span>
                          {formatDate(fdp.start_date, { month: 'short' })}
                          {fdp.end_date && ` – ${formatDate(fdp.end_date, { day: 'numeric', month: 'short' })}`}
                        </span>
                      </div>
                      {fdp.venue && (
                        <div className={styles.metaItem}>
                          <MapPin size={14} color="#d97706" style={{ flexShrink: 0 }} />
                          <span>{fdp.venue}</span>
                        </div>
                      )}
                      {fdp.resource_person && (
                        <div className={styles.metaItem}>
                          <UserCircle2 size={14} color="#d97706" style={{ flexShrink: 0 }} />
                          <span>By <strong>{fdp.resource_person}</strong></span>
                        </div>
                      )}
                    </div>

                    {fdp.max_seats && !isPast && (
                      <div className={styles.seatsWrap}>
                        <SeatsBar remaining={fdp.seats_remaining ?? fdp.max_seats} max={fdp.max_seats} />
                      </div>
                    )}

                    <div className={styles.actions}>
                      <button
                        onClick={() => handleRegister(fdp.id)}
                        disabled={registerMutation.isPending || isFull || isPast}
                        className={`${styles.registerBtn} ${isFull || isPast ? styles.registerBtnDisabled : styles.registerBtnActive}`}
                      >
                        {isPast ? 'Program Ended' : isFull ? 'Fully Booked' : registerMutation.isPending ? 'Registering…' : hasFee ? `Register — ₹${fdp.fee.toLocaleString('en-IN')}` : 'Register Free'}
                      </button>
                      <Link to={`/fdp/${fdp.id}`} className={styles.detailsLink}>
                        View Details <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Pagination page={page} pages={data?.pages || 1} onPage={setPage} />
      </div>
    </div>
  )
}
