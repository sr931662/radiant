import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  CheckCircle2, Award, Star, Users, BookOpen, Handshake,
  Shield, Heart, X, FileText, ChevronRight
} from 'lucide-react'
import { getPlans, applyMembership } from '../services/membershipService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'

const MEMBERSHIP_BENEFITS = [
  'Participation in the social, educational, and welfare activities of the Trust.',
  'Opportunity to contribute to community development and nation-building initiatives.',
  'Access to seminars, workshops, training programs, and awareness campaigns organized by the Trust.',
  'Networking opportunities with professionals, educators, researchers, social workers, and community leaders.',
  'Eligibility to volunteer and participate in Trust projects and outreach programs.',
  'Regular updates on Trust activities, events, and development initiatives.',
  'Opportunity to contribute ideas and suggestions for welfare and educational programs.',
  'Recognition and appreciation for outstanding contributions to the Trust\'s objectives.',
  'Participation in meetings, subject to the rules and regulations of the Trust.',
  'Support for skill development, education, research, and community welfare initiatives.',
  'Opportunity to serve on committees, project teams, and advisory groups of the Trust.',
  'Certificate of Membership issued by the Trust.',
  'Access to selected educational, career guidance, and community service programs conducted by the Trust.',
  'Contribution toward social welfare, education, women empowerment, youth development, environmental protection, and other charitable activities.',
  'Satisfaction of being associated with a registered charitable organization working for public welfare.',
]

const BENEFIT_ICONS = [
  Heart, Users, BookOpen, Handshake, Shield,
  Star, FileText, Award, Users, BookOpen,
  Handshake, Award, BookOpen, Heart, Star,
]

