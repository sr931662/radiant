import { useNavigate } from 'react-router-dom'
import { Monitor, Clock, Award, Home, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react'
import styles from './AdmissionsBanner.module.css'

const FEATURES = [
  { icon: Monitor, label: '100% Online\nLearning' },
  { icon: Clock,   label: 'Flexible\nLearning' },
  { icon: Award,   label: 'UGC Approved\nProgrammes' },
  { icon: Home,    label: 'Admission Guidance\nat Your Door Step' },
]

const UG_COURSES = {
  courses: ['BBA', 'B.Com', 'BCA', 'BA'],
  specializations: [
    'Data Analytics', 'Artificial Intelligence', 'Cloud Security', 'CyberSecurity',
    'Finance', 'HR', 'Marketing', 'Business Analytics', 'FinTech', 'JMC',
  ],
}

const PG_COURSES = {
  courses: ['MBA', 'MCA', 'MSc', 'M.Com', 'MA', 'MSW'],
  specializations: [
    'Healthcare Management', 'Business Analytics', 'AI & ML', 'Blockchain',
    'Data Science', 'Cyber Security', 'Supply Chain Management',
    'Banking & Financial Services', 'Digital Business', 'Economics',
  ],
}

export default function AdmissionsBanner() {
  const navigate = useNavigate()

  return (
    <section className={styles.section}>
      {/* Gold Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <GraduationCap size={28} className={styles.headerIcon} />
          <div>
            <p className={styles.trustName}>RADIANT EDUCATION TRUST</p>
            <p className={styles.tagline}>Since 2008 · Trusted Educational Partner</p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {/* Hero text */}
        <div className={styles.heroText}>
          <h2 className={styles.admissionsTitle}>Admissions Open 2026</h2>
          <h3 className={styles.admissionsSub}>Online UG &amp; PG Courses</h3>
          <p className={styles.admissionsDesc}>For Working Professionals</p>
        </div>

        {/* Feature icons */}
        <div className={styles.featuresRow}>
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Icon size={22} color="#1e3a5f" />
              </div>
              <p className={styles.featureLabel}>{label}</p>
            </div>
          ))}
        </div>

        {/* Course panels */}
        <div className={styles.coursePanels}>
          {/* UG Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <Award size={16} color="#d97706" />
              UG Courses &amp; Specialisations
              <Award size={16} color="#d97706" />
            </div>
            <div className={styles.panelBody}>
              <div className={styles.panelCol}>
                <p className={styles.panelColTitle}>Top UG Courses:</p>
                <div className={styles.coursePills}>
                  {UG_COURSES.courses.map(c => (
                    <span key={c} className={styles.coursePill}>{c}</span>
                  ))}
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.panelCol}>
                <p className={styles.panelColTitle}>Specializations:</p>
                <p className={styles.specText}>{UG_COURSES.specializations.join(', ')}.</p>
              </div>
            </div>
          </div>

          {/* PG Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <Award size={16} color="#d97706" />
              PG Courses &amp; Specialisations
              <Award size={16} color="#d97706" />
            </div>
            <div className={styles.panelBody}>
              <div className={styles.panelCol}>
                <p className={styles.panelColTitle}>Top PG Courses:</p>
                <div className={styles.coursePills}>
                  {PG_COURSES.courses.map(c => (
                    <span key={c} className={styles.coursePill}>{c}</span>
                  ))}
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.panelCol}>
                <p className={styles.panelColTitle}>Specializations:</p>
                <p className={styles.specText}>{PG_COURSES.specializations.join(', ')}.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className={styles.ctaRow}>
          <div className={styles.ctaBadge}>
            <span>🔥</span> Limited Seats Available
          </div>
          <button className={styles.ctaPrimary} onClick={() => navigate('/courses')}>
            Apply Now <ChevronRight size={16} />
          </button>
          <button className={styles.ctaSecondary} onClick={() => navigate('/courses')}>
            🚀 Upgrade Your Career Today
          </button>
        </div>

        {/* Bottom tagline */}
        <p className={styles.bottomTagline}>
          Empowering Careers Through Quality Online Higher Education
        </p>

        {/* Contact strip */}
        <div className={styles.contactStrip}>
          <span>📞 8796278474 / 8512017549</span>
          <span>👤 Santosh Upadhyay – Coordinator</span>
          <span>✉️ radianteducationtrust@gmail.com</span>
        </div>
      </div>
    </section>
  )
}
