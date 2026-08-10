import { Download, Mail, Phone, MapPin } from 'lucide-react'
import styles from './LegalPage.module.css'

const LAST_UPDATED = '10 August 2026'

const CLAUSES = [
  {
    title: 'Information We Collect',
    paras: [
      'Radiant Education Trust ("we", "us", "our") respects your privacy and is committed to protecting your personal information.',
      'When you visit our website, register for an educational or training programme, participate in academic or research activities, make a voluntary contribution, submit an enquiry, or otherwise interact with us, we may collect personal information such as:',
    ],
    bullets: [
      'Name',
      'Email address',
      'Phone/mobile number',
      'Postal address',
      'Educational and professional information, where relevant',
      'PAN or other identification details, where required for statutory, donation, or tax-related purposes',
      'Information voluntarily submitted through enquiry, registration, application, or feedback forms',
    ],
    after: [
      'We collect only such information as is reasonably necessary for providing our services and carrying out the activities and objectives of the Trust.',
    ],
  },
  {
    title: 'How We Use Your Information',
    paras: ['The information collected may be used to:'],
    bullets: [
      'Process registrations, applications, donations, and voluntary contributions;',
      'Provide information regarding educational, academic, training, research, and social-welfare programmes;',
      'Issue receipts and other relevant documents;',
      'Communicate information about programmes, events, workshops, seminars, FDPs, publications, and other activities;',
      'Respond to enquiries, requests, feedback, and communications;',
      'Maintain appropriate administrative and statutory records;',
      'Comply with applicable legal, regulatory, accounting, and tax requirements;',
      'Improve our website, programmes, services, and user experience.',
    ],
    after: [
      'We shall use personal information only for legitimate purposes connected with the activities and objectives of Radiant Education Trust.',
    ],
  },
  {
    title: 'Data Security and Protection',
    paras: [
      'Radiant Education Trust takes reasonable administrative, technical, and organisational measures to protect personal information against unauthorised access, misuse, alteration, disclosure, loss, or destruction.',
      'Where online payments are facilitated through third-party payment gateways, payment transactions may be processed through their secure and encrypted systems. Radiant Education Trust does not ordinarily store complete credit/debit card details, banking passwords, or other sensitive payment credentials on its own servers.',
      'However, no method of electronic transmission or storage can be guaranteed to be completely secure.',
    ],
  },
  {
    title: 'Sharing of Personal Information',
    paras: [
      'Radiant Education Trust does not sell, rent, or trade personal information of users.',
      'Information may be shared with authorised service providers, payment processors, professional advisers, Government authorities, regulators, or other entities where reasonably necessary to:',
    ],
    bullets: [
      'Provide requested services;',
      'Process payments;',
      'Meet statutory or legal requirements;',
      'Maintain records;',
      'Protect the rights, property, safety, or interests of the Trust or its users.',
    ],
    after: [
      'Any such sharing shall be limited to the purpose for which the information is required, subject to applicable law.',
    ],
  },
  {
    title: 'Cookies and Website Technologies',
    paras: [
      'Our website may use cookies or similar technologies to improve website functionality, analyse website usage, remember user preferences, and enhance the overall user experience.',
      'Users may manage or disable cookies through their browser settings. However, disabling certain cookies may affect the functionality of some parts of the website.',
    ],
  },
  {
    title: 'Third-Party Websites',
    paras: [
      'Our website may contain links to third-party websites, payment gateways, educational platforms, social-media platforms, or other external services.',
      'Radiant Education Trust is not responsible for the privacy practices, security, content, or policies of third-party websites. Users are advised to review the privacy policies of such websites before providing personal information.',
    ],
  },
  {
    title: "Children's Privacy",
    paras: [
      'Our website and programmes are not intended to knowingly collect unnecessary personal information from children. Where participation of minors is involved in an educational or social programme, appropriate consent and safeguards shall be followed in accordance with applicable requirements.',
    ],
  },
  {
    title: 'Data Retention',
    paras: [
      'Personal information shall generally be retained only for as long as reasonably necessary to fulfil the purpose for which it was collected, comply with legal and regulatory obligations, maintain financial and administrative records, resolve disputes, and enforce applicable agreements and policies.',
    ],
  },
  {
    title: 'Your Rights',
    paras: ['Subject to applicable law, users may contact Radiant Education Trust to:'],
    bullets: [
      'Request information regarding personal data held by the Trust;',
      'Seek correction of inaccurate or incomplete information;',
      'Raise concerns regarding the use of their personal information;',
      'Request deletion of information where legally permissible.',
    ],
    after: [
      'Certain information may need to be retained where required by law, regulation, accounting requirements, or legitimate institutional purposes.',
    ],
  },
  {
    title: 'Changes to this Privacy Policy',
    paras: [
      'Radiant Education Trust may update or modify this Privacy Policy from time to time to reflect changes in its activities, technology, legal requirements, or privacy practices.',
      'The revised Privacy Policy shall be published on the website with an updated "Last Updated" date.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <div>
      <div className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Legal</p>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSub}>
            How Radiant Education Trust collects, uses, protects, and retains the personal
            information you share with us.
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

              {clause.paras?.map((p) => (
                <p key={p} className={styles.clauseText}>{p}</p>
              ))}

              {clause.bullets && (
                <div className={styles.bullets}>
                  {clause.bullets.map((b) => (
                    <div key={b} className={styles.bullet}>
                      <span className={styles.bulletDot} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {clause.after?.map((p) => (
                <p key={p} className={styles.clauseText} style={{ marginTop: '0.95rem' }}>{p}</p>
              ))}
            </section>
          ))}

          <div className={styles.contactCard}>
            <h3 className={styles.contactTitle}>Privacy Queries &amp; Requests</h3>
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
            </div>
          </div>

          <div className={styles.downloadRow}>
            <a href="/documents/privacy-policy.docx" download className={styles.downloadBtn}>
              <Download size={15} /> Download Privacy Policy
            </a>
            <span className={styles.downloadNote}>DOCX · 1 page</span>
          </div>
        </div>
      </div>
    </div>
  )
}