const MEMBERSHIP_TYPES = [
  { label: 'Annual Member', price: '₹1,100', color: '#0f172a', bg: '#f8fafc', border: '#e2e8f0', highlight: false },
  { label: 'Life Member', price: '₹5,000', color: '#7c3aed', bg: '#faf5ff', border: '#c4b5fd', highlight: true },
  { label: 'Student Member', price: '₹500', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', highlight: false },
]

const FORM_FIELDS = {
  personal: [
    { name: 'fullName', label: 'Full Name', required: true, type: 'text' },
    { name: 'fatherHusbandName', label: "Father's / Husband's Name", required: false, type: 'text' },
    { name: 'dob', label: 'Date of Birth', required: false, type: 'date' },
    { name: 'occupation', label: 'Occupation', required: false, type: 'text' },
    { name: 'organization', label: 'Organization / Company', required: false, type: 'text' },
  ],
  contact: [
    { name: 'address', label: 'Address', required: true, type: 'text' },
    { name: 'city', label: 'City', required: true, type: 'text' },
    { name: 'state', label: 'State', required: false, type: 'text' },
    { name: 'pinCode', label: 'PIN Code', required: false, type: 'text' },
    { name: 'mobile', label: 'Mobile No.', required: true, type: 'tel' },
    { name: 'alternateMobile', label: 'Alternate Mobile No.', required: false, type: 'tel' },
    { name: 'email', label: 'Email ID', required: true, type: 'email' },
  ],
  nominee: [
    { name: 'nomineeName', label: 'Name of Nominee', required: false, type: 'text' },
    { name: 'nomineeRelationship', label: 'Relationship', required: false, type: 'text' },
    { name: 'nomineeMobile', label: 'Mobile No.', required: false, type: 'tel' },
  ],
}

function MembershipFormModal({ plan, onClose, onSubmit, isPending }) {
  const { user } = useAuth()
  const [gender, setGender] = useState('')
  const [memberCategory, setMemberCategory] = useState(
    plan?.name?.toLowerCase().includes('life') ? 'Life Member'
      : plan?.name?.toLowerCase().includes('student') ? 'Student Member'
      : 'Annual Member'
  )
  const [declared, setDeclared] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.full_name || user?.name || '',
    email: user?.email || '',
    mobile: user?.phone || '',
    fatherHusbandName: '', dob: '', occupation: '', organization: '',
    address: '', city: '', state: '', pinCode: '', alternateMobile: '',
    nomineeName: '', nomineeRelationship: '', nomineeMobile: '',
  })

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!declared) { toast.error('Please accept the declaration to proceed.'); return }
    onSubmit()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', overflowY: 'auto',
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '100%', maxWidth: '680px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#1e3a5f,#7c3aed)', padding: '1.5rem 2rem',
          borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              RADIANT EDUCATION TRUST
            </p>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>
              Membership Application Form (B)
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Selected Plan Banner */}
        <div style={{ background: '#faf5ff', borderBottom: '1px solid #e9d5ff', padding: '0.9rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award size={20} color="#7c3aed" />
          <div>
            <span style={{ fontWeight: 700, color: '#4c1d95' }}>{plan?.name}</span>
            <span style={{ color: '#7c3aed', fontSize: '0.88rem', marginLeft: '0.75rem' }}>
              {plan?.price === 0 ? 'Free' : `₹${plan?.price?.toLocaleString('en-IN')}`}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.78rem', marginLeft: '0.5rem' }}>· {plan?.duration_days} days validity</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* 1. Personal Details */}
          <SectionTitle number="1" title="Personal Details" />
          <div style={gridStyle(2)}>
            {FORM_FIELDS.personal.map(({ name, label, required, type }) => (
              <FormField key={name} name={name} label={label} required={required} type={type}
                value={formData[name]} onChange={handleChange} />
            ))}
            <div>
              <label style={labelStyle}>Gender</label>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.35rem' }}>
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.88rem', color: '#374151' }}>
                    <input type="radio" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)} /> {g}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Contact Details */}
          <SectionTitle number="2" title="Contact Details" />
          <div style={gridStyle(2)}>
            {FORM_FIELDS.contact.map(({ name, label, required, type }) => (
              <FormField key={name} name={name} label={label} required={required} type={type}
                value={formData[name]} onChange={handleChange} />
            ))}
          </div>

          {/* 3. Membership Category */}
          <SectionTitle number="3" title="Membership Category" />
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {['Annual Member', 'Life Member', 'Student Member'].map(cat => (
              <label key={cat} style={{
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid',
                borderColor: memberCategory === cat ? '#7c3aed' : '#e2e8f0',
                background: memberCategory === cat ? '#faf5ff' : 'white',
                color: memberCategory === cat ? '#4c1d95' : '#374151',
                fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.15s',
              }}>
                <input type="radio" name="memberCategory" value={cat} checked={memberCategory === cat}
                  onChange={() => setMemberCategory(cat)} style={{ display: 'none' }} />
                {memberCategory === cat && <CheckCircle2 size={14} color="#7c3aed" />} {cat}
              </label>
            ))}
          </div>

          {/* 4. Educational Qualification */}
          <SectionTitle number="4" title="Educational Qualification" />
          <div style={gridStyle(2)}>
            <FormField name="qualification" label="Highest Qualification" type="text" value={formData.qualification || ''} onChange={handleChange} />
            <FormField name="institution" label="Institution" type="text" value={formData.institution || ''} onChange={handleChange} />
          </div>

          {/* 5. Nominee Details */}
          <SectionTitle number="5" title="Nominee Details" />
          <div style={gridStyle(3)}>
            {FORM_FIELDS.nominee.map(({ name, label, required, type }) => (
              <FormField key={name} name={name} label={label} required={required} type={type}
                value={formData[name]} onChange={handleChange} />
            ))}
          </div>

          {/* 6. Declaration */}
          <SectionTitle number="6" title="Declaration" />
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              I hereby declare that the information furnished above is true and correct to the best of my knowledge.
              I agree to abide by the rules, regulations, objectives, and policies of Radiant Education Trust.
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#1e3a5f' }}>
              <input type="checkbox" checked={declared} onChange={e => setDeclared(e.target.checked)}
                style={{ marginTop: '2px', accentColor: '#7c3aed' }} />
              I accept the above declaration and agree to the Trust's policies.
            </label>
          </div>

          {/* Note */}
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Note: Membership fee is non-refundable. Your application will be reviewed and approved by the Trust office.
          </p>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              style={{ flex: 2, padding: '0.75rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isPending ? 'Submitting…' : <><FileText size={16} /> Submit Application</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SectionTitle({ number, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.9rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
      <span style={{ background: '#1e3a5f', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
        {number}
      </span>
      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1e3a5f' }}>{title}</h4>
    </div>
  )
}

function FormField({ name, label, required, type, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444' }}>*</span>}</label>
      <input name={name} type={type} required={required} value={value} onChange={onChange} style={inputStyle} />
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }
const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '0.875rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }
function gridStyle(cols) {
  return { display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${cols === 3 ? '160px' : '220px'},1fr))`, gap: '1rem', marginBottom: '1.5rem' }
}

export default function Membership() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)

  const { data: plans = [], isLoading, isError } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: getPlans,
  })

  const applyMutation = useMutation({
    mutationFn: (plan_id) => applyMembership(plan_id),
    onSuccess: () => {
      toast.success('Membership application submitted! We will review and approve shortly.')
      setSelectedPlan(null)
    },
    onError: (err) => {
      const status = err?.response?.status
      const msg = err?.response?.data?.message
      if (status === 401) {
        toast.error('Session expired. Please login again.')
        setSelectedPlan(null)
        navigate('/login')
      } else if (msg?.toLowerCase().includes('already')) {
        toast.error('You have already applied for this membership. Please wait for approval.')
        setSelectedPlan(null)
      } else {
        toast.error(msg || 'Application failed. Please try again.')
      }
    },
  })

  function handleApply(plan) {
    if (!isAuthenticated) {
      toast.error('Please login first to apply for membership.')
      navigate('/login')
      return
    }
    setSelectedPlan(plan)
  }

  function handleFormSubmit() {
    if (!isAuthenticated) {
      toast.error('Session expired. Please login again.')
      navigate('/login')
      return
    }
    applyMutation.mutate(selectedPlan.id)
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#7c3aed)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
            Join the Community
          </p>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, margin: '0.5rem 0' }}>Become a Member</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '40rem', margin: '0 auto 1.5rem' }}>
            Join Radiant Education Trust and be part of a growing community dedicated to education,
            empowerment, and social welfare. Together we build a better future.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            "Together for Education, Empowerment, and Social Welfare."
          </p>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="container" style={{ padding: '3.5rem 1rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.4rem' }}>
            Choose Your Plan
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Membership Plans
          </h2>
          <p style={{ color: '#64748b', maxWidth: '34rem', margin: '0 auto' }}>
            Select the membership category that best suits you. All memberships include a Certificate of Membership from the Trust.
          </p>
        </div>

        {/* Login nudge for guests */}
        {!isAuthenticated && (
          <div style={{ maxWidth: '600px', margin: '0 auto 2rem', background: '#faf5ff', border: '1.5px solid #c4b5fd', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
            <Award size={22} color="#7c3aed" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#4c1d95', fontSize: '0.9rem' }}>Login required to apply</p>
              <p style={{ margin: 0, color: '#6d28d9', fontSize: '0.82rem' }}>Create a free account or login to submit your membership application.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => navigate('/login')} style={{ padding: '0.45rem 1rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '7px', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>Login</button>
              <button onClick={() => navigate('/register')} style={{ padding: '0.45rem 1rem', background: 'white', color: '#7c3aed', border: '1.5px solid #c4b5fd', borderRadius: '7px', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>Register</button>
            </div>
          </div>
        )}

        {isLoading && <Spinner center size="lg" />}
        {isError && <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load membership plans.</p>}

        {/* Plans not yet seeded — admin needs to run seed script */}
        {!isLoading && !isError && plans.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
            <Award size={48} color="#c4b5fd" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontWeight: 700, color: '#4c1d95', marginBottom: '0.5rem' }}>Membership Plans Coming Soon</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              Our membership plans are being configured. Please check back shortly or contact us directly.
            </p>
            <div style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: '10px', padding: '1rem', fontSize: '0.85rem', color: '#6d28d9' }}>
              📞 <strong>8796278474</strong> · <strong>8512017549</strong><br />
              ✉️ radianteducationtrust@gmail.com
            </div>
          </div>
        )}

        {!isLoading && plans.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {plans.map((plan) => {
              const benefits = plan.benefits
                ? (typeof plan.benefits === 'object' ? Object.values(plan.benefits) : [])
                : []
              const isLife = plan.name?.toLowerCase().includes('life')
              return (
                <div key={plan.id} style={{
                  background: isLife ? 'linear-gradient(135deg,#1e3a5f,#7c3aed)' : 'white',
                  borderRadius: '16px', padding: '2rem',
                  boxShadow: isLife ? '0 20px 40px rgba(124,58,237,0.25)' : '0 4px 20px rgba(0,0,0,0.08)',
                  border: isLife ? '2px solid #7c3aed' : '2px solid transparent',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => { if (!isLife) e.currentTarget.style.borderColor = '#7c3aed' }}
                  onMouseLeave={e => { if (!isLife) e.currentTarget.style.borderColor = 'transparent' }}
                >
                  {isLife && <div style={{ background: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem', letterSpacing: '0.06em' }}>MOST POPULAR</div>}
                  <Award size={30} color={isLife ? 'rgba(255,255,255,0.9)' : '#7c3aed'} style={{ marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isLife ? 'white' : '#0f172a', marginBottom: '0.25rem' }}>{plan.name}</h3>
                  <p style={{ color: isLife ? 'rgba(255,255,255,0.6)' : '#64748b', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{plan.type} · {plan.duration_days} days validity</p>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: isLife ? 'white' : '#0f172a', margin: '0.75rem 0 1.5rem' }}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                  </div>
                  {benefits.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {benefits.map((b, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: isLife ? 'rgba(255,255,255,0.8)' : '#374151' }}>
                          <CheckCircle2 size={15} color={isLife ? '#a78bfa' : '#059669'} style={{ flexShrink: 0 }} /> {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button onClick={() => handleApply(plan)}
                    style={{ width: '100%', padding: '0.75rem', background: isLife ? 'rgba(255,255,255,0.2)' : '#7c3aed', color: 'white', border: isLife ? '1.5px solid rgba(255,255,255,0.4)' : 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    Apply Now <ChevronRight size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Benefits of Membership */}
      <div style={{ background: '#f8fafc', padding: '4rem 0', marginTop: '3rem' }}>
        <div className="container" style={{ padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto 3rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.4rem' }}>
              Why Join Us
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem' }}>
              Benefits of Membership
            </h2>
            <p style={{ color: '#64748b', lineHeight: 1.7 }}>
              As a member of Radiant Education Trust, you gain access to a wide range of
              privileges that connect you to a community working for meaningful change.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem', maxWidth: '1000px', margin: '0 auto 2.5rem' }}>
            {MEMBERSHIP_BENEFITS.map((benefit, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
              return (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'}
                >
                  <div style={{ background: '#faf5ff', borderRadius: '8px', padding: '7px', flexShrink: 0 }}>
                    <Icon size={16} color="#7c3aed" />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{i + 1}.</span> {benefit}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Membership Motto */}
          <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,#1e3a5f,#7c3aed)', borderRadius: '16px', padding: '2.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Membership Motto
            </p>
            <p style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700, fontStyle: 'italic', margin: 0 }}>
              "Together for Education, Empowerment, and Social Welfare."
            </p>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {selectedPlan && (
        <MembershipFormModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSubmit={handleFormSubmit}
          isPending={applyMutation.isPending}
        />
      )}
    </div>
  )
}
