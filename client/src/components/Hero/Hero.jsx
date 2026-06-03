import { useNavigate } from 'react-router-dom'
import { Award, CheckCircle2, Heart, HandHelping, UserCheck, Handshake, Users, Globe } from 'lucide-react'
import styles from './Hero.module.css'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section id="home" className={styles.hero}>
      {/* Background blobs */}
      <div className={styles.blobRight} />
      <div className={styles.blobLeft} />

      <div className={`container ${styles.grid}`}>
        {/* ── Left Content ── */}
        <div className={styles.content}>
          <div className={styles.badge}>
            <Award size={15} color="var(--clr-accent)" />
            Govt. Registered NGO · 80G · ISO 9001:2015 Certified
          </div>

          <h1 className={styles.headline}>
            Every Child<br />
            <span className={styles.headlineGradient}>Deserves a Classroom.</span>
          </h1>

          <p className={styles.sub}>
            Join Radiant Education Trust in our mission to educate children, inspire donors,
            and empower communities across the globe — turning visitors into believers, and
            believers into advocates.
          </p>

          {/* CTA buttons */}
          <div className={styles.ctaGrid}>
            <button className={styles.ctaDonate} onClick={() => navigate('/donate')}>
              <Heart size={16} fill="currentColor" />
              Donate
            </button>
            <button className={styles.ctaOutline} onClick={() => navigate('/volunteer')}>
              <HandHelping size={16} />
              Volunteer
            </button>
            <button className={styles.ctaAmber} onClick={() => navigate('/volunteer')}>
              <UserCheck size={16} />
              Sponsor a Child
            </button>
            <button className={styles.ctaIndigo} onClick={() => navigate('/contact')}>
              <Handshake size={16} />
              Partner With Us
            </button>
          </div>

          {/* Trust badges */}
          <div className={styles.trustRow}>
            <span className={styles.trustItem}>
              <CheckCircle2 size={18} color="var(--clr-green-500)" />
              80G Tax Exempt
            </span>
            <span className={styles.trustItem}>
              <CheckCircle2 size={18} color="var(--clr-green-500)" />
              ISO 9001:2015
            </span>
            <span className={styles.trustItem}>
              <CheckCircle2 size={18} color="var(--clr-green-500)" />
              SDG Aligned
            </span>
          </div>
        </div>

        {/* ── Right Image ── */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageCard}>
            <img
              src="https://theindianschool.in/uploads/posts/L-16972674476964-pre-primary-magic-years-main.jpg"
              alt="Children in a classroom learning"
              className={styles.image}
            />
            <div className={styles.imageOverlay} />
            <p className={styles.imageCaption}>
              "Amina walked 9 km daily to study. Today she teaches science to 40 children."
            </p>
          </div>

          {/* Floating cards */}
          <div className={`${styles.floatCard} ${styles.floatBottom}`}>
            <div className={styles.floatIcon} style={{ background: 'var(--clr-amber-100)', color: 'var(--clr-accent-dark)' }}>
              <Users size={22} />
            </div>
            <div>
              <p className={styles.floatStat}>1.2 Lakh+</p>
              <p className={styles.floatLabel}>Children Educated</p>
            </div>
          </div>

          <div className={`${styles.floatCard} ${styles.floatTop}`}>
            <div className={styles.floatIcon} style={{ background: 'var(--clr-primary-bg)', color: 'var(--clr-primary)' }}>
              <Globe size={22} />
            </div>
            <div>
              <p className={styles.floatStat}>18+</p>
              <p className={styles.floatLabel}>Countries Reached</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
