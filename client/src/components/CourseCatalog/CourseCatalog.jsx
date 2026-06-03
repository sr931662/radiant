import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, BookOpen, ChevronRight, Phone, Mail, User } from 'lucide-react'
import styles from './CourseCatalog.module.css'

const PG_COURSES = [
  { sno: 1,  program: 'MBA', specialization: 'Healthcare Management' },
  { sno: 2,  program: 'MBA', specialization: 'Agribusiness Management' },
  { sno: 3,  program: 'MBA', specialization: 'Pharmaceutical Management' },
  { sno: 4,  program: 'MBA', specialization: 'Family Managed Business' },
  { sno: 5,  program: 'MBA', specialization: 'Retail Management' },
  { sno: 6,  program: 'MBA', specialization: 'Tourism & Event Management' },
  { sno: 7,  program: 'MBA', specialization: 'Forensic Accounting & Corporate Fraud Investigation' },
  { sno: 8,  program: 'MBA', specialization: 'Power' },
  { sno: 9,  program: 'MBA', specialization: 'Oil and Gas Management' },
  { sno: 10, program: 'MBA', specialization: 'Logistics Supply Chain Management' },
  { sno: 11, program: 'MBA', specialization: 'International Business' },
  { sno: 12, program: 'MBA', specialization: 'Digital Business' },
  { sno: 13, program: 'MBA', specialization: 'Infrastructure Management' },
  { sno: 14, program: 'MBA', specialization: 'Dual Specialisation' },
  { sno: 15, program: 'MBA', specialization: 'Banking and Financial Services' },
  { sno: 16, program: 'MBA', specialization: 'Business Analytics' },
  { sno: 17, program: 'MBA', specialization: 'Supply Chain Management' },
  { sno: 18, program: 'MCA', specialization: 'Blockchain Technology and Management' },
  { sno: 19, program: 'MCA', specialization: 'Machine Learning and Artificial Intelligence' },
  { sno: 20, program: 'MCA', specialization: 'Augmented Reality and Virtual Reality' },
  { sno: 21, program: 'MCA', specialization: 'Cyber Security' },
  { sno: 22, program: 'MCA', specialization: 'Cyber Security and Forensics' },
  { sno: 23, program: 'MSC', specialization: 'Data Science' },
  { sno: 24, program: 'MSC', specialization: 'Mathematics' },
  { sno: 25, program: 'MSC', specialization: 'Economics' },
  { sno: 26, program: 'M.COM', specialization: 'Financial Technology' },
  { sno: 27, program: 'MA', specialization: 'Sociology' },
  { sno: 28, program: 'MA', specialization: 'English' },
  { sno: 29, program: 'MA', specialization: 'Economics' },
  { sno: 30, program: 'MA', specialization: 'Public Policy & Governance' },
  { sno: 31, program: 'MSW', specialization: 'General' },
]

const UG_COURSES = [
  { program: 'BBA', specialization: 'Operation Management' },
  { program: 'BBA', specialization: 'Financial Management' },
  { program: 'BBA', specialization: 'Human Resource Management' },
  { program: 'BBA', specialization: 'Marketing Management' },
  { program: 'BBA', specialization: 'Data Analytics' },
  { program: 'BBA', specialization: 'Finance/HR/Marketing/Supply Chain' },
  { program: 'BBA', specialization: 'Business Analytics' },
  { program: 'B.COM', specialization: 'International Finance & Accounting' },
  { program: 'B.COM', specialization: 'Hons.' },
  { program: 'B.COM', specialization: 'General' },
  { program: 'BCA', specialization: 'Artificial Intelligence & Data Science' },
  { program: 'BCA', specialization: 'Cloud Computing & Cyber Security' },
  { program: 'BCA', specialization: 'Data Analytics' },
  { program: 'BCA', specialization: 'Cloud Security' },
  { program: 'BCA', specialization: 'General' },
  { program: 'BCA', specialization: 'FinTech' },
  { program: 'BA', specialization: 'General' },
  { program: 'BA', specialization: 'JMC' },
  { program: 'BA', specialization: 'Hindi' },
]

const PROGRAM_COLORS = {
  MBA: '#1d4ed8', MCA: '#7c3aed', MSC: '#0891b2',
  'M.COM': '#059669', MA: '#b45309', MSW: '#dc2626',
  BBA: '#16a34a', 'B.COM': '#2563eb', BCA: '#7c3aed', BA: '#ea580c',
}

export default function CourseCatalog() {
  const [activeTab, setActiveTab] = useState('pg')
  const navigate = useNavigate()
  const courses = activeTab === 'pg' ? PG_COURSES : UG_COURSES

  return (
    <section className={styles.section}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <GraduationCap size={14} />
            Admission Guidance Available at Your Door
          </div>
          <h2 className={styles.heading}>Online UG / PG Courses</h2>
          <p className={styles.sub}>For Working Executives · Since 2008</p>
        </div>

        {/* Tab switcher */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'pg' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('pg')}>
            PG Courses <span className={styles.tabCount}>{PG_COURSES.length}</span>
          </button>
          <button className={`${styles.tab} ${activeTab === 'ug' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('ug')}>
            UG Courses <span className={styles.tabCount}>{UG_COURSES.length}</span>
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {activeTab === 'pg' && <th>S.No</th>}
                <th>{activeTab === 'pg' ? 'PG Course' : 'UG Course'}</th>
                <th>Specialisation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((row, i) => {
                const color = PROGRAM_COLORS[row.program] || '#374151'
                return (
                  <tr key={i} className={styles.row}>
                    {activeTab === 'pg' && <td className={styles.sno}>{row.sno}</td>}
                    <td>
                      <span className={styles.programBadge} style={{ background: color + '18', color }}>
                        {row.program}
                      </span>
                    </td>
                    <td className={styles.specCell}>{row.specialization}</td>
                    <td>
                      <button className={styles.applyBtn} onClick={() => navigate('/contact')}>
                        Enquire <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* PhD strip */}
        <div className={styles.phdStrip}>
          <div className={styles.phdLeft}>
            <BookOpen size={20} color="#7c3aed" />
            <div>
              <p className={styles.phdTitle}>Special Guidance Also Available For:</p>
              <p className={styles.phdItems}>Regular Full-Time Ph.D. &nbsp;·&nbsp; Part-Time Ph.D.</p>
            </div>
          </div>
          <div className={styles.phdRight}>
            <span className={styles.phdBadge}>Ph.D. Admissions</span>
            <button className={styles.phdBtn} onClick={() => navigate('/contact')}>
              Apply Now <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Contact strip */}
        <div className={styles.contactStrip}>
          <div className={styles.contactItem}><User size={15} /> Mr. Santosh Upadhyay</div>
          <div className={styles.contactItem}><Phone size={15} /> 8796278474 · 8512017549</div>
          <div className={styles.contactItem}><Mail size={15} /> radianteducationtrust@gmail.com</div>
        </div>
      </div>
    </section>
  )
}
