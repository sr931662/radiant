import { AlertCircle, CheckCircle2, Clock, IndianRupee, Mail, Phone } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Donations',
    icon: <IndianRupee size={18} color="#d97706" />,
    color: '#92400e',
    bg: '#fffbeb',
    border: '#fde68a',
    points: [
      'Donations once processed are generally non-refundable as they are immediately deployed for beneficiary welfare.',
      'In case of a duplicate payment or technical error, raise a request within 7 days of the transaction.',
      'Verified duplicate/error refunds are processed within 7–10 working days to the original payment method.',
    ],
  },
  {
    title: 'Course Enrollments',
    icon: <CheckCircle2 size={18} color="#059669" />,
    color: '#065f46',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    points: [
      'Full refund if cancellation is requested more than 7 days before the course start date.',
      '50% refund if cancellation is requested 3–7 days before the course start date.',
      'No refund for cancellations made within 3 days of the course start date or after the course has begun.',
      'Refunds are processed within 7–10 working days.',
    ],
  },
  {
    title: 'FDP (Faculty Development Program) Registrations',
    icon: <Clock size={18} color="#2563eb" />,
    color: '#1e40af',
    bg: '#eff6ff',
    border: '#bfdbfe',
    points: [
      'Full refund if cancellation is requested more than 10 days before the program start date.',
      '50% refund if cancellation is requested 5–10 days before the program start date.',
      'No refund for cancellations made within 5 days of the program start date.',
      'If Radiant cancels a program, 100% refund will be issued to all registered participants.',
    ],
  },
  {
    title: 'Membership Fees',
    icon: <AlertCircle size={18} color="#7c3aed" />,
    color: '#4c1d95',
    bg: '#faf5ff',
    border: '#ddd6fe',
    points: [
      'Membership fees are non-refundable once the membership is activated.',
      'In exceptional circumstances, requests may be considered on a case-by-case basis.',
    ],
  },
]

export default function CancellationPolicy() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#92400e 100%)', color: 'white', padding: '3.5rem 0 2.5rem' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>
            Policies
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Cancellation & Refund Policy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 620 }}>
            We aim to be transparent and fair. Please read the applicable refund terms before making a payment.
            Last updated: January 2026.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 900, padding: '2.5rem 1rem 4rem' }}>
        {/* Intro */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <AlertCircle size={22} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: '#475569', lineHeight: 1.8, margin: 0, fontSize: '0.9rem' }}>
            All refund requests must be submitted in writing to{' '}
            <a href="mailto:radianteducationtrust@gmail.com" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>
              radianteducationtrust@gmail.com
            </a>{' '}
            with your order/transaction ID and reason for cancellation. Requests made over phone will not be processed without written confirmation.
          </p>
        </div>

        {/* Policy sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {SECTIONS.map((sec) => (
            <div
              key={sec.title}
              style={{ background: sec.bg, border: `1px solid ${sec.border}`, borderRadius: 12, padding: '1.5rem' }}
            >
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: sec.color, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                {sec.icon} {sec.title}
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                {sec.points.map((pt) => (
                  <li key={pt} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                    <span style={{ color: sec.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>–</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ marginTop: '2rem', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Contact for Refund Queries</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: '0.875rem' }}>
              <Mail size={16} color="var(--clr-primary)" />
              radianteducationtrust@gmail.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: '0.875rem' }}>
              <Phone size={16} color="var(--clr-primary)" />
              8796278474 · 8512017549
            </div>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.75rem', margin: '0.75rem 0 0' }}>
            Mon – Sat, 10:00 AM – 6:00 PM IST
          </p>
        </div>
      </div>
    </div>
  )
}
