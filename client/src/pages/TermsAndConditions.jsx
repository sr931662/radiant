import { Link } from 'react-router-dom'
import { Download, Mail, Phone, MapPin, Globe } from 'lucide-react'
import styles from './LegalPage.module.css'

const LAST_UPDATED = '10 August 2026'

const CLAUSES = [
  {
    title: 'Acceptance of Terms',
    text: 'By accessing or using the Radiant Education Trust website, you acknowledge that you have read, understood, and agree to these Terms and Conditions. If you do not agree, please refrain from using the website or its services.',
  },
  {
    title: 'Use of Website',
    text: 'The website is provided for informational, educational, academic, research, training, social-development, and welfare-related purposes, including information on the Trust’s programmes, initiatives, publications, educational services, and social-welfare activities. Users must not use it for unlawful, fraudulent, misleading, abusive, or unauthorised purposes or in any way harmful to the Trust.',
  },
  {
    title: 'Donations and Contributions',
    text: 'Donations and voluntary contributions are made voluntarily and will be used for charitable, educational, social-welfare, research, training, and other Trust activities in accordance with its objectives and applicable laws. Donors must provide accurate information and, where required, valid identification. The Trust is not responsible for loss of tax benefit or rejection caused by incorrect or incomplete donor information.',
  },
  {
    title: 'Educational and Programme Information',
    text: 'The Trust makes reasonable efforts to keep programme, training, research, event, publication, and admission information accurate and current. Details such as schedules, fees, eligibility, dates, venues, and faculty may be changed, postponed, or cancelled when necessary, with or without prior notice where circumstances require.',
  },
  {
    title: 'Intellectual Property Rights',
    text: 'Website content, including text, articles, educational and research materials, graphics, photographs, logos, designs, videos, documents, trademarks, and other materials, is owned or licensed by the Trust unless otherwise stated. Copying, reproducing, modifying, publishing, distributing, transmitting, displaying, or commercially exploiting such material requires prior written permission.',
  },
  {
    title: 'Third-Party Links and Services',
    text: 'Third-party links may be provided for information or convenience. The Trust does not necessarily endorse, control, or guarantee their accuracy, reliability, availability, or privacy practices. Users access such sites at their own risk and should review their respective terms and privacy policies.',
  },
  {
    title: 'User Conduct',
    text: 'Users must not: use the website unlawfully; submit false, misleading, or fraudulent information; attempt unauthorised access; upload malicious or harmful content; interfere with website operation or security; copy protected content without permission; or act in a manner damaging to the Trust’s reputation or interests.',
  },
  {
    title: 'Accuracy of Information',
    text: 'The Trust makes reasonable efforts to maintain accurate and reliable website information but does not guarantee that all information is complete, current, error-free, or uninterrupted. Users should verify important information directly with the Trust before relying on it for significant decisions.',
  },
  {
    title: 'Limitation of Liability',
    text: 'To the extent permitted by applicable law, the Trust shall not be liable for direct, indirect, incidental, consequential, or other losses arising from use of, inability to use, or reliance upon information provided through the website.',
  },
  {
    title: 'Website Availability',
    text: 'The Trust does not guarantee continuous, uninterrupted, secure, or error-free website availability and reserves the right to modify, suspend, or discontinue any part of the website or its services when necessary.',
  },
  {
    title: 'Privacy and Personal Information',
    text: 'Personal information submitted through the website shall be handled in accordance with the Trust’s applicable Privacy Policy. Users are responsible for ensuring that submitted information is accurate and lawful.',
    link: { to: '/privacy-policy', label: 'Read the Privacy Policy →' },
  },
  {
    title: 'Changes to Terms and Conditions',
    text: 'The Trust may modify, update, or revise these Terms and Conditions at any time. Changes become effective upon publication on the website. Users are encouraged to review this page periodically.',
  },
  {
    title: 'Governing Law',
    text: 'These Terms and Conditions are governed by and interpreted in accordance with the laws of India. Disputes shall be subject to the jurisdiction of competent courts in Uttar Pradesh, India, unless otherwise required by applicable law.',
  },
]

const ACCEPTANCE = {
  title: 'Acceptance',
  text: 'By continuing to access or use the Radiant Education Trust website, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.',
}

export default function TermsAndConditions() {
  return (
    <div>
      <div className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Legal</p>
          <h1 className={styles.heroTitle}>Terms and Conditions</h1>
          <p className={styles.heroSub}>
            The terms that govern your use of the Radiant Education Trust website, its programmes,
            publications, and services.
          </p>
          <span className={styles.updated}>Last Updated: {LAST_UPDATED}</span>
        </div>
      </div>

      <div className="container">
        <div className={styles.body}>
          {CLAUSES.map((clause, i) => (
            <section key={clause.title} className={styles.clause}>
              <div className={styles.clauseHead}>
                <span className={styles.clauseNum}>{i + 1}</span>
                <h2 className={styles.clauseTitle}>{clause.title}</h2>
              </div>
              <p className={styles.clauseText}>{clause.text}</p>
              {clause.link && (
                <Link
                  to={clause.link.to}
                  style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clr-primary)' }}
                >
                  {clause.link.label}
                </Link>
              )}
            </section>
          ))}

          {/* 14. Contact Information */}
          <section className={styles.clause}>
            <div className={styles.clauseHead}>
              <span className={styles.clauseNum}>{CLAUSES.length + 1}</span>
              <h2 className={styles.clauseTitle}>Contact Information</h2>
            </div>
            <p className={styles.clauseText}>
              For questions, concerns, clarification, or complaints, users may contact Radiant
              Education Trust through its official contact details.
            </p>
            <div className={styles.contactCard} style={{ marginTop: '1.25rem' }}>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <Mail size={16} color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <a href="mailto:radianteducationtrust@gmail.com">radianteducationtrust@gmail.com</a>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={16} color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>8796278474 &nbsp;·&nbsp; 8512017549</span>
                </div>
                <div className={styles.contactItem}>
                  <MapPin size={16} color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>
                    Registered: 215 Prabhavi Apartment, Sec-10, Dwarka, Delhi<br />
                    Correspondence: A-141, Sec-48, Noida – 201301
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <Globe size={16} color="var(--clr-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <Link to="/contact">Contact form</Link>
                </div>
              </div>
            </div>
          </section>

          {/* 15. Acceptance */}
          <section className={styles.clause}>
            <div className={styles.clauseHead}>
              <span className={styles.clauseNum}>{CLAUSES.length + 2}</span>
              <h2 className={styles.clauseTitle}>{ACCEPTANCE.title}</h2>
            </div>
            <p className={styles.clauseText}>{ACCEPTANCE.text}</p>
          </section>

          <div className={styles.downloadRow}>
            <a href="/documents/terms-and-conditions.docx" download className={styles.downloadBtn}>
              <Download size={15} /> Download Terms and Conditions
            </a>
            <span className={styles.downloadNote}>DOCX · 1 page</span>
          </div>
        </div>
      </div>
    </div>
  )
}
