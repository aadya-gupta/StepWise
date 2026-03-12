'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './goal.module.css'

const GOALS = [
  { id: 'retirement', label: 'Retirement Planning', inflation: 6, returns: 12 },
  { id: 'education', label: 'Higher Education', inflation: 8, returns: 10 },
  { id: 'business', label: 'Business Planning', inflation: 6, returns: 12 },
  { id: 'wedding', label: 'Wedding Planning', inflation: 5, returns: 10 },
  { id: 'housing', label: 'Housing', inflation: 7, returns: 11 },
  { id: 'automobile', label: 'Buying an Automobile', inflation: 4, returns: 9 },
  { id: 'travel', label: 'Travel Planning', inflation: 5, returns: 8 },
]

export default function GoalPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selected) {
      const goal = GOALS.find(g => g.id === selected)
      const params = new URLSearchParams({
        goal: selected,
        inflation: String(goal?.inflation ?? 6),
        returns: String(goal?.returns ?? 10),
      })
      router.push(`/calculator?${params}`)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 5L7.5 10L12.5 15" stroke="#224c87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Choose your goal</h1>
          <p className={styles.subtitle}>
            Select a goal to get suggested investment assumptions. You can edit the interest and other values later.
          </p>
        </div>
        <ul className={styles.goalList} role="radiogroup" aria-label="Select your financial goal">
          {GOALS.map((goal) => (
            <li key={goal.id}>
              <button
                role="radio"
                aria-checked={selected === goal.id}
                className={`${styles.goalItem} ${selected === goal.id ? styles.goalSelected : ''}`}
                onClick={() => setSelected(goal.id)}
              >
                <div className={`${styles.radioCircle} ${selected === goal.id ? styles.radioActive : ''}`}>
                  {selected === goal.id && <div className={styles.radioDot}/>}
                </div>
                <span className={styles.goalLabel}>{goal.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.footer}>
        <button
          className={`${styles.continueBtn} ${!selected ? styles.continueBtnDisabled : ''}`}
          onClick={handleContinue}
          disabled={!selected}
        >
          Continue
        </button>
        <button className={styles.skipBtn} onClick={() => router.push('/calculator')}>
          Skip
        </button>
      </div>
    </div>
  )
}