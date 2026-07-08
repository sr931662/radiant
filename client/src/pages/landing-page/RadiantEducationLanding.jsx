import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RadiantEducationLanding.module.css';
import logoSrc from '../landing-assets/RadiantEducation-Assets/logo.svg';
import studentImg from '../landing-assets/RadiantEducation-Assets/student.png';
import studentsGroupImg from '../landing-assets/RadiantEducation-Assets/students-group.jpg';
import { UG_COURSES, PG_COURSES, INDIAN_STATES } from '../../constants/courseOptions';

const COURSE_CARDS = [
  { icon: '🎓', bg: '#eff6ff', color: '#2563eb', title: 'Online MBA', type: 'PG', desc: '#1 Trending — Specializations in Marketing, Finance, HR, IT, Operations & more. 2-year program.', tags: ['🔥 Most Popular', 'PG Course'] },
  { icon: '💻', bg: '#ecfdf5', color: '#059669', title: 'Online BCA', type: 'UG', desc: '#2 Trending — Launch your tech career with a 3-year computer applications degree. High job demand.', tags: ['🔥 Trending 2026', 'UG Course'] },
  { icon: '💼', bg: '#fef3c7', color: '#d97706', title: 'Online BBA', type: 'UG', desc: '#3 Trending — Build your business foundation. 3-year undergraduate program from top universities.', tags: ['🔥 Trending 2026', 'UG Course'] },
  { icon: '📈', bg: '#fce7f3', color: '#db2777', title: 'Online MCA', type: 'PG', desc: '#4 Trending — Advanced computer science program. 2-year postgrad for BCA/B.Sc graduates.', tags: ['High Demand', 'PG Course'] },
  { icon: '💰', bg: '#f0fdf4', color: '#16a34a', title: 'Online B.Com', type: 'UG', desc: '#5 Trending — Commerce degree for accounting, finance & business professionals. Highly affordable.', tags: ['Affordable', 'UG Course'] },
  { icon: '📊', bg: '#fff7ed', color: '#ea580c', title: 'Online M.Com', type: 'PG', desc: '#6 Trending — Master of Commerce for finance & accounting professionals. Career booster.', tags: ['Career Upgrade', 'PG Course'] },
  { icon: '🧠', bg: '#f0fdf4', color: '#0891b2', title: 'Online M.Sc Data Science', type: 'PG', desc: '#7 Trending — Future-proof your career with Data Science & AI. India\'s fastest growing field.', tags: ['🔥 Trending 2026', 'PG Course'] },
  { icon: '📰', bg: '#fdf4ff', color: '#9333ea', title: 'Online BA - JMC', type: 'UG', desc: '#8 Trending — Journalism & Mass Communication. Media, PR & digital content careers.', tags: ['Creative Field', 'UG Course'] },
  { icon: '📚', bg: '#ede9fe', color: '#7c3aed', title: 'Online MA - JMC', type: 'PG', desc: '#9 Trending — Master\'s in Journalism & Mass Communication. Media leadership roles.', tags: ['Media Career', 'PG Course'] },
  { icon: '🌐', bg: '#f0f9ff', color: '#0284c7', title: 'Online MBA - Digital Marketing', type: 'PG', desc: '#10 Trending — Specialized MBA in Digital Marketing. India\'s most in-demand business skill.', tags: ['🔥 Hot in 2026', 'PG Course'] },
  { icon: '⚖️', bg: '#fef9ec', color: '#b45309', title: 'Online BA - General', type: 'UG', desc: 'Flexible 3-year arts degree. Study History, Political Science, Sociology & more from home.', tags: ['Flexible Schedule', 'UG Course'] },
  { icon: '🤖', bg: '#f0fdf4', color: '#059669', title: 'Online BCA - AI & Data Science', type: 'UG', desc: 'Future-ready BCA with AI & Data Science specialization. India\'s fastest growing tech skill.', tags: ['🔥 Hot in 2026', 'UG Course'] },
];

