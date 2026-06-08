import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard, Users, FileText, Heart, MessageSquare,
  LogOut, Sun, BookOpen, Image, HandHeart, BadgeCheck,
  GraduationCap, Mail, Download, Award, ExternalLink,
  Bell, Menu, X, ChevronRight,
} from 'lucide-react'
import styles from './AdminLayout.module.css'

const NAV_GROUPS = [
  {
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/admin/users',       label: 'Users',       icon: Users },
      { to: '/admin/admissions',  label: 'Admissions',  icon: FileText },
      { to: '/admin/donations',   label: 'Donations',   icon: Heart },
      { to: '/admin/memberships', label: 'Memberships', icon: BadgeCheck },
      { to: '/admin/volunteers',  label: 'Volunteers',  icon: HandHeart },
    ],
  },
  {
    label: 'Programs',
    items: [
      { to: '/admin/courses', label: 'Courses', icon: BookOpen },
      { to: '/admin/fdp',     label: 'FDP',     icon: GraduationCap },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/banners', label: 'Banners',  icon: Bell },
      { to: '/admin/blog',    label: 'Blog',    icon: MessageSquare },
      { to: '/admin/gallery', label: 'Gallery', icon: Image },
    ],
  },
  {
    label: 'Support',
    items: [
      { to: '/admin/contacts',     label: 'Contacts',     icon: Mail },
      { to: '/admin/downloads',    label: 'Downloads',    icon: Download },
      { to: '/admin/certificates', label: 'Certificates', icon: Award },
    ],
  },
]

const PAGE_TITLES = {
  '/admin':              'Dashboard',
  '/admin/users':        'Users',
  '/admin/admissions':   'Admissions',
  '/admin/donations':    'Donations',
  '/admin/memberships':  'Memberships',
  '/admin/volunteers':   'Volunteers',
  '/admin/courses':      'Courses',
  '/admin/fdp':          'FDP Programs',
  '/admin/banners':      'Notification Banners',
  '/admin/blog':         'Blog Posts',
  '/admin/gallery':      'Gallery',
  '/admin/contacts':     'Contacts',
  '/admin/downloads':    'Downloads',
  '/admin/certificates': 'Certificates',
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() { logout(); navigate('/') }

  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin'
  const initials = user?.id?.slice(0, 2)?.toUpperCase() || 'AD'

  return (
    <div className={styles.shell}>
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandMark}><Sun size={17} /></div>
          <span className={styles.brandText}>Radiant</span>
          <span className={styles.brandSub}>Admin</span>
          <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}><X size={15} /></button>
        </div>

        <nav className={styles.nav}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={styles.navGroup}>
              {group.label && <span className={styles.navGroupLabel}>{group.label}</span>}
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
                >
                  <span className={styles.navIcon}><Icon size={15} /></span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.viewSiteBtn}>
            <ExternalLink size={12} /> View Site
          </a>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>Admin</p>
              <p className={styles.userRole}>{user?.roles?.[0] || 'ADMIN'}</p>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Sign Out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className={styles.topbarBreadcrumb}>
            <a href="/admin" className={styles.topbarBreadcrumbRoot}>Admin</a>
            {pageTitle !== 'Dashboard' && (
              <>
                <ChevronRight size={12} className={styles.topbarBreadcrumbSep} />
                <span className={styles.topbarPageTitle}>{pageTitle}</span>
              </>
            )}
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.topbarIconBtn} title="Notifications"><Bell size={17} /></button>
            <div className={styles.topbarAvatar}>{initials}</div>
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
