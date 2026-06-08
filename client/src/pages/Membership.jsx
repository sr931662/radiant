import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  CheckCircle2, Award, Star, Users, BookOpen, Handshake,
  Shield, Heart, X, FileText, ChevronRight
} from 'lucide-react'
import { getPlans, applyMembership, createMembershipPaymentOrder, verifyMembershipPayment } from '../services/membershipService'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'
import styles from './Membership.module.css'

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

function SectionTitle({ number, title }) {
  return (
    <div className={styles.sectionTitle}>
      <span className={styles.sectionNum}>{number}</span>
      <h4 className={styles.sectionName}>{title}</h4>
    </div>
  )
}

function FormField({ name, label, required, type, value, onChange }) {
  return (
    <div className={styles.formField}>
      <label className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <input name={name} type={type} required={required} value={value} onChange={onChange} className={styles.input} />
    </div>
  )
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalOrg}>RADIANT EDUCATION TRUST</p>
            <h3 className={styles.modalTitle}>Membership Application Form (B)</h3>
          </div>
          <button onClick={onClose} className={styles.modalCloseBtn}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.planBanner}>
          <Award size={20} color="#7c3aed" />
          <div>
            <span className={styles.planBannerName}>{plan?.name}</span>
            <span className={styles.planBannerPrice}>
              {plan?.price === 0 ? 'Free' : `₹${plan?.price?.toLocaleString('en-IN')}`}
            </span>
            <span className={styles.planBannerValidity}>· {plan?.duration_days} days validity</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <SectionTitle number="1" title="Personal Details" />
          <div className={styles.grid2}>
            {FORM_FIELDS.personal.map(({ name, label, required, type }) => (
              <FormField key={name} name={name} label={label} required={required} type={type}
                value={formData[name]} onChange={handleChange} />
            ))}
            <div>
              <label className={styles.label}>Gender</label>
              <div className={styles.genderRow}>
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className={styles.genderOption}>
                    <input type="radio" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)} /> {g}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <SectionTitle number="2" title="Contact Details" />
          <div className={styles.grid2}>
            {FORM_FIELDS.contact.map(({ name, label, required, type }) => (
              <FormField key={name} name={name} label={label} required={required} type={type}
                value={formData[name]} onChange={handleChange} />
            ))}
          </div>

          <SectionTitle number="3" title="Membership Category" />
          <div className={styles.categoryRow}>
            {['Annual Member', 'Life Member', 'Student Member'].map(cat => (
              <label
                key={cat}
                className={`${styles.categoryOption} ${memberCategory === cat ? styles.categoryOptionActive : ''}`}
              >
                <input type="radio" name="memberCategory" value={cat} checked={memberCategory === cat}
                  onChange={() => setMemberCategory(cat)} style={{ display: 'none' }} />
                {memberCategory === cat && <CheckCircle2 size={14} color="#7c3aed" />} {cat}
              </label>
            ))}
          </div>

          <SectionTitle number="4" title="Educational Qualification" />
          <div className={styles.grid2}>
            <FormField name="qualification" label="Highest Qualification" type="text" value={formData.qualification || ''} onChange={handleChange} />
            <FormField name="institution" label="Institution" type="text" value={formData.institution || ''} onChange={handleChange} />
          </div>

          <SectionTitle number="5" title="Nominee Details" />
          <div className={styles.grid3}>
            {FORM_FIELDS.nominee.map(({ name, label, required, type }) => (
              <FormField key={name} name={name} label={label} required={required} type={type}
                value={formData[name]} onChange={handleChange} />
            ))}
          </div>

          <SectionTitle number="6" title="Declaration" />
          <div className={styles.declaration}>
            <p className={styles.declarationText}>
              I hereby declare that the information furnished above is true and correct to the best of my knowledge.
              I agree to abide by the rules, regulations, objectives, and policies of Radiant Education Trust.
            </p>
            <label className={styles.declarationCheck}>
              <input type="checkbox" checked={declared} onChange={e => setDeclared(e.target.checked)}
                className={styles.declarationCheckInput} />
              I accept the above declaration and agree to the Trust's policies.
            </label>
          </div>

          <p className={styles.formNote}>
            Note: Membership fee is non-refundable. Your application will be reviewed and approved by the Trust office.
          </p>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={isPending} className={styles.submitBtn}>
              {isPending ? 'Submitting…' : <><FileText size={16} /> Submit Application</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

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

export default function Membership() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [payLoading, setPayLoading] = useState(false)

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

  async function handleFormSubmit() {
    if (!isAuthenticated) {
      toast.error('Session expired. Please login again.')
      navigate('/login')
      return
    }

    // Free plans — apply directly
    if (!selectedPlan.price || selectedPlan.price === 0) {
      applyMutation.mutate(selectedPlan.id)
      return
    }

    // Paid plans — Razorpay
    setPayLoading(true)
    try {
      const order = await createMembershipPaymentOrder(selectedPlan.id)
      const loaded = await loadRazorpay()
      if (!loaded) { toast.error('Razorpay failed to load. Check your connection.'); return }

      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        order_id: order.order_id,
        name: 'Radiant Education Trust',
        description: `Membership: ${selectedPlan.name}`,
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#7c3aed' },
        handler: async (response) => {
          try {
            await verifyMembershipPayment({
              plan_id: selectedPlan.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            toast.success('Payment successful! Membership application submitted.')
            setSelectedPlan(null)
          } catch {
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        modal: { ondismiss: () => toast('Payment cancelled.', { icon: 'ℹ️' }) },
      }).open()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not initiate payment. Please try again.')
    } finally {
      setPayLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Join the Community</p>
          <h1 className={styles.heroTitle}>Become a Member</h1>
          <p className={styles.heroDesc}>
            Join Radiant Education Trust and be part of a growing community dedicated to education,
            empowerment, and social welfare. Together we build a better future.
          </p>
          <p className={styles.heroMotto}>"Together for Education, Empowerment, and Social Welfare."</p>
        </div>
      </div>

      {/* Membership Plans */}
      <div className={`container ${styles.plansSection}`}>
        <div className={styles.plansHeader}>
          <p className={styles.plansSectionLabel}>Choose Your Plan</p>
          <h2 className={styles.plansSectionTitle}>Membership Plans</h2>
          <p className={styles.plansSectionDesc}>
            Select the membership category that best suits you. All memberships include a Certificate of Membership from the Trust.
          </p>
        </div>

        {!isAuthenticated && (
          <div className={styles.loginNudge}>
            <Award size={22} color="#7c3aed" style={{ flexShrink: 0 }} />
            <div className={styles.loginNudgeText}>
              <p className={styles.loginNudgeTitle}>Login required to apply</p>
              <p className={styles.loginNudgeSubtitle}>Create a free account or login to submit your membership application.</p>
            </div>
            <div className={styles.loginNudgeBtns}>
              <button onClick={() => navigate('/login')} className={styles.loginBtn}>Login</button>
              <button onClick={() => navigate('/register')} className={styles.registerBtn}>Register</button>
            </div>
          </div>
        )}

        {isLoading && <Spinner center size="lg" />}
        {isError && <p className={styles.errorMsg}>Failed to load membership plans.</p>}

        {!isLoading && !isError && plans.length === 0 && (
          <div className={styles.emptyPlans}>
            <Award size={48} color="#c4b5fd" style={{ marginBottom: '1rem' }} />
            <h3 className={styles.emptyPlansTitle}>Membership Plans Coming Soon</h3>
            <p className={styles.emptyPlansDesc}>
              Our membership plans are being configured. Please check back shortly or contact us directly.
            </p>
            <div className={styles.emptyPlansContact}>
              📞 <strong>8796278474</strong> · <strong>8512017549</strong><br />
              ✉️ radianteducationtrust@gmail.com
            </div>
          </div>
        )}

        {!isLoading && plans.length > 0 && (
          <div className={styles.plansGrid}>
            {plans.map((plan) => {
              const benefits = plan.benefits
                ? (typeof plan.benefits === 'object' ? Object.values(plan.benefits) : [])
                : []
              const isLife = plan.name?.toLowerCase().includes('life')
              return (
                <div
                  key={plan.id}
                  className={`${styles.planCard} ${isLife ? styles.planCardLife : styles.planCardRegular}`}
                >
                  {isLife && <div className={styles.popularBadge}>MOST POPULAR</div>}
                  <Award size={30} color={isLife ? 'rgba(255,255,255,0.9)' : '#7c3aed'} style={{ marginBottom: '0.75rem' }} />
                  <h3 className={`${styles.planName} ${isLife ? styles.planNameLife : styles.planNameRegular}`}>{plan.name}</h3>
                  <p className={`${styles.planMeta} ${isLife ? styles.planMetaLife : styles.planMetaRegular}`}>
                    {plan.type} · {plan.duration_days} days validity
                  </p>
                  <div className={`${styles.planPrice} ${isLife ? styles.planPriceLife : styles.planPriceRegular}`}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                  </div>
                  {benefits.length > 0 && (
                    <ul className={styles.planBenefits}>
                      {benefits.map((b, i) => (
                        <li key={i} className={`${styles.planBenefitItem} ${isLife ? styles.planBenefitLife : styles.planBenefitRegular}`}>
                          <CheckCircle2 size={15} color={isLife ? '#a78bfa' : '#059669'} style={{ flexShrink: 0 }} /> {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => handleApply(plan)}
                    className={`${styles.applyBtn} ${isLife ? styles.applyBtnLife : styles.applyBtnRegular}`}
                  >
                    Apply Now <ChevronRight size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Benefits of Membership */}
      <div className={styles.benefitsSection}>
        <div className={`container ${styles.benefitsInner}`}>
          <div className={styles.benefitsHeader}>
            <p className={styles.benefitsSectionLabel}>Why Join Us</p>
            <h2 className={styles.benefitsSectionTitle}>Benefits of Membership</h2>
            <p className={styles.benefitsSectionDesc}>
              As a member of Radiant Education Trust, you gain access to a wide range of
              privileges that connect you to a community working for meaningful change.
            </p>
          </div>

          <div className={styles.benefitsGrid}>
            {MEMBERSHIP_BENEFITS.map((benefit, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
              return (
                <div key={i} className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>
                    <Icon size={16} color="#7c3aed" />
                  </div>
                  <p className={styles.benefitText}>
                    <span className={styles.benefitNum}>{i + 1}.</span> {benefit}
                  </p>
                </div>
              )
            })}
          </div>

          <div className={styles.mottoBox}>
            <p className={styles.mottoLabel}>Membership Motto</p>
            <p className={styles.mottoText}>"Together for Education, Empowerment, and Social Welfare."</p>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <MembershipFormModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSubmit={handleFormSubmit}
          isPending={applyMutation.isPending || payLoading}
        />
      )}
    </div>
  )
}