const WHY_CARDS = [
  {
    title: 'Expert Career Counselling',
    desc: 'One-on-one guidance to pick the right course and university based on your goals and budget.',
    color: '#2563eb', bg: '#eff6ff',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/><path d="M8.5 8.5a5.5 5.5 0 1 1 7.07 7.07"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></svg>
  },
  {
    title: '100% UGC Approved',
    desc: 'Every university and course we recommend is UGC-recognized and NAAC accredited.',
    color: '#059669', bg: '#ecfdf5',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>
  },
  {
    title: 'Lowest Fee Guarantee',
    desc: 'Compare and get the best fee structure with easy EMI options. No hidden charges.',
    color: '#d97706', bg: '#fef3c7',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
  },
  {
    title: 'End-to-End Support',
    desc: 'From admission to exams to degree — our team supports you at every step.',
    color: '#7c3aed', bg: '#ede9fe',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.94a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  },
];

const STEPS = [
  { num: 1, title: 'Fill the Form', desc: 'Share your basic details and course preference above.' },
  { num: 2, title: 'Get Counselled', desc: 'Our expert calls you within 24 hours with personalized options.' },
  { num: 3, title: 'Choose & Enroll', desc: 'Pick your university and course. We handle the admission process.' },
  { num: 4, title: 'Start Learning', desc: 'Access your university portal and begin your online degree journey.' },
];

const TESTIMONIALS = [
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/rohit.jpg', import.meta.url).href,   name: 'Rohit Kumar',    course: 'Online MBA, Manipal University',    text: '"I was confused between 5 universities for my MBA. Radiant\'s counsellor helped me compare fees, placements, and curriculum. Enrolled in Manipal Online within a week!"' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/priya.jpg', import.meta.url).href,   name: 'Priya Sharma',   course: 'Online BBA, Amity University',      text: '"The entire admission process was so smooth. They even helped me set up EMI for my fees. Highly recommend Radiant Education to working professionals."' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/amit.jpg', import.meta.url).href,    name: 'Amit Verma',     course: 'Online BCA, LPU',                   text: '"I\'m a working professional and needed a flexible BCA program. Radiant found the perfect fit for me at LPU Online. Their support team is excellent."' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/sneha.jpg', import.meta.url).href,   name: 'Sneha Patel',    course: 'Online MCA, Chandigarh University',  text: '"Radiant helped me switch from a non-IT background to MCA. The counsellor was patient, explained everything clearly, and the admission was done in 3 days!"' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/rahul.jpg', import.meta.url).href,   name: 'Rahul Singh',    course: 'Online MBA - Finance, NMIMS',        text: '"NMIMS online MBA with Finance specialization was my dream. Radiant made it possible within my budget. Their team is knowledgeable and very responsive."' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/anjali.jpg', import.meta.url).href,  name: 'Anjali Mehta',   course: 'Online B.Com, Amrita University',    text: '"Being a homemaker, I needed a flexible program. Radiant Education helped me find the perfect online B.Com course. Now I\'m pursuing my dream degree from home!"' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/arjun.jpg', import.meta.url).href,   name: 'Arjun Nair',     course: 'Online BBA - Marketing, Sharda University', text: '"I was skeptical about online degrees but Radiant cleared all my doubts. Got admitted to Sharda University\'s BBA Marketing in just 2 days. Super smooth process!"' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/divya.jpg', import.meta.url).href,   name: 'Divya Reddy',    course: 'Online MA - English, Amity University', text: '"Radiant Education guided me through the entire MA English admission process. The counsellor understood my needs and recommended the best university within my budget."' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/karan.jpg', import.meta.url).href,   name: 'Karan Malhotra', course: 'Online MBA - HR, Jain University',   text: '"The team at Radiant is amazing! They helped me choose between 4 universities for MBA-HR and got me the best fee structure. Highly recommend to anyone looking for online degrees."' },
  { img: new URL('../landing-assets/RadiantEducation-Assets/testimonials/neha.jpg', import.meta.url).href,    name: 'Neha Gupta',     course: 'Online M.Sc Data Science, LPU',      text: '"I wanted to upskill in Data Science while working full-time. Radiant found LPU\'s online M.Sc program for me — perfect timing, perfect fees. Couldn\'t be happier!"' },
];

