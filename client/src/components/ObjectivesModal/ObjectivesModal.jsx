import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Modal from '../ui/Modal.jsx'
import styles from './ObjectivesModal.module.css'

const OBJECTIVES_TEXT =
  "The objectives of Radiant Education Trust include promoting access to education, supporting children and underserved communities, strengthening learning opportunities, and undertaking initiatives for social and community development in accordance with the Trust's registered objectives and programme areas."

const CORE_VALUES = [
  'Education for All',
  'Child-Centred Development',
  'Inclusion and Equal Opportunity',
  'Empowerment and Self-Reliance',
  'Dignity and Respect',
  'Community Participation',
  'Integrity and Accountability',
  'Collaboration and Partnership',
  'Innovation and Continuous Learning',
  'Sustainable Social Development',
]

const SESSION_KEY = 'radiant_objectives_modal_shown'

export default function ObjectivesModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setOpen(true)
      sessionStorage.setItem(SESSION_KEY, '1')
    }
  }, [])

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Who We Are" width={560}>
      <div className={styles.section}>
        <h4 className={styles.heading}>Objectives</h4>
        <p className={styles.text}>{OBJECTIVES_TEXT}</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.heading}>Core Values</h4>
        <ul className={styles.valuesList}>
          {CORE_VALUES.map((v) => (
            <li key={v} className={styles.valueItem}>
              <CheckCircle2 size={16} className={styles.valueIcon} />
              {v}
            </li>
          ))}
        </ul>
      </div>

      <Link to="/about" className={styles.link} onClick={() => setOpen(false)}>
        Learn more about our work →
      </Link>
    </Modal>
  )
}
