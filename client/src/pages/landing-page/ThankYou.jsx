import { useEffect, useState } from 'react';
import styles from './ThankYou.module.css';
import logoSrc from './assets/logo.svg';

const STEPS = [
  { icon: '📞', title: 'Counsellor Call', desc: 'Our expert will call you within 24 hours' },
  { icon: '🎓', title: 'Course Guidance', desc: 'Get personalized university & course recommendation' },
  { icon: '📝', title: 'Admission Support', desc: 'We handle your entire admission process' },
  { icon: '🚀', title: 'Start Learning', desc: 'Begin your online degree journey' },
];

const COURSES = [
  'Online MBA', 'Online BBA', 'Online BCA', 'Online MCA', 'Online B.Com', 'Online M.Com',
];

export default function ThankYou() {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) { clearInterval(timer); window.location.href = '/'; return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.wrapper}>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <img src={logoSrc} alt="Radiant Education" className={styles.logoImg} />
            <div className={styles.logoTextWrap}>
              <span>Radiant <em>Education</em></span>
              <span className={styles.logoSub}>Trust &middot; NGO</span>
            </div>
          </div>
          <a href="/" className={styles.homeBtn}>← Back to Home</a>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.checkCircle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1>Thank You! 🎉</h1>
          <p className={styles.subtitle}>Your application has been successfully submitted.</p>
          <p className={styles.desc}>
            Our expert counsellor will contact you within <strong>24 hours</strong> with personalized university & course recommendations.
          </p>
          <div className={styles.redirectNote}>
            Redirecting to home in <span className={styles.countDown}>{count}s</span>
          </div>
          <a href="/" className={styles.homeLink}>Go to Home Now →</a>
        </div>
      </section>

      {/* What Happens Next */}
      <section className={styles.stepsSection}>
        <div className={styles.inner}>
          <h2>What Happens <span>Next?</span></h2>
          <p className={styles.sectionSub}>Here's your journey from here to your dream degree</p>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={s.title} className={styles.stepCard}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* While You Wait */}
      <section className={styles.whileSection}>
        <div className={styles.inner}>
          <h2>While You Wait, <span>Explore</span></h2>
          <p className={styles.sectionSub}>Browse our most popular online courses</p>
          <div className={styles.courseChips}>
            {COURSES.map(c => (
              <a key={c} href="/" className={styles.chip}>{c}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Bar */}
      <section className={styles.contactBar}>
        <div className={styles.inner}>
          <p>Have questions? Reach us directly</p>
          <div className={styles.contactLinks}>
            <a href="tel:+919876543210" className={styles.contactBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.94a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +91 98765 43210
            </a>
            <a href="https://wa.me/919876543210" className={styles.contactBtnWa} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Radiant Education Trust & NGO. All rights reserved.</p>
      </footer>

    </div>
  );
}