const UNIVERSITIES = [
  { name: 'Chandigarh University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/chandigarh.png', import.meta.url).href },
  { name: 'Amity University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/amity.png', import.meta.url).href },
  { name: 'Sharda University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/sharda.png', import.meta.url).href },
  { name: 'Manipal University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/manipal.png', import.meta.url).href },
  { name: 'Kurukshetra University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/kurukshetra.png', import.meta.url).href },
  { name: 'LPU', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/lpu.png', import.meta.url).href },
  { name: 'UPES', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/upes.png', import.meta.url).href },
  { name: 'Vivekanand Global University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/vgu.png', import.meta.url).href },
  { name: 'SRM University Sikkim', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/srm-sikkim.png', import.meta.url).href },
  { name: 'Sikkim Manipal University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/sikkim-manipal.png', import.meta.url).href },
  { name: 'Amrita University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/amrita.png', import.meta.url).href },
  { name: 'Shoolini University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/shoolini.png', import.meta.url).href },
  { name: 'Andhra University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/andhra.png', import.meta.url).href },
  { name: 'NMIMS', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/nmims.png', import.meta.url).href },
  { name: 'DY Patil (Navi Mumbai)', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/dypatil-navimumbai.png', import.meta.url).href },
  { name: 'GLA University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/gla.png', import.meta.url).href },
  { name: 'Parul University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/parul.png', import.meta.url).href },
  { name: 'Alliance University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/alliance.png', import.meta.url).href },
  { name: 'Christ University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/christ.png', import.meta.url).href },
  { name: 'Assam Down Town University', logo: new URL('../landing-assets/RadiantEducation-Assets/universities/assam-downtown.png', import.meta.url).href },
];

