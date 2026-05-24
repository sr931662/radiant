import { useState } from 'react'
import { Heart, ShieldCheck, Globe2, QrCode } from 'lucide-react'
import styles from './Donation.module.css'

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

export default function Donation() {
  const [activeTab, setActiveTab] = useState('once')
  const [selectedAmt, setSelectedAmt] = useState(2000)
  const [customAmt, setCustomAmt] = useState(2000)

  const handlePreset = (amt) => {
    setSelectedAmt(amt)
    setCustomAmt(amt)
  }

  const handleCustom = (e) => {
    const v = Number(e.target.value)
    setCustomAmt(v)
    setSelectedAmt(null)
  }

  return (
    <section id="donate-section" className={styles.section}>
      <div className={styles.glow} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.card}>
          {/* Left – Impact messaging */}
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

          {/* Right – Donation form */}
          <div className={styles.right}>
            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className={styles.tabDesc}>{TAB_LABELS[activeTab]}</p>

            <h3 className={styles.amtHeading}>Select Amount</h3>

            {/* Preset amounts */}
            <div className={styles.presets}>
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  className={`${styles.presetBtn} ${selectedAmt === amt ? styles.presetActive : ''}`}
                  onClick={() => handlePreset(amt)}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className={styles.inputWrapper}>
              <span className={styles.rupeeSign}>₹</span>
              <input
                type="number"
                className={styles.amtInput}
                value={customAmt}
                onChange={handleCustom}
                placeholder="Custom Amount"
              />
            </div>

            {/* Progress bar */}
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <span>Campaign: Education for Flood-Affected Children</span>
                <span className={styles.progressPct}>73% funded</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '73%' }} />
              </div>
              <p className={styles.progressMeta}>₹7.3L raised of ₹10L goal · 842 donors · 8 days left</p>
            </div>

            {/* Payment options */}
            <p className={styles.payLabel}>Payment Method</p>
            <div className={styles.payOptions}>
              <button className={styles.payRazorpay}>
                <ShieldCheck size={16} />
                Donate via Razorpay (UPI / Cards / Net Banking)
              </button>
              <div className={styles.payRow2}>
                <button className={styles.payAlt}><Globe2 size={15} /> Stripe</button>
                <button className={styles.payAlt}>PayPal</button>
              </div>
              <button className={styles.payAltFull}>
                <QrCode size={15} /> Show UPI QR Code
              </button>
            </div>
            <p className={styles.payFootnote}>Instant 80G receipt via email · Bank transfer option available for large donations</p>
          </div>
        </div>
      </div>
    </section>
  )
}
