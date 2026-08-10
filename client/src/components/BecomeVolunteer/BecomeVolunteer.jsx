import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Users,
  Handshake,
  Gift,
  ShieldCheck,
  Send,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Download,
} from 'lucide-react'
import { submitContact } from '../../services/contactService'
import styles from './BecomeVolunteer.module.css'

const WHO_CAN_VOLUNTEER = [
  'Students & research scholars',
  'Teachers & academicians',
  'Professionals & retired professionals',
  'Social workers',
  'Researchers',
  'IT & digital professionals',
  'Counsellors & trainers',
  'Corporate professionals',
  'Community members',
  'Individuals interested in social & educational development',
]

const AREAS_OF_CONTRIBUTION = [
  'Education & student support',
  'Skill development & training',
  'Research & academic activities',
  'Digital literacy',
  'Career guidance & mentoring',
  'Community-development programmes',
  'Senior citizen welfare',
  'Social awareness campaigns',
  'Workshops, seminars & conferences',
  'Fundraising & outreach',
  'Content development & communication',
  'Documentation & event management',
]

const WHAT_WE_OFFER = [
  'Meaningful social initiatives',
  'Educational & community-development experience',
  'Networking & professional interaction',
  'Participation certificates, where applicable',
  'Work with academicians, researchers & professionals',
  'Recognition for significant contributions',
]

const WHY_JOIN_US = [
  'Contribute to society',
  'Share your knowledge',
  'Develop new skills',
  'Connect with like-minded people',
  'Support education and research',
  'Support senior citizens and community welfare',
  'Gain meaningful experience',
  'Make your time count',
  'Be part of a growing network',
  'Create positive change',
]

const BLOCKS = [
  { title: 'Who Can Volunteer?', icon: Users, color: '#2563eb', bg: '#eff6ff', items: WHO_CAN_VOLUNTEER, twoCol: true },
  { title: 'Areas of Contribution', icon: Handshake, color: '#7c3aed', bg: '#faf5ff', items: AREAS_OF_CONTRIBUTION, twoCol: true },
  { title: 'What We Offer', icon: Gift, color: '#059669', bg: '#f0fdf4', items: WHAT_WE_OFFER, wide: true, twoCol: true },
]

const CONTACT_METHODS = ['Email', 'Phone', 'WhatsApp']

const INTERESTS = [
  'Volunteering',
  'Educational Programmes',
  'Training / FDP / Workshops',
  'Research',
  'Academic Programmes',
  'Senior Citizen Welfare',
  'Community Development',
  'Donation / Contribution',
  'Partnership / Collaboration',
  'Other',
]

function toList(value) {
  if (!value) return '—'
  return Array.isArray(value) ? (value.length ? value.join(', ') : '—') : value
}

