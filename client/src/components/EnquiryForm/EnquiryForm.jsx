import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Send, Phone, Mail, User, BookOpen, CheckCircle2 } from 'lucide-react'
import { submitContact } from '../../services/contactService'
import styles from './EnquiryForm.module.css'

const COURSE_OPTIONS = [
  'MBA', 'MCA', 'MSC', 'MA', 'M.COM', 'MSW',
  'BBA', 'B.COM', 'BCA', 'BA',
  'PhD Guidance', 'FDP / Workshop', 'Other',
]

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: (d) => submitContact({
      name: d.name,
      email: d.email,
      subject: `Course Enquiry: ${d.course}`,
      message: `Phone: ${d.phone}\nCourse Interested In: ${d.course}\nMessage: ${d.message || '—'}`,
    }),
    onSuccess: () => {
      setSubmitted(true)
      reset()
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to send enquiry. Please try again.')
    },
  })

  if (submitted) {
    return (
      <section className={styles.section}>
        <div className="container">
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={40} color="#059669" />
            </div>
            <h3 className={styles.successTitle}>Enquiry Received!</h3>
            <p className={styles.successDesc}>
              Thank you for your interest. Our team will contact you within 24 hours.
            </p>
            <button className={styles.successBtn} onClick={() => setSubmitted(false)}>
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          {/* Left info panel */}
          <div className={styles.infoPanelBg}>
            <div className={styles.infoPanel}>
              <div className={styles.infoBadge}>Quick Enquiry</div>
              <h2 className={styles.infoTitle}>Get Free Admission Guidance</h2>
              <p className={styles.infoDesc}>
                Our expert counsellors will help you choose the right program and guide you through the
                entire admission process — completely free.
              </p>

              <div className={styles.infoPoints}>
                {[
                  'Free career counselling',
                  'Course & specialisation guidance',
                  'University selection support',
                  'Admission process help',
                  'Scholarship information',
                ].map((point) => (
                  <div key={point} className={styles.infoPoint}>
                    <CheckCircle2 size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className={styles.contactBlock}>
                <div className={styles.contactBlockItem}>
                  <div className={styles.contactIconWrap}><User size={16} /></div>
                  <span>Mr. Santosh Upadhyay — Coordinator</span>
                </div>
                <div className={styles.contactBlockItem}>
                  <div className={styles.contactIconWrap}><Phone size={16} /></div>
                  <span>8796278474 · 8512017549</span>
                </div>
                <div className={styles.contactBlockItem}>
                  <div className={styles.contactIconWrap}><Mail size={16} /></div>
                  <span>radianteducationtrust@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className={styles.formPanel}>
            <div className={styles.formHeader}>
              <BookOpen size={20} color="#2563eb" />
              <h3 className={styles.formTitle}>Course Enquiry Form</h3>
            </div>
            <p className={styles.formSub}>Fill in your details and we'll reach out shortly.</p>

            <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name <span className={styles.req}>*</span></label>
                  <input
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Your full name"
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                  />
                  {errors.name && <p className={styles.errText}>{errors.name.message}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Mobile Number <span className={styles.req}>*</span></label>
                  <input
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    placeholder="10-digit mobile number"
                    type="tel"
                    {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })}
                  />
                  {errors.phone && <p className={styles.errText}>{errors.phone.message}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email Address <span className={styles.req}>*</span></label>
                <input
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="you@example.com"
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                />
                {errors.email && <p className={styles.errText}>{errors.email.message}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Course Interested In <span className={styles.req}>*</span></label>
                <select
                  className={`${styles.input} ${errors.course ? styles.inputError : ''}`}
                  {...register('course', { required: 'Please select a course' })}
                  defaultValue=""
                >
                  <option value="" disabled>Select a course or program</option>
                  {COURSE_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.course && <p className={styles.errText}>{errors.course.message}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Message <span className={styles.optional}>(optional)</span></label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Any specific questions or requirements?"
                  {...register('message')}
                />
              </div>

              <button type="submit" disabled={mutation.isPending} className={styles.submitBtn}>
                <Send size={16} />
                {mutation.isPending ? 'Sending Enquiry…' : 'Send Enquiry'}
              </button>

              <p className={styles.disclaimer}>
                We respect your privacy. Your details are safe and will never be shared.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
