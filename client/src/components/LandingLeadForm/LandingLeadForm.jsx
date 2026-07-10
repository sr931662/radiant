import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CheckCircle2, Lock } from 'lucide-react'
import { submitLandingLead } from '../../services/landingLeadService'
import { UG_COURSES, PG_COURSES, INDIAN_STATES } from '../../constants/courseOptions'
import styles from './LandingLeadForm.module.css'

export default function LandingLeadForm() {
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

  return (
    <div className={styles.floatWrap} id="enroll">
      <div className={styles.card}>
        {submitted ? (
          <div className={styles.successMsg}>
            <div className={styles.successIcon}><CheckCircle2 size={40} color="#059669" /></div>
            <h3>Thank You, {formData.name}!</h3>
            <p>Our counsellor will call you within 24 hours.</p>
          </div>
        ) : (
          <>
            <h3 className={styles.title}>Get Free Career Counselling</h3>
            <p className={styles.sub}>Fill in your details. Our expert will call you within 24 hours.</p>
            <form onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}>
              <div className={styles.formGroup}>
                <input type="text" name="name" placeholder="Enter your full name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <input type="tel" name="phone" placeholder="Enter 10-digit mobile number (e.g. 9876543210)" required pattern="[0-9]{10}" maxLength={10} value={formData.phone} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <select name="state" required value={formData.state} onChange={handleChange}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <select name="courseType" required value={formData.courseType} onChange={handleChange}>
                  <option value="">Select Course Type</option>
                  <option value="UG">UG Courses (Under Graduation)</option>
                  <option value="PG">PG Courses (Post Graduation)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <select name="course" required value={formData.course} onChange={handleChange} disabled={!formData.courseType}>
                  <option value="">{formData.courseType ? 'Select Course' : 'Select course type first'}</option>
                  {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting…' : 'Apply Now'}
              </button>
              <p className={styles.trust}><Lock size={11} /> Your information is 100% secure. No spam calls.</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
