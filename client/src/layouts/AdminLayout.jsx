import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard, Users, FileText, Heart,
  MessageSquare, LogOut, Sun, ChevronRight
} from 'lucide-react'
import styles from './AdminLayout.module.css'

const NAV = [
  { to: '/admin',             label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/users',       label: 'Users',        icon: Users },
  { to: '/admin/admissions',  label: 'Admissions',   icon: FileText },
  { to: '/admin/donations',   label: 'Donations',    icon: Heart },
  { to: '/admin/blog',        label: 'Blog',         icon: MessageSquare },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Sun size={22} color="var(--clr-accent)" />
          <span>Radiant Admin</span>
        </div>
        <nav className={styles.nav}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              <ChevronRight size={14} className={styles.chevron} />
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user?.id?.slice(0, 2)?.toUpperCase() || 'AD'}</div>
            <div>
              <p className={styles.userName}>Admin</p>
              <p className={styles.userRole}>{user?.roles?.[0] || 'ADMIN'}</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
