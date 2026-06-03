import { MapPin, Phone, Clock, Globe, MessageCircle, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { submitContact } from '../services/contactService'
import styles from './Contact.module.css'

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: (d) => submitContact(d),
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you within 24 hours.")
      reset()
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to send message. Please try again.')
    },
  })

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <p className="section-label">Get In Touch</p>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.sub}>
            Have a question, want to partner, or need help with your donation?
            We're here and happy to help.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}><MapPin size={22} /></div>
              <div>
                <h3 className={styles.infoTitle}>Address</h3>
                <p className={styles.infoText}>Registered: 215 Prabhavi Apartment, Sec-10, Dwarka, Delhi<br />Correspondence: A-141, Sec-48, Noida – 201301</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}><Phone size={22} /></div>
              <div>
                <h3 className={styles.infoTitle}>Phone</h3>
                <p className={styles.infoText}>8796278474 · 8512017549<br />Mon–Sat, 10 AM – 6 PM IST</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}><Globe size={22} /></div>
              <div>
                <h3 className={styles.infoTitle}>Email</h3>
                <p className={styles.infoText}>radianteducationtrust@gmail.com<br />Mr. Santosh Upadhyay – Coordinator</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}><Clock size={22} /></div>
              <div>
                <h3 className={styles.infoTitle}>Office Hours</h3>
                <p className={styles.infoText}>Monday – Saturday<br />10:00 AM – 6:00 PM IST</p>
              </div>
            </div>
            <a href="https://wa.me/918796278474" target="_blank" rel="noreferrer" className={styles.waBtn}>
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>

          <form className={styles.form} onSubmit={handleSubmit((d) => mutation.mutate(d))}>
            <h2 className={styles.formTitle}>Send a Message</h2>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your full name"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                />
                {errors.name && <p className={styles.err}>{errors.name.message}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                />
                {errors.email && <p className={styles.err}>{errors.email.message}</p>}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Subject</label>
              <input
                className={styles.input}
                type="text"
                placeholder="How can we help?"
                {...register('subject', { required: 'Subject is required', minLength: { value: 5, message: 'Min 5 chars' } })}
              />
              {errors.subject && <p className={styles.err}>{errors.subject.message}</p>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Message</label>
              <textarea
                className={styles.textarea}
                rows={6}
                placeholder="Write your message here..."
                {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Min 10 chars' } })}
              />
              {errors.message && <p className={styles.err}>{errors.message.message}</p>}
            </div>
            <button type="submit" className={styles.submitBtn} disabled={mutation.isPending}>
              <Send size={16} />
              {mutation.isPending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
