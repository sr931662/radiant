import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Sun, Heart, UserCheck, Menu, X } from 'lucide-react'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/',              label: 'Home',         end: true },
  { to: '/about',         label: 'About' },
  { to: '/programs',      label: 'Programs' },
  { to: '/blog',          label: 'Stories' },
  { to: '/volunteer',     label: 'Volunteer' },
  { to: '/transparency',  label: 'Reports' },
  { to: '/contact',       label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Sun size={28} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>Radiant Education</span>
            <span className={styles.logoSub}>Trust · NGO</span>
          </div>
        </Link>

        {/* Desktop menu */}
        <div className={styles.desktopMenu}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className={styles.navActions}>
            <Link to="/volunteer" className={styles.sponsorBtn}>
              <UserCheck size={15} />
              Sponsor a Child
            </Link>
            <Link to="/donate" className={styles.donateBtn}>
              <Heart size={15} fill="currentColor" />
              Donate
            </Link>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className={styles.mobileDivider} />
          <Link
            to="/volunteer"
            className={styles.mobileSponsorBtn}
            onClick={() => setMenuOpen(false)}
          >
            <UserCheck size={16} />
            Sponsor a Child
          </Link>
          <Link
            to="/donate"
            className={styles.mobileDonateBtn}
            onClick={() => setMenuOpen(false)}
          >
            <Heart size={16} fill="currentColor" />
            Donate Now
          </Link>
        </div>
      )}
    </nav>
  )
}
