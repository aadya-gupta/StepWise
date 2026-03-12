'use client'
import Link from 'next/link'
import styles from './welcome.module.css'

export default function WelcomePage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        <img
          src="/Calculator-rafiki.svg"
          alt="Financial planning illustration"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.headline}>Plan Your<br/>Financial Goals<br/>with Confidence</h1>
        <p className={styles.subtext}>Estimate the investment needed to achieve your financial goals by adjusting time, inflation, and expected returns.</p>
        <Link href="/goal" className={styles.cta}>Start Calculating</Link>
      </div>
    </div>
  )
}