'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './calculator.module.css'
import GrowthTab from './GrowthTab'

const GOAL_LABELS: Record<string, string> = {
  retirement: 'Retirement Planning',
  education: 'Higher Education',
  business: 'Business Planning',
  wedding: 'Wedding Planning',
  housing: 'Housing',
  automobile: 'Buying an Automobile',
  travel: 'Travel Planning',
}

function CalculatorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const goalId = searchParams.get('goal') || ''

  const [activeTab, setActiveTab] = useState<'input' | 'growth'>('input')
  const [currentCost, setCurrentCost] = useState('')
  const [years, setYears] = useState('')
  const [inflation, setInflation] = useState(searchParams.get('inflation') || '')
  const [inflationSlider, setInflationSlider] = useState(Number(searchParams.get('inflation') || 0))
  const [returns, setReturns] = useState(searchParams.get('returns') || '')
  const [returnSlider, setReturnSlider] = useState(Number(searchParams.get('returns') || 0))
  const [result, setResult] = useState<null | {
    futureGoalValue: number
    requiredMonthlySIP: number
    totalInvestment: number
    wealthGained: number
  }>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInflationInput = (val: string) => {
    setInflation(val)
    const n = parseFloat(val)
    if (!isNaN(n) && n >= 0 && n <= 30) setInflationSlider(n)
  }

  const handleReturnsInput = (val: string) => {
    setReturns(val)
    const n = parseFloat(val)
    if (!isNaN(n) && n >= 0 && n <= 100) setReturnSlider(n)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!currentCost || isNaN(Number(currentCost)) || Number(currentCost) <= 0)
      e.currentCost = 'Enter a valid goal amount'
    if (!years || isNaN(Number(years)) || Number(years) <= 0 || Number(years) > 50)
      e.years = 'Enter years between 1 and 50'
    if (!inflation || isNaN(Number(inflation)) || Number(inflation) < 0 || Number(inflation) > 30)
      e.inflation = 'Enter inflation between 0% and 30%'
    if (!returns || isNaN(Number(returns)) || Number(returns) <= 0 || Number(returns) > 100)
      e.returns = 'Enter expected annual return (1%-100%)'
    return e
  }

  const calculate = () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const C = Number(currentCost)
    const Y = Number(years)
    const inf = Number(inflation) / 100
    const ret = Number(returns) / 100
    const FV = C * Math.pow(1 + inf, Y)
    const r = ret / 12
    const n = Y * 12
    const requiredSIP = (FV * r) / ((Math.pow(1 + r, n) - 1) * (1 + r))
    const totalInvested = requiredSIP * n
    const wealthGained = FV - totalInvested

    setResult({
      futureGoalValue: FV,
      requiredMonthlySIP: requiredSIP,
      totalInvestment: totalInvested,
      wealthGained: wealthGained > 0 ? wealthGained : 0,
    })
    setActiveTab('growth')
  }

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`
    return `₹${Math.round(val).toLocaleString('en-IN')}`
  }

  const numberToWords = (num: number): string => {
    if (!num || isNaN(num)) return ''
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Crore`
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lakh`
    if (num >= 1000) return `${(num / 1000).toFixed(2)} Thousand`
    return num.toString()
  }

  const goalLabel = goalId ? GOAL_LABELS[goalId] : null

  const HOW_STEPS = [
    { num: '1', label: 'Set Goal' },
    { num: '2', label: 'Define Timeline' },
    { num: '3', label: 'Start Investing' },
    { num: '4', label: 'Track Growth' },
  ]

  const FAQS = [
    {
      q: 'Why does inflation matter?',
      a: "The cost of everything rises over time. A wedding that costs ₹10 Lakh today may cost ₹16 Lakh in 10 years at 5% inflation. This calculator adjusts your goal amount for inflation so you don't fall short."
    },
    {
      q: 'What return rate should I use?',
      a: 'Equity mutual funds have historically delivered 10–14% annually over long periods. Debt funds typically return 6–8%. Choose a rate based on your risk appetite and investment horizon. All figures are illustrative.'
    },
    {
      q: 'What is SIP?',
      a: 'SIP stands for Systematic Investment Plan. It means investing a fixed amount every month into a mutual fund, allowing your money to grow through the power of compounding over time.'
    },
    {
      q: 'Can I change the assumptions?',
      a: 'Yes — all inputs including inflation rate and expected return are fully editable. These are illustrative assumptions, not guarantees. Adjust them to match your own expectations.'
    },
    {
      q: 'Is this a guarantee of returns?',
      a: 'No. This calculator is for educational and illustrative purposes only. Mutual fund investments are subject to market risks. Past performance does not guarantee future results.'
    },
  ]

  return (
    <div className={styles.wrapper}>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/goal')} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 5L7.5 10L12.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <h1 className={styles.headerTitle}>Customize Your Investment Plan</h1>
          <p className={styles.headerSub}>Enter Values to see personalised goal projections</p>
        </div>
      </div>

      <div className={styles.tabBar}>
        <div className={styles.tabTrack}>
          <button
            className={`${styles.tab} ${activeTab === 'input' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('input')}
            role="tab"
            aria-selected={activeTab === 'input'}
          >
            Input
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'growth' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('growth')}
            role="tab"
            aria-selected={activeTab === 'growth'}
          >
            Growth
          </button>
        </div>
      </div>

      {activeTab === 'input' && (
        <div className={styles.inputPanel}>

          {goalLabel && (
            <div className={styles.goalBadge}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#224c87" strokeWidth="1.5"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="#224c87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{goalLabel}</span>
            </div>
          )}

          <div className={styles.fields}>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="currentCost">Current Cost of your goal</label>
              <input
                id="currentCost"
                type="number"
                className={`${styles.input} ${errors.currentCost ? styles.inputError : ''}`}
                placeholder="Enter Value"
                value={currentCost}
                onChange={e => { setCurrentCost(e.target.value); setErrors(p => ({...p, currentCost: ''})) }}
              />
              {errors.currentCost && <span className={styles.errMsg} role="alert">{errors.currentCost}</span>}
              {currentCost && !errors.currentCost && Number(currentCost) > 0 && (
                <span className={styles.numberWords}>{numberToWords(Number(currentCost))}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="years">Years to Goal</label>
              <input
                id="years"
                type="number"
                className={`${styles.input} ${errors.years ? styles.inputError : ''}`}
                placeholder="Enter Value"
                value={years}
                onChange={e => { setYears(e.target.value); setErrors(p => ({...p, years: ''})) }}
                min="1" max="50"
              />
              {errors.years && <span className={styles.errMsg} role="alert">{errors.years}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="inflation">Expected Inflation Rate (%)</label>
              <input
                id="inflation"
                type="number"
                className={`${styles.input} ${errors.inflation ? styles.inputError : ''}`}
                placeholder="Enter Value"
                value={inflation}
                onChange={e => { handleInflationInput(e.target.value); setErrors(p => ({...p, inflation: ''})) }}
                min="0" max="30" step="0.5"
              />
              {errors.inflation && <span className={styles.errMsg} role="alert">{errors.inflation}</span>}
              <div className={styles.sliderWrapper}>
                <input
                  type="range"
                  className={styles.slider}
                  min={0} max={30} step={0.5}
                  value={inflationSlider}
                  onChange={e => { setInflationSlider(Number(e.target.value)); handleInflationInput(e.target.value) }}
                  aria-label="Expected inflation rate slider"
                />
                <div className={styles.sliderLabels}>
                  <span>0</span>
                  <span>30</span>
                </div>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="returns">Expected Annual Return (%)</label>
              <input
                id="returns"
                type="number"
                className={`${styles.input} ${errors.returns ? styles.inputError : ''}`}
                placeholder="Enter Value"
                value={returns}
                onChange={e => { handleReturnsInput(e.target.value); setErrors(p => ({...p, returns: ''})) }}
                min="0" max="100" step="0.5"
              />
              {errors.returns && <span className={styles.errMsg} role="alert">{errors.returns}</span>}
              <div className={styles.sliderWrapper}>
                <input
                  type="range"
                  className={styles.slider}
                  min={0} max={100} step={0.5}
                  value={returnSlider}
                  onChange={e => { setReturnSlider(Number(e.target.value)); handleReturnsInput(e.target.value) }}
                  aria-label="Expected annual return slider"
                />
                <div className={styles.sliderLabels}>
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div className={styles.assumptionNote}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" stroke="#919090" strokeWidth="1.2"/>
                <path d="M7 6v4M7 4.5v.5" stroke="#919090" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span>All inputs are editable assumptions for illustrative purposes only.</span>
            </div>

            <button className={styles.calculateBtn} onClick={calculate}>
              Calculate
            </button>

          </div>

          <div className={styles.rightPanel}>
            <div className={styles.rightPanelInner}>

              <div className={styles.howItWorks}>
                <p className={styles.howLabel}>How goal based investment works?</p>
                <div className={styles.steps}>
                  {HOW_STEPS.map((s, i) => (
                    <div key={i} className={styles.step}>
                      <div className={styles.stepCard}>
                        <span className={styles.stepNum}>{s.num}</span>
                        <span className={styles.stepLabel}>{s.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className={styles.rightPanelTitle}>Your Goal Summary</h3>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Goal</span>
                <span className={styles.summaryValue}>{goalLabel || '—'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Current Cost</span>
                <span className={styles.summaryValue}>
                  {currentCost ? `₹${Number(currentCost).toLocaleString('en-IN')}` : '—'}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Years to Goal</span>
                <span className={styles.summaryValue}>{years ? `${years} yrs` : '—'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Inflation Rate</span>
                <span className={styles.summaryValue}>{inflation ? `${inflation}%` : '—'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Expected Return</span>
                <span className={styles.summaryValue}>{returns ? `${returns}%` : '—'}</span>
              </div>

              <div className={styles.summaryDivider}/>

              <div className={styles.summaryHighlight}>
                <span className={styles.summaryHighlightLabel}>Inflated Goal Value</span>
                <span className={styles.summaryHighlightValue}>
                  {currentCost && years && inflation
                    ? formatINR(Number(currentCost) * Math.pow(1 + Number(inflation) / 100, Number(years)))
                    : '—'
                  }
                </span>
              </div>

              <div className={styles.rightPanelNote}>
                <p>All projections are illustrative only. Actual returns may vary depending on market conditions.</p>
              </div>

            </div>
          </div>

          <div className={styles.infoSection}>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>What is a Goal-Based Investment Calculator?</h3>
              <p className={styles.infoCardText}>
                A goal-based investment calculator helps you figure out exactly how much you need to invest every month to reach a specific financial target — whether that is buying a house, funding education, or planning a wedding. It accounts for inflation (rising costs over time) and expected returns on your investment.
              </p>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>How is it calculated?</h3>
              <div className={styles.formulaBlock}>
                <p className={styles.formulaLabel}>Step 1 — Inflate your goal</p>
                <div className={styles.formulaBox}>
                  Future Goal Value = Current Cost × (1 + Inflation Rate)^Years
                </div>
                <p className={styles.formulaLabel}>Step 2 — Calculate monthly SIP required</p>
                <div className={styles.formulaBox}>
                  Monthly SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]
                </div>
                <p className={styles.formulaNote}>where r = Annual Return ÷ 12 &nbsp;|&nbsp; n = Years × 12</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Frequently Asked Questions</h3>
              <div className={styles.faqList}>
                {FAQS.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <p className={styles.faqQ}>{faq.q}</p>
                    <p className={styles.faqA}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'growth' && (
        <GrowthTab result={result} onReselect={() => router.push('/goal')} formatINR={formatINR} />
      )}

      <p className={styles.disclaimer}>
        This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
      </p>

    </div>
  )
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div style={{padding: 40, textAlign: 'center', color: '#224c87'}}>Loading...</div>}>
      <CalculatorContent />
    </Suspense>
  )
}