import { MapPin, Phone, Clock, Globe, MessageCircle, Send } from 'lucide-react'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <div className={styles.page}>
      {/* Page hero */}
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
          {/* Info cards */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}><MapPin size={22} /></div>
              <div>
                <h3 className={styles.infoTitle}>Address</h3>
                <p className={styles.infoText}>12, Radiant Bhawan, Education Colony,<br />Lucknow, UP 226001, India</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}><Phone size={22} /></div>
              <div>
                <h3 className={styles.infoTitle}>Phone</h3>
                <p className={styles.infoText}>1800-000-0000 (Toll Free)<br />Mon–Sat, 10 AM – 6 PM IST</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}><Globe size={22} /></div>
              <div>
                <h3 className={styles.infoTitle}>Email</h3>
                <p className={styles.infoText}>info@radianttrust.org<br />support@radianttrust.org</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}><Clock size={22} /></div>
              <div>
                <h3 className={styles.infoTitle}>Office Hours</h3>
                <p className={styles.infoText}>Monday – Saturday<br />10:00 AM – 6:00 PM IST</p>
              </div>
            </div>
            <button className={styles.waBtn}>
              <MessageCircle size={18} /> Chat on WhatsApp
            </button>
          </div>

          {/* Contact form */}
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <h2 className={styles.formTitle}>Send a Message</h2>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input className={styles.input} type="text" placeholder="Your full name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input className={styles.input} type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Subject</label>
              <input className={styles.input} type="text" placeholder="How can we help?" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Message</label>
              <textarea className={styles.textarea} rows={6} placeholder="Write your message here..." />
            </div>
            <button type="submit" className={styles.submitBtn}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