export default function RadiantEducationLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', state: '', courseType: '', course: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const enrollRef = useRef(null);
  const navigate = useNavigate();

  const courseOptions = formData.courseType === 'UG' ? UG_COURSES : formData.courseType === 'PG' ? PG_COURSES : [];

  const scrollToEnroll = (e) => {
    e.preventDefault();
    enrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Replace with your actual form handler (webhook, Google Sheets, etc.)
    setTimeout(() => {
      setSubmitting(false);
      navigate('/landing-page/thank-you');
    }, 1000);
  };

  return (
    <div className={styles.wrapper}>

      {/* Topbar */}
      <div className={styles.topbar}>
        <span>Admissions Open 2026–27</span>
        <span className={styles.divider}>|</span>
        <span>UGC-Approved Universities</span>
        <span className={styles.divider}>|</span>
        <span>Call: <a href="tel:+919876543210">+91 98765 43210</a></span>
      </div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.logo}><img src={logoSrc} alt="Radiant Education" className={styles.logoImg} /><div className={styles.logoTextWrap}><span>Radiant <em>Education</em></span><span className={styles.logoSub}>Trust &middot; NGO</span></div></div>
          <div className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ''}`}>
            <a href="#courses" onClick={scrollToSection('courses')}>Courses</a>
            <a href="#universities" onClick={scrollToSection('universities')}>Universities</a>
            <a href="#why" onClick={scrollToSection('why')}>Why Us</a>
            <a href="#testimonials" onClick={scrollToSection('testimonials')}>Reviews</a>
            <a href="#enroll" className={styles.navCta} onClick={scrollToEnroll}>Get Free Counselling</a>
          </div>
          <button className={styles.hamburger} onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero} id="enroll" ref={enrollRef}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>Trusted Channel Partner • 20+ Universities</div>
            <h1>Get Admitted to <span>India's Top Online Universities</span></h1>
            <p>Expert admission counselling for MBA, BBA, BCA, MCA, B.Com, M.Com &amp; more. UGC-approved programs. Study from anywhere, grow everywhere.</p>
            <ul className={styles.heroBullets}>
              <li>UGC-Entitled &amp; NAAC A+ Accredited</li>
              <li>Trusted by 10,000+ Learners</li>
              <li>From India's Best Private Universities</li>
            </ul>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}><strong>10,000+</strong><span>Students Placed</span></div>
              <div className={styles.heroStat}><strong>20+</strong><span>Partner Universities</span></div>
              <div className={styles.heroStat}><strong>50+</strong><span>Courses Available</span></div>
            </div>
          </div>

          {/* Student Image */}
          <div className={styles.heroImageWrap}>
            <img src={studentImg} alt="Student with tablet" className={styles.heroStudentImg} />
          </div>

          {/* Lead Capture Form */}
          <div className={styles.leadForm}>
            {submitted ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>✅</div>
                <h3>Thank You, {formData.name}!</h3>
                <p>Our counsellor will call you within 24 hours.<br />Check your phone for a confirmation SMS.</p>
              </div>
            ) : (
              <>
                <h3>Get Free Career Counselling</h3>
                <p className={styles.formSub}>Fill in your details. Our expert will call you within 24 hours.</p>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <input type="text" name="name" placeholder="Enter your full name" required value={formData.name} onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <input type="tel" name="phone" placeholder="Enter your mobile number" required pattern="[0-9]{10}" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <select name="state" required value={formData.state} onChange={handleChange}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <select name="courseType" required value={formData.courseType} onChange={(e) => { handleChange(e); setFormData(prev => ({ ...prev, courseType: e.target.value, course: '' })); }}>
                      <option value="">Select Course Type</option>
                      <option value="UG">UG Courses (Under Graduation)</option>
                      <option value="PG">PG Courses (Post Graduation)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <select name="course" required value={formData.course} onChange={handleChange} disabled={!formData.courseType}>
                      <option value="">{formData.courseType ? 'Select Course' : 'Select course type first'}</option>
                      {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Apply Now'}
                  </button>
                  <p className={styles.formTrust}>🔒 Your information is 100% secure. No spam calls.</p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Feature Strip */}
        <div className={styles.featureStrip}>
          <div className={styles.featureItem}><span>📖</span> 100% Flexible Learning</div>
          <div className={styles.featureItem}><span>💼</span> Industry Relevant Curriculum</div>
          <div className={styles.featureItem}><span>🎓</span> At Par with On-Campus Degrees</div>
          <div className={styles.featureItem}><span>📋</span> 100% Placement Assistance</div>
        </div>
      </section>

      {/* University Partners */}
      <section className={styles.uniStrip} id="universities">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTitle}><h2>Our Trusted <span>University Partners</span></h2></div>
          <p className={styles.sectionSubtitle}>UGC-approved degrees from NAAC A+ universities. Study online, get a degree recognized everywhere.</p>
          <div className={styles.uniLogos}>
            {UNIVERSITIES.map(u => <div key={u.name} className={styles.uniLogoItem}><img src={u.logo} alt={u.name} title={u.name} /></div>)}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className={styles.courses} id="courses">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTitle}><h2>Popular <span>Online Courses</span></h2></div>
          <p className={styles.sectionSubtitle}>UGC-approved degrees from NAAC A+ universities. Study online, get a degree recognized everywhere.</p>
          <div className={styles.courseGrid}>
            {COURSE_CARDS.map(c => (
              <div key={c.title} className={styles.courseCard}>
                <div className={styles.courseCardTop}>
                  <div className={styles.courseIcon} style={{ background: c.bg, color: c.color }}>{c.icon}</div>
                  <span className={c.type === 'UG' ? styles.courseTypeBadgeUG : styles.courseTypeBadgePG}>{c.type}</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div>
                  {c.tags.map((t, i) => (
                    <span key={t} className={`${styles.courseTag} ${i === 1 ? styles.courseTagGreen : ''}`}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guidance Banner */}
      <section className={styles.guidanceBanner}>
        <div className={styles.guidanceBannerInner}>
          <div className={styles.guidanceText}>
            <h2>Not sure which specialization to choose?<br />We are here to help.</h2>
            <a href="#enroll" className={styles.guidanceBtn} onClick={scrollToEnroll}>Get Personalized Guidance</a>
          </div>
          <div className={styles.guidanceImgWrap}>
            <img src={studentsGroupImg} alt="Students group" className={styles.guidanceImg} />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whySection} id="why">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTitle}><h2>Why Choose <span>Radiant Education?</span></h2></div>
          <p className={styles.sectionSubtitle}>We don't just enroll you — we guide your entire education journey from course selection to career readiness.</p>
          <div className={styles.whyGrid}>
            {WHY_CARDS.map(w => (
              <div key={w.title} className={styles.whyCard}>
                <div className={styles.whyIcon} style={{ background: w.bg, color: w.color }}>
                  {w.svg}
                </div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionTitle}><h2>How It <span>Works</span></h2></div>
          <p className={styles.sectionSubtitle}>Get enrolled in 4 simple steps. No complicated paperwork.</p>
          <div className={styles.stepsRow}>
            {STEPS.map(s => (
              <div key={s.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials} id="testimonials">
        <div className={styles.sectionInner}>
          <div className={styles.sectionTitle}><h2>What Our <span>Students Say</span></h2></div>
          <p className={styles.sectionSubtitle}>Join thousands of students who transformed their careers through Radiant Education.</p>
        </div>
        <div className={styles.testScrollOuter}>
          <div className={styles.testScrollTrack}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className={styles.testCard}>
                <div className={styles.testStars}>★★★★★</div>
                <p>{t.text}</p>
                <div className={styles.testAuthor}>
                  <img src={t.img} alt={t.name} className={styles.testAvatar} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.course}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.sectionInner}>
          <h2>Ready to Start Your Degree Journey?</h2>
          <p>Talk to our expert counsellors today. Free guidance. Zero obligation.</p>
          <a href="#enroll" className={styles.ctaBtn} onClick={scrollToEnroll}>Get Free Counselling Now →</a>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.sectionInner}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}><img src={logoSrc} alt="Radiant Education" className={styles.logoImg} /><div className={styles.logoTextWrap}><span>Radiant <em>Education</em></span><span className={styles.logoSub}>Trust &middot; NGO</span></div></div>
              <p>Your trusted education partner for online &amp; distance learning. Helping students find the right university and course since 2008.</p>
            </div>
            <div>
              <h5>Popular Courses</h5>
              <ul>
                {['Online MBA', 'Online BBA', 'Online BCA', 'Online MCA', 'Online B.Com'].map(c => (
                  <li key={c}><a href="#courses" onClick={scrollToSection('courses')}>{c}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5>Universities</h5>
              <ul>
                {UNIVERSITIES.slice(0, 5).map(u => (
                  <li key={u.name}><a href="#universities" onClick={scrollToSection('universities')}>{u.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5>Contact Us</h5>
              <ul>
                <li>📞 +91 98765 43210</li>
                <li>📧 info@radianteducation.org</li>
                <li>🌐 radianteducation.org</li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 Radiant Education. All rights reserved.</span>
            <div className={styles.footerSocial}>
              <a href="#" title="Facebook">f</a>
              <a href="#" title="Instagram">in</a>
              <a href="#" title="YouTube">▶</a>
              <a href="#" title="LinkedIn">Li</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Mobile CTA */}
      <div className={styles.floatingCta}>
        <a href="#enroll" onClick={scrollToEnroll}>Get Free Counselling →</a>
      </div>

    </div>
  );
}
