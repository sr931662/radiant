import { Link } from 'react-router-dom'
import { Sun, MapPin, Clock, Phone, Globe, MessageCircle } from 'lucide-react'
import styles from './Footer.module.css'

const EXPLORE_LINKS = [
  { to: '/about',        label: 'About Us' },
  { to: '/programs',     label: 'Programs' },
  { to: '/about#impact', label: 'Live Impact' },
  { to: '/volunteer',    label: 'Sponsor a Child' },
  { to: '/volunteer',    label: 'Volunteer / Careers' },
  { to: '/contact',      label: 'Partner With Us' },
]

const RESOURCE_LINKS = [
  { to: '/transparency', label: 'Annual Reports' },
  { to: '/transparency', label: 'Audited Financials' },
  { to: '/transparency', label: 'Fund Utilisation' },
  { to: '/transparency', label: 'Legal Certificates' },
  { to: '/gallery',      label: 'Media Hub' },
  { to: '/admin',        label: 'Admin Panel', highlight: true },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}><Sun size={22} /></div>
              <span className={styles.logoName}>Radiant Education Trust</span>
            </div>
            <p className={styles.brandDesc}>
              A Govt. Registered NGO committed to educating children, inspiring donors,
              and empowering communities — from local villages to global classrooms.
            </p>
            <p className={styles.brandMeta}>
              FCRA Approved · 80G Certified · DPDP Compliant · SDG 4, 5, 10, 17 Aligned
            </p>
            <p className={styles.newsletter}>Subscribe to Impact Updates</p>
            <div className={styles.emailRow}>
              <input
                type="email"
                placeholder="Your email address..."
                className={styles.emailInput}
              />
              <button className={styles.emailBtn}>Join</button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className={styles.colHeading}>Explore</h3>
            <ul className={styles.linkList}>
              {EXPLORE_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className={styles.footerLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={styles.colHeading}>Resources</h3>
            <ul className={styles.linkList}>
              {RESOURCE_LINKS.map(({ to, label, highlight }) => (
                <li key={label}>
                  <Link to={to} className={`${styles.footerLink} ${highlight ? styles.highlightLink : ''}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={styles.colHeading}>Contact Us</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin size={18} color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>12, Radiant Bhawan, Education Colony, Lucknow, Uttar Pradesh 226001, India</span>
              </li>
              <li className={styles.contactItem}>
                <Clock size={18} color="var(--clr-primary)" style={{ flexShrink: 0 }} />
                <span>Mon – Sat, 10:00 AM – 6:00 PM IST</span>
              </li>
              <li className={styles.contactItem}>
                <Phone size={18} color="var(--clr-primary)" style={{ flexShrink: 0 }} />
                <span>1800-000-0000 (Toll Free)</span>
              </li>
              <li className={styles.contactItem}>
                <Globe size={18} color="var(--clr-primary)" style={{ flexShrink: 0 }} />
                <span>Available in: English · हिंदी · Français · Español · عربي</span>
              </li>
              <li className={styles.contactItem}>
                <button className={styles.waBtn}>
                  <MessageCircle size={18} /> Chat on WhatsApp
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2026 Radiant Education Trust. Registered NGO · FCRA No. XXXX · 80G No. YYYY. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Child Safety'].map((l) => (
              <button key={l} type="button" className={styles.legalLink}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
