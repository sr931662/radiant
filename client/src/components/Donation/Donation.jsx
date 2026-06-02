import { useState } from 'react'
import { Heart, ShieldCheck, Globe2, QrCode, TrendingUp, Users } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createOrder, verifyPayment, getReceipt, simulateDonation } from '../../services/donationService'
import api from '../../lib/api'
import styles from './Donation.module.css'

async function getPublicStats() {
  const { data } = await api.get('/api/v1/public/stats')
  return data.data ?? data
}

const TABS = [
  { id: 'once',    label: 'One-Time' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'sponsor', label: 'Sponsor a Child' },
]

const TAB_LABELS = {
  once:    'Make a single contribution of any amount — instant 80G receipt issued.',
  monthly: 'Automated monthly giving — the most valuable donor type for predictable program funding.',
  sponsor: 'Direct linkage between you and a named child — quarterly progress updates, photos, and letters.',
}

const PRESET_AMOUNTS = [500, 2000, 10000]

const IMPACT_LABELS = [
  { amt: '₹500',    desc: 'Educates a child for one full month' },
  { amt: '₹2,000',  desc: 'School kit for 5 children (books, uniform, bag)' },
  { amt: '₹10,000', desc: "Funds a teacher's salary for one month" },
  { amt: '₹50,000', desc: 'Sponsors a classroom for an entire year' },
]

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Donation() {
  const [activeTab, setActiveTab]   = useState('once')
  const [selectedAmt, setSelectedAmt] = useState(2000)
  const [customAmt, setCustomAmt]   = useState(2000)

  const { data: stats } = useQuery({
    queryKey: ['public-stats'],
    queryFn: getPublicStats,
    staleTime: 5 * 60 * 1000,
  })

  const handlePreset = (amt) => { setSelectedAmt(amt); setCustomAmt(amt) }
  const handleCustom = (e) => { const v = Number(e.target.value); setCustomAmt(v); setSelectedAmt(null) }

  const verifyMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: async (data) => {
      toast.success('Donation successful! Your 80G receipt has been sent to your email.')
      if (data?.receipt_url) {
        window.open(data.receipt_url, '_blank')
        return
      }

      if (data?.id) {
        try {
          const receipt = await getReceipt(data.id)
          const url = receipt?.receipt_url ?? receipt
          if (url) window.open(url, '_blank')
        } catch {
          // Receipt delivery can lag slightly behind payment verification.
        }
      }
    },
    onError: () => toast.error('Payment verification failed. Contact support if amount was deducted.'),
  })

  const orderMutation = useMutation({
    mutationFn: () => createOrder(customAmt || selectedAmt),
    onSuccess: async (order) => {
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast.error('Razorpay failed to load. Check your connection.'); return }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        order_id: order.id,
        name: 'Radiant Education Trust',
        description: 'Donation — Education for Every Child',
        image: '/logo.png',
        handler: (response) => {
          verifyMutation.mutate({
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          })
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#2563eb' },
        modal: { ondismiss: () => toast('Payment cancelled.', { icon: 'ℹ️' }) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Could not initiate payment. Please try again.'),
  })

  const simulateMutation = useMutation({
    mutationFn: () => simulateDonation(customAmt || selectedAmt),
    onSuccess: (data) => {
      toast.success(`Test donation of ₹${(customAmt || selectedAmt).toLocaleString('en-IN')} recorded! ID: ${String(data.id).slice(0, 8)}…`)
    },
    onError: (err) => toast.error(err?.response?.data?.detail || 'Simulate failed.'),
  })

  const isLoading = orderMutation.isPending || verifyMutation.isPending || simulateMutation.isPending

  return (
    <section id="donate-section" className={styles.section}>
      <div className={styles.glow} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.card}>
          {/* Left */}
          <div className={styles.left}>
            <Heart size={56} fill="var(--clr-accent)" color="var(--clr-accent)" className={styles.heartIcon} />
            <h2 className={styles.leftHeading}>Your Donation Funds Real Children</h2>
            <p className={styles.leftSub}>
              Every rupee raised goes directly to programs. We publish audited fund utilisation
              reports so you can see exactly where your money reaches.
            </p>
            <div className={styles.impactList}>
              {IMPACT_LABELS.map(({ amt, desc }) => (
                <div key={amt} className={styles.impactItem}>
                  <span className={styles.impactAmt}>{amt}</span>
                  <span>— {desc}</span>
                </div>
              ))}
            </div>
            <div className={styles.certRow}>
              <div className={styles.cert}><span className={styles.certNum}>80G</span><span className={styles.certLabel}>Tax Exempt</span></div>
              <div className={styles.certDivider} />
              <div className={styles.cert}><span className={styles.certNum}>FCRA</span><span className={styles.certLabel}>Approved</span></div>
              <div className={styles.certDivider} />
              <div className={styles.cert}><span className={styles.certNum}>100%</span><span className={styles.certLabel}>Transparent</span></div>
            </div>
          </div>

          {/* Right */}
          <div className={styles.right}>
            <div className={styles.tabs}>
              {TABS.map(({ id, label }) => (
                <button key={id} className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`} onClick={() => setActiveTab(id)}>
                  {label}
                </button>
              ))}
            </div>
            <p className={styles.tabDesc}>{TAB_LABELS[activeTab]}</p>

            <h3 className={styles.amtHeading}>Select Amount</h3>
            <div className={styles.presets}>
              {PRESET_AMOUNTS.map((amt) => (
                <button key={amt} className={`${styles.presetBtn} ${selectedAmt === amt ? styles.presetActive : ''}`} onClick={() => handlePreset(amt)}>
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className={styles.inputWrapper}>
              <span className={styles.rupeeSign}>₹</span>
              <input type="number" className={styles.amtInput} value={customAmt} onChange={handleCustom} placeholder="Custom Amount" min={1} />
            </div>

            {stats && (
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <TrendingUp size={13} /> Total Raised So Far
                  </span>
                  <span className={styles.progressPct}>
                    ₹{(stats.total_donations || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={11} /> {(stats.total_students || 0).toLocaleString('en-IN')} students supported
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {(stats.total_courses || 0)} courses available
                  </span>
                </div>
              </div>
            )}

            <p className={styles.payLabel}>Payment Method</p>
            <div className={styles.payOptions}>
              <button className={styles.payRazorpay} onClick={() => orderMutation.mutate()} disabled={isLoading || !customAmt}>
                <ShieldCheck size={16} />
                {isLoading ? 'Processing…' : 'Donate via Razorpay (UPI / Cards / Net Banking)'}
              </button>
              <div className={styles.payRow2}>
                <button className={styles.payAlt} disabled><Globe2 size={15} /> Stripe</button>
                <button className={styles.payAlt} disabled>PayPal</button>
              </div>
              <button className={styles.payAltFull} disabled>
                <QrCode size={15} /> Show UPI QR Code
              </button>
            </div>
            {import.meta.env.DEV && (
              <button
                className={styles.payAltFull}
                onClick={() => simulateMutation.mutate()}
                disabled={isLoading || !customAmt}
                style={{ marginTop: '0.5rem', borderStyle: 'dashed', color: '#7c3aed', borderColor: '#c4b5fd' }}
              >
                🧪 Simulate Payment (Dev Only)
              </button>
            )}
            <p className={styles.payFootnote}>Instant 80G receipt via email · Bank transfer option available for large donations</p>
          </div>
        </div>
      </div>
    </section>
  )
}
