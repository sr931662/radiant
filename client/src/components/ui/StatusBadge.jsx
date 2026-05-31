import styles from './StatusBadge.module.css'

const MAP = {
  PENDING:   'pending',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  EXPIRED:   'expired',
  SUCCESS:   'approved',
  FAILED:    'rejected',
  PUBLISHED: 'approved',
  DRAFT:     'pending',
  CONFIRMED: 'approved',
  CANCELLED: 'rejected',
  ACTIVE:    'approved',
  UNREAD:    'pending',
  READ:      'expired',
  REPLIED:   'approved',
}

export default function StatusBadge({ status }) {
  const cls = MAP[status?.toUpperCase()] || 'pending'
  return <span className={`${styles.badge} ${styles[cls]}`}>{status}</span>
}
