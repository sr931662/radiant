import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Send, Phone, Mail, CheckCircle2, FileText } from 'lucide-react'
import { submitContact } from '../../services/contactService'
import styles from './EnquiryForm.module.css'

const PROGRAM_OPTIONS = [
  '', 'MBA', 'MCA', 'MSC', 'MA', 'M.COM', 'MSW',
  'BBA', 'B.COM', 'BCA', 'BA',
  'PhD Guidance', 'FDP / Workshop', 'Other',
]

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { gender: '', country: 'India' },
  })

  const mutation = useMutation({
    mutationFn: (d) => submitContact({
      name: d.name,
      email: d.email,
      subject: 'Enquiry Form – (A)',
      message: [
        `Full Name: ${d.name}`,
        `Gender: ${d.gender || '—'}`,
        `Designation: ${d.designation || '—'}`,
        `Department / Discipline: ${d.department || '—'}`,
        `Institution / Organisation: ${d.institution || '—'}`,
        `City: ${d.city || '—'}`,
        `State: ${d.state || '—'}`,
        `Country: ${d.country || '—'}`,
        `Email: ${d.email}`,
        `Mobile: ${d.mobile}`,
        `Programme 1: ${d.prog1 || '—'}`,
        `Programme 2: ${d.prog2 || '—'}`,
        `Programme 3: ${d.prog3 || '—'}`,
        `Programme 4: ${d.prog4 || '—'}`,
      ].join('\n'),
    }),
    onSuccess: () => { setSubmitted(true); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to send. Please try again.'),
  })

  if (submitted) {
    return (
      <section className={styles.section}>
        <div className="container">
          <div className={styles.successBox}>
            <div className={styles.successIcon}><CheckCircle2 size={40} color="#059669" /></div>
            <h3 className={styles.successTitle}>Enquiry Received!</h3>
            <p className={styles.successDesc}>Thank you. Our team will contact you within 24 hours.</p>
            <button className={styles.successBtn} onClick={() => setSubmitted(false)}>Submit Another Enquiry</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>

          {/* ── Left panel ── */}
          <div className={styles.infoPanelBg}>
            <div className={styles.infoPanel}>
              <div className={styles.infoBadge}>Enquiry Form – (A)</div>
              <h2 className={styles.infoTitle}>Get Free Admission Guidance</h2>
              <p className={styles.infoDesc}>
                Fill in your details and our expert counsellors will help you choose the right
                programme — completely free.
              </p>

              <div className={styles.infoPoints}>
                {[
                  'Free career counselling',
                  'Course & specialisation guidance',
                  'University selection support',
                  'Admission process help',
                  'Scholarship information',
                ].map((pt) => (
                  <div key={pt} className={styles.infoPoint}>
                    <CheckCircle2 size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className={styles.contactBlock}>
                <p className={styles.contactOrg}>Radiant Education Trust <span>(Since 2008)</span></p>
                <div className={styles.contactBlockItem}>
                  <div className={styles.contactIconWrap}><Phone size={14} /></div>
                  <span>8796278474 &nbsp;·&nbsp; 8512017549</span>
                </div>
                <div className={styles.contactBlockItem}>
                  <div className={styles.contactIconWrap}><Mail size={14} /></div>
                  <span>radianteducationtrust@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right form ── */}
          <div className={styles.formPanel}>
            <div className={styles.formHeader}>
              <FileText size={20} color="#2563eb" />
              <h3 className={styles.formTitle}>Personal Information</h3>
            </div>
            <p className={styles.formSub}>All fields marked <span className={styles.req}>*</span> are required.</p>

            <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>

              {/* Row 1: Full Name */}
              <div className={styles.field}>
                <label className={styles.label}>1. Full Name <span className={styles.req}>*</span></label>
                <input
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Your full name"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                />
                {errors.name && <p className={styles.errText}>{errors.name.message}</p>}
              </div>

              {/* Row 2: Gender */}
              <div className={styles.field}>
                <label className={styles.label}>2. Gender</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="Male" {...register('gender')} className={styles.radioInput} />
                    Male
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="Female" {...register('gender')} className={styles.radioInput} />
                    Female
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="Other" {...register('gender')} className={styles.radioInput} />
                    Other
                  </label>
                </div>
              </div>

              {/* Row 3 & 4: Designation + Department */}
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>3. Designation</label>
                  <input className={styles.input} placeholder="e.g. Student, Professor" {...register('designation')} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>4. Department / Discipline</label>
                  <input className={styles.input} placeholder="e.g. Commerce, Science" {...register('department')} />
                </div>
              </div>

              {/* Row 5: Institution */}
              <div className={styles.field}>
                <label className={styles.label}>5. Institution / Organisation Name</label>
                <input className={styles.input} placeholder="Your college, university or organisation" {...register('institution')} />
              </div>

              {/* Row 6, 7, 8: City, State, Country */}
              <div className={styles.formRow3}>
                <div className={styles.field}>
                  <label className={styles.label}>6. City</label>
                  <input className={styles.input} placeholder="City" {...register('city')} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>7. State</label>
                  <input className={styles.input} placeholder="State" {...register('state')} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>8. Country</label>
                  <input className={styles.input} placeholder="Country" {...register('country')} />
                </div>
              </div>

              {/* Row 9 & 10: Email + Mobile */}
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>9. Email ID <span className={styles.req}>*</span></label>
                  <input
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                  />
                  {errors.email && <p className={styles.errText}>{errors.email.message}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>10. Mobile Number <span className={styles.req}>*</span></label>
                  <input
                    className={`${styles.input} ${errors.mobile ? styles.inputError : ''}`}
                    type="tel"
                    placeholder="10-digit mobile"
                    {...register('mobile', { required: 'Mobile is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })}
                  />
                  {errors.mobile && <p className={styles.errText}>{errors.mobile.message}</p>}
                </div>
              </div>

              {/* Row 11: Programme choices */}
              <div className={styles.field}>
                <label className={styles.label}>11. Programmes you are interested in</label>
                <div className={styles.progGrid}>
                  {[
                    { name: 'prog1', label: '1st Choice' },
                    { name: 'prog2', label: '2nd Choice' },
                    { name: 'prog3', label: '3rd Choice' },
                    { name: 'prog4', label: '4th Choice' },
                  ].map(({ name, label }) => (
                    <div key={name} className={styles.progField}>
                      <span className={styles.progNum}>{label}</span>
                      <select className={styles.input} {...register(name)} defaultValue="">
                        {PROGRAM_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt || '— Select —'}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={mutation.isPending} className={styles.submitBtn}>
                <Send size={16} />
                {mutation.isPending ? 'Sending…' : 'Submit Enquiry'}
              </button>

              <p className={styles.disclaimer}>
                Your details are safe and will never be shared.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
