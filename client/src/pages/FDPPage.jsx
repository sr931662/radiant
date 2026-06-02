import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Calendar, MapPin, Users, GraduationCap, Clock, UserCircle2,
  IndianRupee, CheckCircle2, AlertCircle, Wifi, WifiOff,
} from 'lucide-react'
import { getFdps, registerFdp } from '../services/fdpService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'

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
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: low ? '#dc2626' : '#475569', marginBottom: 4, fontWeight: low ? 700 : 400 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {low && <AlertCircle size={12} />}
          {remaining === 0 ? 'Fully Booked' : `${remaining} seat${remaining !== 1 ? 's' : ''} left`}
        </span>
        <span>{pct}% filled</span>
      </div>
      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: low ? '#dc2626' : '#22c55e', borderRadius: 99, transition: 'width 0.4s' }} />
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
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#92400e 100%)', padding: '4.5rem 0 3.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, rgba(251,191,36,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 99, padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <GraduationCap size={13} /> Professional Development
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2 }}>Faculty Development Programs</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '540px', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '2rem' }}>
            Capacity-building workshops, certification programs and hands-on training sessions designed for educators and school administrators.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { icon: <CheckCircle2 size={16} />, text: 'Completion Certificate' },
              { icon: <Users size={16} />, text: 'Expert-led Sessions' },
              { icon: <Calendar size={16} />, text: 'Flexible Schedules' },
            ].map(({ icon, text }) => (
              <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{icon}{text}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding: '3rem 1rem' }}>
        {isLoading && <Spinner center size="lg" />}
        {isError && <p style={{ textAlign: 'center', color: '#ef4444', padding: '2rem' }}>Failed to load programs.</p>}

        {!isLoading && fdps.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
            <GraduationCap size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No upcoming FDP programs right now.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Check back soon — new programs are added regularly.</p>
          </div>
        )}

        {!isLoading && fdps.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.5rem' }}>
            {fdps.map((fdp) => {
              const isFull = fdp.seats_remaining === 0
              const isLow = fdp.seats_remaining > 0 && fdp.seats_remaining <= Math.ceil((fdp.max_seats || 10) * 0.2)
              const isPast = new Date(fdp.end_date) < new Date()
              const hasFee = fdp.fee > 0

              return (
                <div key={fdp.id} style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9', transition: 'box-shadow 0.2s, transform 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = '' }}
                >
                  {/* Color header bar */}
                  <div style={{ height: 6, background: isFull || isPast ? '#e2e8f0' : isLow ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#d97706,#2563eb)' }} />

                  <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Top badges */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                      {hasFee && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '3px 9px', borderRadius: 99 }}>
                          <IndianRupee size={10} />{fdp.fee.toLocaleString('en-IN')} fee
                        </span>
                      )}
                      {!hasFee && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '3px 9px', borderRadius: 99 }}>Free</span>
                      )}
                      {isPast && <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#f1f5f9', color: '#94a3b8', padding: '3px 9px', borderRadius: 99 }}>Completed</span>}
                      {!isPast && isFull && <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#fee2e2', color: '#dc2626', padding: '3px 9px', borderRadius: 99 }}>Fully Booked</span>}
                      {!isPast && isLow && !isFull && <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#fff7ed', color: '#c2410c', padding: '3px 9px', borderRadius: 99 }}>Filling Fast</span>}
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, marginBottom: '0.625rem' }}>{fdp.title}</h3>

                    {fdp.description && (
                      <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {fdp.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.84rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#475569' }}>
                        <Calendar size={14} color="#d97706" style={{ flexShrink: 0 }} />
                        <span>{formatDate(fdp.start_date, { month: 'short' })}
                          {fdp.end_date && ` – ${formatDate(fdp.end_date, { day: 'numeric', month: 'short' })}`}
                        </span>
                      </div>
                      {fdp.venue && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#475569' }}>
                          <MapPin size={14} color="#d97706" style={{ flexShrink: 0 }} />
                          <span>{fdp.venue}</span>
                        </div>
                      )}
                      {fdp.resource_person && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#475569' }}>
                          <UserCircle2 size={14} color="#d97706" style={{ flexShrink: 0 }} />
                          <span>By <strong>{fdp.resource_person}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Seats progress bar */}
                    {fdp.max_seats && !isPast && (
                      <div style={{ marginBottom: '1.1rem' }}>
                        <SeatsBar remaining={fdp.seats_remaining ?? fdp.max_seats} max={fdp.max_seats} />
                      </div>
                    )}

                    <div style={{ marginTop: 'auto' }}>
                      <button
                        onClick={() => handleRegister(fdp.id)}
                        disabled={registerMutation.isPending || isFull || isPast}
                        style={{
                          width: '100%', padding: '0.75rem',
                          background: isFull || isPast ? '#f1f5f9' : 'linear-gradient(135deg,#d97706,#b45309)',
                          color: isFull || isPast ? '#94a3b8' : 'white',
                          border: 'none', borderRadius: '9px', fontWeight: 700, fontSize: '0.95rem',
                          cursor: isFull || isPast ? 'not-allowed' : 'pointer',
                          transition: 'opacity 0.15s',
                        }}
                      >
                        {isPast ? 'Program Ended' : isFull ? 'Fully Booked' : registerMutation.isPending ? 'Registering…' : hasFee ? `Register — ₹${fdp.fee.toLocaleString('en-IN')}` : 'Register Free'}
                      </button>
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
