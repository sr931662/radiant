import { Link } from 'react-router-dom'
import { CheckCircle2, Award, Users, BookOpen, Heart, Handshake, ChevronRight, Star } from 'lucide-react'
import styles from './MembershipCTA.module.css'

const PERKS = [
  { icon: BookOpen,  text: 'Access to seminars, workshops & training programs' },
  { icon: Users,     text: 'Network with educators, researchers & community leaders' },
  { icon: Award,     text: 'Certificate of Membership from a registered NGO' },
  { icon: Heart,     text: 'Contribute to education, women empowerment & welfare' },
  { icon: Handshake, text: 'Serve on committees & advisory groups of the Trust' },
  { icon: Star,      text: 'Recognition for outstanding contributions' },
]

const PLANS = [
  {
    name: 'Annual Member',
    desc: '1 Year · Renewable',
    highlight: false,
  },
  {
    name: 'Life Member',
    desc: 'Lifetime · Best Value',
    highlight: true,
  },
]

export default function MembershipCTA() {
  return (
    <section className={styles.section}>
      {/* background glow */}
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <div className={`container ${styles.inner}`}>
        {/* Left — copy */}
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <Award size={13} /> Join Radiant Education Trust
          </div>

          <h2 className={styles.heading}>
            Be Part of Something<br />
            <span className={styles.headingAccent}>Bigger Than Yourself</span>
          </h2>

          <p className={styles.sub}>
            As a member of Radiant Education Trust, you become part of a growing community
            dedicated to education, empowerment, and social welfare across India.
            Together, we build a better future.
          </p>

          <ul className={styles.perks}>
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className={styles.perk}>
                <div className={styles.perkIcon}>
                  <Icon size={14} color="#7c3aed" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link to="/membership" className={styles.primaryBtn}>
              Become a Member <ChevronRight size={16} />
            </Link>
            <Link to="/about" className={styles.ghostBtn}>
              Learn More
            </Link>
          </div>

          <p className={styles.trust}>
            <CheckCircle2 size={13} color="#059669" />
            Registered NGO · Since 2008 · 100% transparent operations
          </p>
        </div>

        {/* Right — plan preview */}
        <div className={styles.right}>
          <div className={styles.planStack}>
            <p className={styles.planLabel}>Choose Your Membership</p>

            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.planCard} ${plan.highlight ? styles.planCardHighlight : ''}`}
              >
                {plan.highlight && (
                  <div className={styles.popularTag}>Most Popular</div>
                )}
                <Award
                  size={26}
                  color={plan.highlight ? 'rgba(255,255,255,0.9)' : '#7c3aed'}
                  style={{ marginBottom: '0.625rem' }}
                />
                <p className={`${styles.planName} ${plan.highlight ? styles.planNameLight : ''}`}>
                  {plan.name}
                </p>
                <p className={`${styles.planDesc} ${plan.highlight ? styles.planDescLight : ''}`}>
                  {plan.desc}
                </p>
              </div>
            ))}

            <div className={styles.studentCard}>
              <BookOpen size={16} color="#0891b2" />
              <div>
                <p className={styles.studentName}>Student Member</p>
                <p className={styles.studentDesc}>Special category for students</p>
              </div>
            </div>

            <Link to="/membership" className={styles.seeAllBtn}>
              View All Plans & Pricing →
            </Link>
          </div>

          {/* floating stat */}
          <div className={styles.statBubble}>
            <span className={styles.statNum}>2000+</span>
            <span className={styles.statText}>Members across India</span>
          </div>
        </div>
      </div>
    </section>
  )
}
