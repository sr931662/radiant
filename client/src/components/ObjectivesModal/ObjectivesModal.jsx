import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Modal from '../ui/Modal.jsx'
import { submitLandingLead } from '../../services/landingLeadService'
import { UG_COURSES, PG_COURSES, INDIAN_STATES } from '../../constants/courseOptions'
import Logo from '../../assets/image.svg'
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

export default function ObjectivesModal() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', state: '', courseType: '', course: '' })
  const [submitted, setSubmitted] = useState(false)

  const courseOptions = formData.courseType === 'UG' ? UG_COURSES : formData.courseType === 'PG' ? PG_COURSES : []

  const mutation = useMutation({
    mutationFn: () => submitLandingLead({
      name: formData.name,
      phone: formData.phone,
      state: formData.state,
      course_type: formData.courseType,
      course: formData.course,
    }),
    onSuccess: () => setSubmitted(true),
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to submit. Please try again.'),
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'courseType' ? { course: '' } : {}),
    }))
  }

  // Opens every time the page loads or is reloaded.
  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Who We Are" width={560}>
      <div className={styles.logoWrap}>
        <img src={Logo} alt="Radiant Education Trust" className={styles.logoImg} />
      </div>

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

      <div className={styles.formSection}>
        {submitted ? (
          <div className={styles.formSuccess}>
            <CheckCircle2 size={28} className={styles.successIcon} />
            <h4 className={styles.heading}>Thank You, {formData.name}!</h4>
            <p className={styles.text}>Our counsellor will call you within 24 hours.</p>
          </div>
        ) : (
          <>
            <h4 className={styles.heading}>Get Free Career Counselling</h4>
            <p className={styles.text}>Interested in our programmes? Share your details and our team will reach out.</p>
            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}>
              <input
                type="text" name="name" placeholder="Full name" required
                value={formData.name} onChange={handleChange} className={styles.input}
              />
              <input
                type="tel" name="phone" placeholder="10-digit mobile number" required
                pattern="[0-9]{10}" maxLength={10}
                value={formData.phone} onChange={handleChange} className={styles.input}
              />
              <select name="state" required value={formData.state} onChange={handleChange} className={styles.input}>
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className={styles.formRow}>
                <select name="courseType" required value={formData.courseType} onChange={handleChange} className={styles.input}>
                  <option value="">Course Type</option>
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                </select>
                <select
                  name="course" required value={formData.course} onChange={handleChange}
                  disabled={!formData.courseType} className={styles.input}
                >
                  <option value="">{formData.courseType ? 'Select Course' : 'Select type first'}</option>
                  {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting…' : 'Get Free Counselling'}
              </button>
            </form>
          </>
        )}
      </div>

      <Link to="/about" className={styles.link} onClick={() => setOpen(false)}>
        Learn more about our work →
      </Link>
    </Modal>
  )
}
