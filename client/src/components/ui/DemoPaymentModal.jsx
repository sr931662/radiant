import { useState } from 'react'
import { Shield, CreditCard, Smartphone, Building2, X, CheckCircle2, Lock, IndianRupee } from 'lucide-react'

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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '100%', maxWidth: '400px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
        animation: 'slideUp 0.25s ease',
      }}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>

        {/* Header */}
        <div style={{ background: '#1e3a5f', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={18} color="#1e3a5f" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Radiant Education Trust</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', margin: 0 }}>Secure Checkout · Demo Mode</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {done ? (
          /* Success state */
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={36} color="#16a34a" />
            </div>
            <h3 style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>Payment Successful!</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              <strong style={{ color: '#0f172a' }}>₹{amountRs}</strong> paid successfully.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.5rem' }}>Enrolling you now…</p>
          </div>
        ) : (
          <div style={{ padding: '1.25rem' }}>
            {/* Amount */}
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Amount to Pay</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IndianRupee size={18} strokeWidth={2.5} />{amountRs}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>For</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', margin: '2px 0 0', maxWidth: 140, textAlign: 'right' }}>{description}</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px', marginBottom: '1rem', gap: '3px' }}>
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, padding: '6px', borderRadius: '6px', border: 'none',
                  background: tab === t.id ? 'white' : 'transparent',
                  color: tab === t.id ? '#0f172a' : '#64748b',
                  fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                  boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  transition: 'all 0.15s',
                }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* UPI tab */}
            {tab === 'upi' && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>UPI ID</label>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  style={{ width: '100%', padding: '0.7rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                  Supports GPay, PhonePe, Paytm, BHIM & more
                </p>
              </div>
            )}

            {/* Card tab */}
            {tab === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input placeholder="Card Number" style={{ padding: '0.7rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <input placeholder="MM / YY" style={{ padding: '0.7rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                  <input placeholder="CVV" style={{ padding: '0.7rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <input placeholder="Name on Card" style={{ padding: '0.7rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
              </div>
            )}

            {/* Net Banking tab */}
            {tab === 'nb' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                  <button key={bank} style={{ padding: '0.6rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: 'white', fontWeight: 600, fontSize: '0.82rem', color: '#374151', cursor: 'pointer' }}>
                    {bank}
                  </button>
                ))}
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={paying}
              style={{
                width: '100%', marginTop: '1rem', padding: '0.875rem',
                background: paying ? '#94a3b8' : 'linear-gradient(135deg,#2563eb,#1e40af)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontWeight: 700, fontSize: '0.975rem', cursor: paying ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.15s',
              }}
            >
              {paying ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  Processing…
                </>
              ) : (
                <><Lock size={15} /> Pay ₹{amountRs}</>
              )}
            </button>

            {/* Security footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0.875rem', color: '#94a3b8', fontSize: '0.72rem' }}>
              <Shield size={12} /> 256-bit SSL · PCI-DSS Compliant · Demo Mode
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
