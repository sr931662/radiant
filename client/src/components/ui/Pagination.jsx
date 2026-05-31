import styles from './Pagination.module.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pages, onPage }) {
  if (!pages || pages <= 1) return null
  const items = buildPages(page, pages)
  return (
    <div className={styles.wrap}>
      <button className={styles.btn} disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft size={16} />
      </button>
      {items.map((item, i) =>
        item === '…' ? (
          <span key={i} className={styles.dots}>…</span>
        ) : (
          <button
            key={item}
            className={`${styles.btn} ${item === page ? styles.active : ''}`}
            onClick={() => onPage(item)}
          >
            {item}
          </button>
        )
      )}
      <button className={styles.btn} disabled={page >= pages} onClick={() => onPage(page + 1)}>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const result = [1]
  if (current > 3) result.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) result.push(i)
  if (current < total - 2) result.push('…')
  result.push(total)
  return result
}
