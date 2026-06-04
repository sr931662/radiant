import { Link } from 'react-router-dom'
import { Sun, MapPin, Clock, Phone, Globe, MessageCircle } from 'lucide-react'
import styles from './Footer.module.css'

const EXPLORE_LINKS = [
  { to: '/about',        label: 'About Us' },
  { to: '/programs',     label: 'Programs' },
  { to: '/courses',      label: 'Courses' },
  { to: '/membership',   label: 'Become a Member' },
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
              80G Certified · ISO 9001:2015 · DPDP Compliant · SDG 4, 5, 10, 17 Aligned
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
                <span>Registered: 215 Prabhavi Apartment, Sec-10, Dwarka, Delhi</span>
              </li>
              <li className={styles.contactItem}>
                <MapPin size={18} color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Correspondence: A-141, Sec-48, Noida – 201301</span>
              </li>
              <li className={styles.contactItem}>
                <Clock size={18} color="var(--clr-primary)" style={{ flexShrink: 0 }} />
                <span>Mon – Sat, 10:00 AM – 6:00 PM IST</span>
              </li>
              <li className={styles.contactItem}>
                <Phone size={18} color="var(--clr-primary)" style={{ flexShrink: 0 }} />
                <span>8796278474 · 8512017549</span>
              </li>
              <li className={styles.contactItem}>
                <Globe size={18} color="var(--clr-primary)" style={{ flexShrink: 0 }} />
                <span>radianteducationtrust@gmail.com</span>
              </li>
              <li className={styles.contactItem}>
                <a href="https://wa.me/918796278474" target="_blank" rel="noreferrer" className={styles.waBtn}>
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2026 Radiant Education Trust. All rights reserved.
            <span className={styles.copyrightMeta}>
              Reg. No. 106 (08-Jan-2008) · 80G: AADTR8447DE2026102 · DARPAN: DL/2025/0845871 · MSME: UDYAM-UP-28–0220207
            </span>
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
