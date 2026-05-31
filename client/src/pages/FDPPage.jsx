import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Calendar, MapPin, Users, GraduationCap } from 'lucide-react'
import { getFdps, registerFdp } from '../services/fdpService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'

export default function FDPPage() {
  const [page, setPage] = useState(1)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['fdps', page],
    queryFn: () => getFdps(page, 8),
  })

  const registerMutation = useMutation({
    mutationFn: (fdpId) => registerFdp(fdpId),
    onSuccess: () => toast.success('Registered successfully! Check your email for confirmation.'),
    onError: (err) => toast.error(err?.response?.data?.message || 'Registration failed.'),
  })

  function handleRegister(fdpId) {
    if (!isAuthenticated) { navigate('/login'); return }
    registerMutation.mutate(fdpId)
  }

  const fdps = data?.items || []
  const pages = data?.pages || 1

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#d97706)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <p className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Professional Development</p>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 700, margin: '0.5rem 0' }}>Faculty Development Programs</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '36rem', margin: '0 auto' }}>
            Capacity-building workshops and training sessions for educators.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1rem' }}>
        {isLoading && <Spinner center size="lg" />}
        {isError && <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load programs.</p>}
        {!isLoading && fdps.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No upcoming FDP programs at the moment.</p>
        )}
        {!isLoading && fdps.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
            {fdps.map((fdp) => (
              <div key={fdp.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column' }}>
                <GraduationCap size={32} color="#d97706" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>{fdp.title}</h3>
                {fdp.description && <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem', flexGrow: 1 }}>{fdp.description}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.83rem', color: '#475569' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(fdp.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} — {new Date(fdp.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
                  {fdp.venue && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {fdp.venue}</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {fdp.seats_remaining ?? fdp.max_seats} seats remaining</span>
                </div>
                <button
                  onClick={() => handleRegister(fdp.id)}
                  disabled={registerMutation.isPending || fdp.seats_remaining === 0}
                  style={{ width: '100%', padding: '0.7rem', background: fdp.seats_remaining === 0 ? '#e2e8f0' : '#d97706', color: fdp.seats_remaining === 0 ? '#94a3b8' : 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: fdp.seats_remaining === 0 ? 'not-allowed' : 'pointer' }}
                >
                  {fdp.seats_remaining === 0 ? 'Fully Booked' : registerMutation.isPending ? 'Registering…' : 'Register Now'}
                </button>
              </div>
            ))}
          </div>
        )}
        <Pagination page={page} pages={pages} onPage={setPage} />
      </div>
    </div>
  )
}
