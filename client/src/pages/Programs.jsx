import { ExternalLink, Calendar, IndianRupee, MonitorPlay, Users } from 'lucide-react'
import ProgramsSection from '../components/Programs/Programs.jsx'
import CourseCatalog from '../components/CourseCatalog/CourseCatalog.jsx'
import EnquiryForm from '../components/EnquiryForm/EnquiryForm.jsx'

const GOOGLE_FORM_URL = 'https://forms.gle/LLMzyoujrnv6BRGB8'

const HIGHLIGHTS = [
  { icon: Calendar,      label: 'Duration',   value: '13 July – 16 Aug 2026 (4 Weeks)' },
  { icon: MonitorPlay,   label: 'Mode',        value: 'Online' },
  { icon: IndianRupee,   label: 'Reg. Fee',    value: '₹1,500 (INR)' },
  { icon: Users,         label: 'Eligible',    value: 'MTech · BTech · MCA · BCA' },
]

export default function Programs() {
  return (
    <>
      <ProgramsSection />

      {/* ── Internship Flyer ── */}
      <section style={{ padding: '4rem 0 3rem', background: 'linear-gradient(160deg,#faf5ff 0%,#eff6ff 100%)' }}>
        <div className="container">

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '999px', padding: '0.3rem 0.9rem', marginBottom: '0.75rem' }}>
              Featured Program
            </p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#1e1b4b', margin: '0 0 0.5rem' }}>
              Summer Internship Program 2026
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              Click the flyer to open the registration form
            </p>
          </div>

          {/* Highlights row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {HIGHLIGHTS.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #e9d5ff', borderRadius: '0.6rem', padding: '0.55rem 1rem', fontSize: '0.82rem', color: '#374151' }}>
                <Icon size={14} color="#7c3aed" />
                <span style={{ fontWeight: 600, color: '#7c3aed' }}>{label}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>

          {/* Flyer poster — click to open Google Form */}
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', maxWidth: '620px', margin: '0 auto 1.75rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(124,58,237,0.18)', cursor: 'pointer', textDecoration: 'none' }}
          >
            <img
              src="/flyers/internship-2026.png"
              alt="Summer Internship Program 2026 — Generative AI & Prompt Engineering"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </a>

          {/* CTA button */}
          <div style={{ textAlign: 'center' }}>
            <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
                <ExternalLink size={17} /> Register Now — ₹1,500
              </button>
            </a>
            <p style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: '#94a3b8' }}>
              Opens Google Form in a new tab · Online registration
            </p>
          </div>

        </div>
      </section>

      <CourseCatalog />
      <EnquiryForm />
    </>
  )
}
