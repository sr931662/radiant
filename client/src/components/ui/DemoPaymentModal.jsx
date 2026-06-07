import { useState } from 'react'
import { Shield, CreditCard, Smartphone, Building2, X, CheckCircle2, Lock, IndianRupee } from 'lucide-react'
import styles from './DemoPaymentModal.module.css'

const TABS = [
  { id: 'upi',  label: 'UPI',          icon: <Smartphone size={14} /> },
  { id: 'card', label: 'Card',         icon: <CreditCard size={14} /> },
  { id: 'nb',   label: 'Net Banking',  icon: <Building2 size={14} /> },
]

export default function DemoPaymentModal({ open, amount, description, onSuccess, onClose }) {
  const [tab, setTab] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [paying, setPaying] = useState(false)
  const [done, setDone] = useState(false)

  if (!open) return null

  const amountRs = (amount / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setDone(true)
      setTimeout(() => {
        setDone(false)
        onSuccess()
      }, 1800)
    }, 2200)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLogo}>
            <Shield size={18} color="#1e3a5f" />
          </div>
          <div className={styles.headerInfo}>
            <p className={styles.headerName}>Radiant Education Trust</p>
            <p className={styles.headerSub}>Secure Checkout · Demo Mode</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={36} color="#16a34a" />
            </div>
            <h3 className={styles.successTitle}>Payment Successful!</h3>
            <p className={styles.successDesc}>
              <strong style={{ color: '#0f172a' }}>₹{amountRs}</strong> paid successfully.
            </p>
            <p className={styles.successEnrolling}>Enrolling you now…</p>
          </div>
        ) : (
          <div className={styles.body}>
            {/* Amount */}
            <div className={styles.amountRow}>
              <div>
                <p className={styles.amountLabel}>Amount to Pay</p>
                <p className={styles.amountValue}>
                  <IndianRupee size={18} strokeWidth={2.5} />{amountRs}
                </p>
              </div>
              <div className={styles.descSide}>
                <p className={styles.descLabel}>For</p>
                <p className={styles.descValue}>{description}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* UPI tab */}
            {tab === 'upi' && (
              <div>
                <label className={styles.upiLabel}>UPI ID</label>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className={styles.upiInput}
                />
                <p className={styles.upiHint}>Supports GPay, PhonePe, Paytm, BHIM &amp; more</p>
              </div>
            )}

            {/* Card tab */}
            {tab === 'card' && (
              <div className={styles.cardForm}>
                <input placeholder="Card Number" className={styles.cardInput} />
                <div className={styles.cardRow}>
                  <input placeholder="MM / YY" className={styles.cardInput} />
                  <input placeholder="CVV" className={styles.cardInput} />
                </div>
                <input placeholder="Name on Card" className={styles.cardInput} />
              </div>
            )}

            {/* Net Banking tab */}
            {tab === 'nb' && (
              <div className={styles.bankGrid}>
                {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                  <button key={bank} className={styles.bankBtn}>{bank}</button>
                ))}
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={paying}
              className={`${styles.payBtn} ${paying ? styles.payBtnDisabled : ''}`}
            >
              {paying ? (
                <>
                  <span className={styles.spinner} />
                  Processing…
                </>
              ) : (
                <><Lock size={15} /> Pay ₹{amountRs}</>
              )}
            </button>

            <div className={styles.securityNote}>
              <Shield size={12} /> 256-bit SSL · PCI-DSS Compliant · Demo Mode
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
