import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { applyVolunteer, applyInternship } from '../../services/volunteerService'
import Modal from '../ui/Modal'
import styles from './Volunteer.module.css'

const CARDS = [
  { title: 'Volunteer', sub: 'On-ground or remote — your skills matter.', items: ['Participate in local education drives', 'Skill-based pro-bono volunteering (tech, legal, finance)', 'Remote opportunities for international volunteers', 'Official volunteering certificate issued'], btnLabel: 'Register as Volunteer', variant: 'outline', iconColor: 'var(--clr-primary)', action: 'volunteer' },
  { title: 'Campus Ambassador', sub: 'University students driving change on campus.', items: ['Represent the NGO at your university', 'Fundraise and recruit fellow volunteers', 'Internship & fellowship opportunities', 'Mentorship from senior NGO leadership'], btnLabel: 'Apply as Ambassador', variant: 'dark', iconColor: 'var(--clr-accent)', featured: true, badge: 'Most Popular', action: 'ambassador' },
  { title: 'Open Positions', sub: 'Paid roles for passionate professionals.', items: ['Program Manager — Field Operations', 'Donor Relations & Fundraising Lead', 'Content & Communications Manager'], btnLabel: 'Apply for Internship', variant: 'indigo', iconColor: 'var(--clr-primary)', action: 'internship' },
]

export default function Volunteer() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const volunteerMutation = useMutation({
    mutationFn: (d) => applyVolunteer({ type: modal === 'ambassador' ? 'AMBASSADOR' : 'VOLUNTEER', skills: d.skills }),
    onSuccess: () => { toast.success('Application submitted! We will reach out within 3 business days.'); setModal(null); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Submission failed. Please try again.'),
  })

  const internshipMutation = useMutation({
    mutationFn: (d) => applyInternship({ position: d.position }),
    onSuccess: () => { toast.success('Internship application submitted!'); setModal(null); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Submission failed. Please try again.'),
  })

  function handleClick(action) {
    if (!isAuthenticated) { navigate('/login'); return }
    setModal(action)
  }

  function onSubmit(d) {
    if (modal === 'internship') internshipMutation.mutate(d)
    else volunteerMutation.mutate(d)
  }

  const isPending = volunteerMutation.isPending || internshipMutation.isPending

  return (
    <section id="volunteer" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Volunteer & Careers</p>
          <h2 className="section-heading">Give Time. Give Talent. Give Back.</h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0.75rem auto 0' }}>
            Volunteers are our most engaged supporter segment. Whether you're on-ground or remote,
            there's a role for every skill set.
          </p>
        </div>

        <div className={styles.grid}>
          {CARDS.map((card) => (
            <div key={card.title} className={`${styles.card} ${styles['card_' + card.variant]} ${card.featured ? styles.featured : ''}`}>
              {card.badge && <span className={styles.badge}>{card.badge}</span>}
              <h3 className={`${styles.title} ${card.variant === 'dark' ? styles.titleWhite : ''}`}>{card.title}</h3>
              <p className={`${styles.sub} ${card.variant === 'dark' ? styles.subLight : ''}`}>{card.sub}</p>
              <ul className={styles.list}>
                {card.items.map((item) => (
                  <li key={item} className={styles.listItem}>
                    <CheckCircle2 size={18} color={card.iconColor} style={{ flexShrink: 0 }} />
                    <span className={card.variant === 'dark' ? '' : styles.itemText}>{item}</span>
                  </li>
                ))}
              </ul>
              <button className={`${styles.btn} ${styles['btn_' + card.variant]}`} onClick={() => handleClick(card.action)}>
                {card.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!modal} onClose={() => { setModal(null); reset() }} title={modal === 'internship' ? 'Apply for Internship' : modal === 'ambassador' ? 'Apply as Campus Ambassador' : 'Register as Volunteer'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {modal === 'internship' ? (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Position Applied For</label>
              <input
                style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                placeholder="e.g. Program Manager — Field Operations"
                {...register('position', { required: 'Position is required' })}
              />
              {errors.position && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.position.message}</p>}
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Skills / Areas of Expertise (optional)</label>
              <textarea
                style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical' }}
                rows={3}
                placeholder="e.g. Teaching, Web Development, Legal, Finance…"
                {...register('skills')}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            style={{ width: '100%', padding: '0.75rem', background: 'var(--clr-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            {isPending ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      </Modal>
    </section>
  )
}