function VolunteerEnquiryForm() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { contactMethod: '', interests: [] },
  })

  const mutation = useMutation({
    mutationFn: (d) => submitContact({
      name: d.name,
      email: d.email,
      subject: `Volunteer Enquiry – ${d.name}`,
      message: [
        `Full Name: ${d.name}`,
        `Email: ${d.email}`,
        `Mobile: ${d.mobile}`,
        `City / State: ${d.cityState || '—'}`,
        `Profession / Occupation: ${d.profession || '—'}`,
        `Area of Interest / Expertise: ${d.expertise || '—'}`,
        `Preferred Contact Method: ${d.contactMethod || '—'}`,
        `Preferred Time to Contact: ${d.preferredTime || '—'}`,
        `Interested In: ${toList(d.interests)}`,
        '',
        'How can we help you?',
        d.help,
        '',
        'Consent: Agreed to the collection and use of the information provided, in accordance with the Privacy Policy of Radiant Education Trust.',
      ].join('\n'),
    }),
    onSuccess: () => { setSubmitted(true); reset() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Submission failed. Please try again.'),
  })

  if (submitted) {
    return (
      <section className={styles.formSection} id="volunteer-enquiry">
        <div className="container">
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={36} color="#059669" />
            </div>
            <h3 className={styles.successTitle}>Enquiry Received!</h3>
            <p className={styles.successDesc}>
              Thank you for your interest in volunteering with Radiant Education Trust.
              Our team will get in touch with you shortly.
            </p>
            <button type="button" className={styles.successBtn} onClick={() => setSubmitted(false)}>
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.formSection} id="volunteer-enquiry">
      <div className="container">
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.formBadge}>Volunteer Inquiry Form</span>
            <h2 className={styles.formTitle}>Tell us how you would like to contribute</h2>
            <p className={styles.formSub}>
              Fields marked <span className={styles.req}>*</span> are required.
            </p>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
            <div className={`${styles.row} ${styles.row2}`}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="vol-name">
                  Full Name <span className={styles.req}>*</span>
                </label>
                <input
                  id="vol-name"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Your full name"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  })}
                />
                {errors.name && <p className={styles.errText}>{errors.name.message}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="vol-email">
                  Email Address <span className={styles.req}>*</span>
                </label>
                <input
                  id="vol-email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
                  })}
                />
                {errors.email && <p className={styles.errText}>{errors.email.message}</p>}
              </div>
            </div>

            <div className={`${styles.row} ${styles.row2}`}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="vol-mobile">
                  Mobile Number <span className={styles.req}>*</span>
                </label>
                <input
                  id="vol-mobile"
                  type="tel"
                  className={`${styles.input} ${errors.mobile ? styles.inputError : ''}`}
                  placeholder="10-digit mobile"
                  {...register('mobile', {
                    required: 'Mobile number is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit number' },
                  })}
                />
                {errors.mobile && <p className={styles.errText}>{errors.mobile.message}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="vol-city">City / State</label>
                <input
                  id="vol-city"
                  className={styles.input}
                  placeholder="e.g. Noida, Uttar Pradesh"
                  {...register('cityState')}
                />
              </div>
            </div>

            <div className={`${styles.row} ${styles.row2}`}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="vol-profession">Profession / Occupation</label>
                <input
                  id="vol-profession"
                  className={styles.input}
                  placeholder="e.g. Student, Teacher, IT Professional"
                  {...register('profession')}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="vol-expertise">Area of Interest / Expertise</label>
                <input
                  id="vol-expertise"
                  className={styles.input}
                  placeholder="e.g. Teaching, Counselling, Digital Literacy"
                  {...register('expertise')}
                />
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Preferred Method of Contact</span>
              <div className={styles.choiceRow}>
                {CONTACT_METHODS.map((m) => (
                  <label key={m} className={styles.choice}>
                    <input
                      type="radio"
                      value={m}
                      className={styles.choiceInput}
                      {...register('contactMethod')}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="vol-time">Preferred Time to Contact</label>
              <input
                id="vol-time"
                className={styles.input}
                placeholder="e.g. Weekdays, 4:00 PM – 7:00 PM"
                {...register('preferredTime')}
              />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>I am interested in</span>
              <div className={styles.choiceRow}>
                {INTERESTS.map((i) => (
                  <label key={i} className={styles.choice}>
                    <input
                      type="checkbox"
                      value={i}
                      className={styles.choiceInput}
                      {...register('interests')}
                    />
                    {i}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="vol-help">
                How can we help you? <span className={styles.req}>*</span>
              </label>
              <textarea
                id="vol-help"
                rows={4}
                className={`${styles.input} ${styles.textarea} ${errors.help ? styles.inputError : ''}`}
                placeholder="Tell us how you would like to contribute, or what you would like to know."
                {...register('help', {
                  required: 'Please tell us how we can help you',
                  minLength: { value: 10, message: 'Please provide at least 10 characters' },
                })}
              />
              {errors.help && <p className={styles.errText}>{errors.help.message}</p>}
            </div>

            <div className={styles.consentRow}>
              <input
                id="vol-consent"
                type="checkbox"
                className={styles.choiceInput}
                style={{ marginTop: '0.2rem' }}
                {...register('consent', { required: true })}
              />
              <span>
                <label htmlFor="vol-consent">
                  I agree to the collection and use of the information provided for responding to my
                  enquiry, in accordance with the{' '}
                </label>
                <Link to="/privacy-policy">Privacy Policy</Link> of Radiant Education Trust.
              </span>
            </div>
            {errors.consent && <p className={styles.errText}>Consent is required to submit this form.</p>}

            <button type="submit" disabled={mutation.isPending} className={styles.submitBtn}>
              <Send size={16} />
              {mutation.isPending ? 'Submitting…' : 'Submit Enquiry'}
            </button>

            <p className={styles.disclaimer}>
              Your details are safe and will never be shared or sold.
            </p>
          </form>
        </div>

        <div className={styles.contactStrip}>
          <span className={styles.contactStripItem}>
            <Mail size={14} />
            <a href="mailto:radianteducationtrust@gmail.com">radianteducationtrust@gmail.com</a>
          </span>
          <span className={styles.contactStripItem}>
            <Phone size={14} /> 8796278474 · 8512017549
          </span>
          <span className={styles.contactStripItem}>
            <MapPin size={14} /> A-141, Sec-48, Noida – 201301
          </span>
        </div>

        <div className={styles.downloadRow}>
          <a href="/documents/become-a-volunteer.docx" download className={styles.downloadBtn}>
            <Download size={15} /> Download Volunteer Information Sheet
          </a>
        </div>
      </div>
    </section>
  )
}

export default function BecomeVolunteer() {
  return (
    <>
      <div className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Get Involved</p>
          <h1 className={styles.heroTitle}>Become a Volunteer</h1>
          <p className={styles.heroTagline}>
            Make a Difference Through Your Time, Skills and Commitment
          </p>
          <p className={styles.heroSub}>
            Radiant Education Trust welcomes individuals who wish to contribute their time,
            knowledge, skills and experience towards educational, academic, social-welfare,
            research and community-development initiatives. Volunteering offers an opportunity to
            work with students, educators, researchers, senior citizens, communities and other
            stakeholders.
          </p>
          <a href="#volunteer-enquiry" className={styles.heroCta}>
            Fill the Volunteer Inquiry Form <ArrowRight size={15} />
          </a>
        </div>
      </div>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            {BLOCKS.map(({ title, icon: Icon, color, bg, items, wide, twoCol }) => (
              <div
                key={title}
                className={`${styles.block} ${wide ? styles.blockWide : ''}`}
                style={{ '--c': color, '--bg': bg }}
              >
                <div className={styles.blockHead}>
                  <div className={styles.iconWrap}>
                    <Icon size={20} color={color} />
                  </div>
                  <h2 className={styles.blockTitle}>{title}</h2>
                </div>
                <div className={`${styles.items} ${twoCol ? styles.itemsTwoCol : ''}`}>
                  {items.map((item) => (
                    <div key={item} className={styles.item}>
                      <span className={styles.dot} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.whyStrip}>
            <h2 className={styles.whyTitle}>Why Join Us?</h2>
            <div className={styles.whyChips}>
              {WHY_JOIN_US.map((w) => (
                <span key={w} className={styles.whyChip}>{w}</span>
              ))}
            </div>
          </div>

          <div className={styles.commitment}>
            <ShieldCheck size={20} color="var(--clr-accent-dark)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p className={styles.commitmentText}>
              <strong>Volunteer Commitment:</strong> Volunteers are expected to maintain
              professionalism, integrity, respect, confidentiality and responsible conduct while
              representing Radiant Education Trust.
            </p>
          </div>
        </div>
      </section>

      <VolunteerEnquiryForm />
    </>
  )
}
