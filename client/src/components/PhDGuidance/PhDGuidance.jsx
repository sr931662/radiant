import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Star, Rocket, Phone, Mail, User } from 'lucide-react'
import styles from './PhDGuidance.module.css'

const SERVICES = [
  'PhD Admission Assistance',
  'Research Proposal Writing Support',
  'Synopsis & Thesis Guidance',
  'Online & Hybrid Learning Programmes',
  'Personalized Academic Mentorship',
  'Research Methodology Support',
  'Publication & Journal Guidance',
  'Experienced Research Experts',
]

const HIGHLIGHTS = [
  'Trusted Guidance Since 2008',
  'Flexible & Personalized Support',
  'Learn Anytime, Anywhere',
  'End-to-End Research Assistance',
]

export default function PhDGuidance() {
  const navigate = useNavigate()

  return (
    <section className={styles.section}>
      <div className="container">
        {/* Trust badge */}
        <div className={styles.trustBadge}>
          <span className={styles.retLogo}>RET</span>
          <div>
            <p className={styles.retName}>Radiant Education Trust</p>
            <p className={styles.retTagline}>Your Future, Our Guidance | Since 2008</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Left: services */}
          <div className={styles.left}>
            <h2 className={styles.heading}>
              🎓 PhD Admission &amp;<br />Research Guidance
            </h2>
            <p className={styles.subHeading}>Your Research Journey, Our Expert Guidance!</p>

            <p className={styles.servicesTitle}>Key Services:</p>
            <ul className={styles.servicesList}>
              {SERVICES.map((s) => (
                <li key={s} className={styles.serviceItem}>
                  <CheckCircle2 size={17} color="#f5c842" style={{ flexShrink: 0 }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: highlights + CTA */}
          <div className={styles.right}>
            <div className={styles.highlightsCard}>
              {HIGHLIGHTS.map((h) => (
                <div key={h} className={styles.highlightItem}>
                  <Star size={15} color="#f5c842" fill="#f5c842" style={{ flexShrink: 0 }} />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className={styles.ctaCard}>
              <Rocket size={28} color="#f5c842" />
              <h3 className={styles.ctaTitle}>Ready to Start Your Research Journey?</h3>
              <p className={styles.ctaDesc}>
                Turn your academic goals into achievements with expert guidance.
              </p>
              <button className={styles.ctaBtn} onClick={() => navigate('/contact')}>
                Get PhD Guidance Today
              </button>
            </div>
          </div>
        </div>

        {/* Contact strip */}
        <div className={styles.contactStrip}>
          <p className={styles.contactLabel}>Contact Information:</p>
          <div className={styles.contactItems}>
            <span><User size={14} /> Mr. Santosh Upadhyay</span>
            <span><Phone size={14} /> 8796278474 | 8512017549</span>
            <span><Mail size={14} /> radianteducationtrust@gmail.com</span>
          </div>
        </div>

        <p className={styles.bottomLine}>
          Empowering Education &amp; Research – Learn Today, Lead Tomorrow.
        </p>
      </div>
    </section>
  )
}
