import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Calendar, MapPin, Users, GraduationCap, UserCircle2,
  IndianRupee, CheckCircle2, Clock, Award, AlertCircle, BookOpen,
  Share2, BadgeCheck, Building2,
} from 'lucide-react'
import { getFdp, registerFdp } from '../services/fdpService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'

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
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <GraduationCap size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
      <p style={{ color: '#ef4444', fontWeight: 600 }}>Program not found.</p>
      <Link to="/fdp" style={{ color: 'var(--clr-primary)', marginTop: '0.5rem', display: 'inline-block' }}>← Back to Programs</Link>
    </div>
  )

  const isPast = fdp.end_date && new Date(fdp.end_date) < new Date()
  const isFull = fdp.seats_remaining === 0
  const isLow = !isFull && fdp.seats_remaining <= Math.ceil((fdp.max_seats || 10) * 0.2)
  const hasFee = fdp.fee > 0
  const dur = duration(fdp.start_date, fdp.end_date)
  const seatsUsed = fdp.max_seats ? fdp.max_seats - (fdp.seats_remaining ?? fdp.max_seats) : 0
  const seatsPct = fdp.max_seats ? Math.round((seatsUsed / fdp.max_seats) * 100) : 0

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#92400e 100%)', color: 'white', padding: '3rem 0 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 40%, rgba(251,191,36,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ maxWidth: 1100, position: 'relative' }}>
          <Link to="/fdp" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={15} /> All Programs
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', paddingBottom: '2.5rem' }}>
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GraduationCap size={11} /> Faculty Development
                </span>
                {hasFee && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                    ₹{fdp.fee.toLocaleString('en-IN')} Fee
                  </span>
                )}
                {!hasFee && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }}>Free</span>
                )}
                {isPast && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Completed</span>}
                {!isPast && isFull && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>Fully Booked</span>}
                {!isPast && isLow && !isFull && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: 'rgba(245,158,11,0.25)', color: '#fcd34d', display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} /> Filling Fast</span>}
              </div>

              <h1 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem', color: 'white' }}>
                {fdp.title}
              </h1>

              {/* Meta strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={15} /> {fmt(fdp.start_date, { month: 'short' })} – {fmt(fdp.end_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {dur && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={15} /> {dur}</span>}
                {fdp.venue && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={15} /> {fdp.venue}</span>}
                {fdp.max_seats && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={15} /> {fdp.max_seats} seats</span>}
              </div>

              {fdp.resource_person && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '1.25rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                  <UserCircle2 size={18} />
                  <span>Led by <strong style={{ color: 'white' }}>{fdp.resource_person}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container" style={{ maxWidth: 1100, padding: '2.5rem 1rem' }}>
        <style>{`.fdp-grid{display:grid;grid-template-columns:1fr;gap:2rem}@media(min-width:900px){.fdp-grid{grid-template-columns:1fr 320px}}`}</style>
        <div className="fdp-grid">

          {/* Left column */}
          <div>
            {fdp.description && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.875rem' }}>About This Program</h2>
                <p style={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{fdp.description}</p>
              </section>
            )}

            {/* Program highlights */}
            <section style={{ marginBottom: '2rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <BadgeCheck size={20} color="#059669" /> Program Highlights
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '0.6rem' }}>
                {[
                  { icon: <CheckCircle2 size={15} color="#059669" />, text: 'Completion Certificate' },
                  { icon: <CheckCircle2 size={15} color="#059669" />, text: 'Expert-led Sessions' },
                  { icon: <CheckCircle2 size={15} color="#059669" />, text: 'Hands-on Activities' },
                  { icon: <CheckCircle2 size={15} color="#059669" />, text: 'Networking Opportunities' },
                  { icon: <CheckCircle2 size={15} color="#059669" />, text: 'Resource Materials Included' },
                  { icon: <CheckCircle2 size={15} color="#059669" />, text: 'Post-program Support' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#166534' }}>
                    {icon} {text}
                  </div>
                ))}
              </div>
            </section>

            {/* Resource person detail */}
            {fdp.resource_person && (
              <section style={{ marginBottom: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Resource Person</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#d97706,#92400e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem' }}>{fdp.resource_person[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1rem' }}>{fdp.resource_person}</p>
                    <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>Program Facilitator · Radiant Education Trust</p>
                  </div>
                </div>
              </section>
            )}

            {/* Hotel & Accommodation */}
            {fdp.hotel_info && (
              <section style={{ marginBottom: '2rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building2 size={20} color="#2563eb" /> Hotel & Accommodation
                </h2>
                <p style={{ color: '#1e40af', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.9rem' }}>{fdp.hotel_info}</p>
              </section>
            )}

            {/* Schedule */}
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Schedule</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
                {[
                  { label: 'Start Date', value: fmt(fdp.start_date), icon: <Calendar size={16} color="#d97706" /> },
                  { label: 'End Date', value: fmt(fdp.end_date), icon: <Calendar size={16} color="#d97706" /> },
                  { label: 'Duration', value: dur || '—', icon: <Clock size={16} color="#d97706" /> },
                  { label: 'Venue', value: fdp.venue || 'To be announced', icon: <MapPin size={16} color="#d97706" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: 10, padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>{icon}<span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span></div>
                    <p style={{ fontWeight: 600, color: '#0f172a', margin: 0, fontSize: '0.9rem' }}>{value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky sidebar */}
          <div>
            <style>{`.fdp-sidebar{position:sticky;top:88px}@media(max-width:899px){.fdp-sidebar{position:static}}`}</style>
            <div className="fdp-sidebar">
              <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ background: isPast ? '#f1f5f9' : 'linear-gradient(135deg,#d97706,#b45309)', padding: '1.25rem', textAlign: 'center' }}>
                  {hasFee ? (
                    <div>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: isPast ? '#94a3b8' : 'rgba(255,255,255,0.8)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>Registration Fee</p>
                      <p style={{ fontSize: '2rem', fontWeight: 900, color: isPast ? '#94a3b8' : 'white', margin: '4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <IndianRupee size={20} strokeWidth={2.5} /> {fdp.fee.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: isPast ? '#94a3b8' : 'rgba(255,255,255,0.8)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>Registration</p>
                      <p style={{ fontSize: '2rem', fontWeight: 900, color: isPast ? '#94a3b8' : 'white', margin: '4px 0 0' }}>Free</p>
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.25rem' }}>
                  {/* Seats progress */}
                  {fdp.max_seats && !isPast && (
                    <div style={{ marginBottom: '1.1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                        <span style={{ color: isFull ? '#dc2626' : '#475569', fontWeight: isFull || isLow ? 700 : 400 }}>
                          {isFull ? 'Fully Booked' : `${fdp.seats_remaining} of ${fdp.max_seats} seats left`}
                        </span>
                        <span style={{ color: '#94a3b8' }}>{seatsPct}% filled</span>
                      </div>
                      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${seatsPct}%`, background: isFull ? '#dc2626' : isLow ? '#f59e0b' : '#22c55e', borderRadius: 99 }} />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={handleRegister}
                    disabled={registerMutation.isPending || isFull || isPast}
                    style={{
                      width: '100%', padding: '0.9rem',
                      background: isPast || isFull ? '#f1f5f9' : 'linear-gradient(135deg,#d97706,#b45309)',
                      color: isPast || isFull ? '#94a3b8' : 'white',
                      border: 'none', borderRadius: 10,
                      fontWeight: 700, fontSize: '0.975rem',
                      cursor: isPast || isFull ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isPast ? 'Program Ended' : isFull ? 'Fully Booked' : registerMutation.isPending ? 'Registering…' : hasFee ? `Register — ₹${fdp.fee.toLocaleString('en-IN')}` : 'Register Free'}
                  </button>

                  {/* Quick info */}
                  <div style={{ marginTop: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      { icon: <Calendar size={14} color="#d97706" />, text: fmt(fdp.start_date, { month: 'short' }) },
                      fdp.venue && { icon: <MapPin size={14} color="#d97706" />, text: fdp.venue },
                      fdp.max_seats && { icon: <Users size={14} color="#d97706" />, text: `${fdp.max_seats} seats total` },
                      { icon: <Award size={14} color="#059669" />, text: 'Certificate on completion', green: true },
                    ].filter(Boolean).map(({ icon, text, green }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: green ? '#059669' : '#475569', fontWeight: green ? 600 : 400 }}>
                        {icon} {text}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigator.share ? navigator.share({ title: fdp.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied!'))}
                    style={{ width: '100%', marginTop: '1rem', padding: '0.65rem', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 9, fontWeight: 600, fontSize: '0.82rem', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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
