import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Sun, Heart, UserCheck, Menu, X, LogOut, LayoutDashboard, User, Award } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Navbar.module.css'
import Logo from '../../assets/image.svg'

const NAV_LINKS = [
  { to: '/',             label: 'Home',       end: true },
  { to: '/about',        label: 'About' },
  { to: '/programs',     label: 'Programs' },
  { to: '/journal',      label: 'Journal' },
  { to: '/membership',   label: 'Membership', highlight: true },
  { to: '/blog',         label: 'Stories' },
  { to: '/contact',      label: 'Contact' },
]

function UserMenu({ user, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = user?.id?.slice(0, 2)?.toUpperCase() || 'ME'

  return (
    <div className={styles.userMenu} ref={ref}>
      <button className={styles.avatarBtn} onClick={() => setOpen((v) => !v)} aria-label="Account menu">
        <span className={styles.avatar}>{initials}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownInitials}>{initials}</span>
            <div>
              <p className={styles.dropdownRole}>{user?.roles?.[0] || 'Member'}</p>
              <p className={styles.dropdownSub}>Signed in</p>
            </div>
          </div>
          <div className={styles.dropdownDivider} />
          {isAdmin && (
            <Link to="/admin" className={styles.dropdownItem} onClick={() => setOpen(false)}>
              <LayoutDashboard size={15} /> Admin Panel
            </Link>
          )}
          <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={() => { setOpen(false); onLogout() }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <img src={Logo} alt="Radiant Education Trust" />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>Radiant Education</span>
            <span className={styles.logoSub}>Trust · NGO</span>
          </div>
        </Link>

        {/* Desktop menu */}
        <div className={styles.desktopMenu}>
          {NAV_LINKS.map(({ to, label, end, highlight }) => (
            highlight ? (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `${styles.membershipLink} ${isActive ? styles.membershipLinkActive : ''}`}>
                <Award size={13} /> {label}
              </NavLink>
            ) : (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
                {label}
              </NavLink>
            )
          ))}
          <div className={styles.navActions}>
            <Link to="/donate" className={styles.sponsorBtn}>
              <UserCheck size={15} /> Sponsor a Child
            </Link>
            <Link to="/donate" className={styles.donateBtn}>
              <Heart size={15} fill="currentColor" /> Donate
            </Link>
            {isAuthenticated ? (
              <UserMenu user={user} isAdmin={isAdmin} onLogout={handleLogout} />
            ) : (
              <Link to="/login" className={styles.loginBtn}>
                <User size={15} /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Hamburger */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ to, label, end, highlight }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                highlight
                  ? `${styles.mobileMembershipLink} ${isActive ? styles.mobileMembershipLinkActive : ''}`
                  : `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
              }
              onClick={() => setMenuOpen(false)}>
              {highlight && <Award size={14} style={{ display: 'inline', marginRight: 5 }} />}
              {label}
            </NavLink>
          ))}
          <div className={styles.mobileDivider} />
          <Link to="/donate" className={styles.mobileSponsorBtn} onClick={() => setMenuOpen(false)}>
            <UserCheck size={16} /> Sponsor a Child
          </Link>
          <Link to="/donate" className={styles.mobileDonateBtn} onClick={() => setMenuOpen(false)}>
            <Heart size={16} fill="currentColor" /> Donate Now
          </Link>
          <div className={styles.mobileDivider} />
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard size={15} style={{ display: 'inline', marginRight: 6 }} />
                  Admin Panel
                </Link>
              )}
              <button
                className={styles.mobileLogoutBtn}
                onClick={() => { setMenuOpen(false); handleLogout() }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.mobileLoginBtn} onClick={() => setMenuOpen(false)}>
              <User size={16} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
