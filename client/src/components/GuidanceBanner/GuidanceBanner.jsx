import studentsGroupImg from '../../pages/landing-assets/RadiantEducation-Assets/students-group.jpg'
import styles from './GuidanceBanner.module.css'

export default function GuidanceBanner() {
  const scrollToEnroll = (e) => {
    e.preventDefault()
    document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className={styles.floatWrap}>
      <div className={`container ${styles.card}`}>
        <div className={styles.text}>
          <h2>Not sure which specialization to choose?<br />We are here to help.</h2>
          <a href="#enroll" className={styles.cta} onClick={scrollToEnroll}>Get Personalized Guidance</a>
        </div>
        <div className={styles.imgWrap}>
          <img src={studentsGroupImg} alt="Students group" className={styles.img} />
        </div>
      </div>
    </section>
  )
}
