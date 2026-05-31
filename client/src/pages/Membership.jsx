import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Award } from 'lucide-react'
import { getPlans, applyMembership } from '../services/membershipService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'

export default function Membership() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data: plans = [], isLoading, isError } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: getPlans,
  })

  const applyMutation = useMutation({
    mutationFn: (plan_id) => applyMembership(plan_id),
    onSuccess: () => toast.success('Membership application submitted! We will review and approve shortly.'),
    onError: (err) => toast.error(err?.response?.data?.message || 'Application failed.'),
  })

  function handleApply(planId) {
    if (!isAuthenticated) { navigate('/login'); return }
    applyMutation.mutate(planId)
  }

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#7c3aed)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <p className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Join the Community</p>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 700, margin: '0.5rem 0' }}>Membership Plans</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '36rem', margin: '0 auto' }}>
            Become a member and get access to exclusive benefits, certificates, and community events.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1rem' }}>
        {isLoading && <Spinner center size="lg" />}
        {isError && <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load membership plans.</p>}
        {!isLoading && plans.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No membership plans available at the moment.</p>
        )}
        {!isLoading && plans.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {plans.map((plan) => {
              const benefits = plan.benefits
                ? (typeof plan.benefits === 'object' ? Object.values(plan.benefits) : [])
                : []
              return (
                <div key={plan.id} style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid transparent', transition: 'border-color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--clr-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <Award size={32} color="#7c3aed" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>{plan.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>{plan.type} · {plan.duration_days} days validity</p>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                  </div>
                  {benefits.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {benefits.map((b, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#374151' }}>
                          <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} /> {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => handleApply(plan.id)}
                    disabled={applyMutation.isPending}
                    style={{ width: '100%', padding: '0.75rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {applyMutation.isPending ? 'Applying…' : 'Apply for Membership'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
