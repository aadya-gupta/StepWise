'use client'
import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import styles from './growth.module.css'

interface Result {
  futureGoalValue: number
  requiredMonthlySIP: number
  totalInvestment: number
  wealthGained: number
}

interface Props {
  result: Result | null
  onReselect: () => void
  formatINR: (v: number) => string
}

const DONUT_COLORS = ['#224c87', '#da3832']

export default function GrowthTab({ result, onReselect, formatINR }: Props) {
  const yearsCount = result
    ? Math.max(1, Math.round((result.totalInvestment / result.requiredMonthlySIP) / 12))
    : 0

  const chartData = useMemo(() => {
    if (!result) return []
    const { futureGoalValue, requiredMonthlySIP, totalInvestment } = result
    const annualSIP = requiredMonthlySIP * 12
    const r = (futureGoalValue / Math.max(totalInvestment, 1) - 1) / Math.max(yearsCount, 1) / 12
    return Array.from({ length: yearsCount + 1 }, (_, i) => {
      const invested = annualSIP * i
      const n = i * 12
      const value = r > 0
        ? requiredMonthlySIP * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
        : invested
      return {
        year: `Yr ${i}`,
        'Amount Invested': Math.round(invested),
        'Estimated Returns': Math.round(Math.max(value - invested, 0)),
      }
    })
  }, [result, yearsCount])

  if (!result) {
    return (
      <div className={styles.empty}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="22" stroke="#d0d0d0" strokeWidth="2"/>
          <path d="M16 32 Q20 20 24 24 Q28 28 32 16" stroke="#d0d0d0" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className={styles.emptyText}>Enter values on the Input tab to see your goal projections</p>
      </div>
    )
  }

  const { futureGoalValue, requiredMonthlySIP, totalInvestment, wealthGained } = result

  const returnPercent = totalInvestment > 0
    ? ((wealthGained / totalInvestment) * 100).toFixed(1)
    : '0'

  const donutData = [
    { name: 'Amount Invested', value: Math.round(totalInvestment) },
    { name: 'Est. Returns', value: Math.round(wealthGained) },
  ]

  return (
    <div className={styles.wrapper}>

      {/* ── Area Chart ── */}
      <div className={styles.chartBox} role="img" aria-label="Investment growth chart">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#224c87" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#224c87" stopOpacity={0.02}/>
              </linearGradient>
              <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#da3832" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#da3832" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8"/>
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: '#919090', fontFamily: 'Montserrat' }}
              interval="preserveStartEnd"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#919090', fontFamily: 'Montserrat' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v =>
                v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr` :
                v >= 100000 ? `${(v / 100000).toFixed(0)}L` :
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
              }
            />
            <Tooltip
              formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`]}
              contentStyle={{
                fontFamily: 'Montserrat, Arial',
                fontSize: 12,
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Montserrat, Arial', paddingTop: 12 }}/>
            <Area type="monotone" dataKey="Amount Invested" stroke="#224c87" strokeWidth={2.5} fill="url(#colorInvested)" dot={false}/>
            <Area type="monotone" dataKey="Estimated Returns" stroke="#da3832" strokeWidth={2.5} fill="url(#colorReturns)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.cardAccent}`}>
          <span className={styles.cardLabel}>Monthly SIP Required</span>
          <span className={styles.cardValue}>{formatINR(requiredMonthlySIP)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Future Goal Value</span>
          <span className={styles.cardValue}>{formatINR(futureGoalValue)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total Investment</span>
          <span className={styles.cardValue}>{formatINR(totalInvestment)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Estimated Returns</span>
          <span className={styles.cardValue}>{formatINR(wealthGained)}</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className={styles.actions}>
        <button className={styles.investBtn}>Start Investing</button>
        <button className={styles.reselectBtn} onClick={onReselect}>Re-select Goal</button>
      </div>

      {/* ── Desktop Right Panel — Donut + Summary ── */}
      <div className={styles.summaryPanel}>

        {/* Donut Chart */}
        <div className={styles.donutBox}>
          <p className={styles.donutTitle}>Corpus Breakdown</p>
          <div className={styles.donutChartWrap}>
            <PieChart width={180} height={180}>
              <Pie
                data={donutData}
                cx={90}
                cy={90}
                innerRadius={55}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {donutData.map((_, index) => (
                  <Cell key={index} fill={DONUT_COLORS[index]} strokeWidth={0}/>
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`]}
                contentStyle={{
                  fontFamily: 'Montserrat, Arial',
                  fontSize: 12,
                  border: '1px solid #e0e0e0',
                  borderRadius: 10,
                }}
              />
            </PieChart>
            {/* Center label */}
            <div className={styles.donutCenter}>
              <span className={styles.donutCenterLabel}>TOTAL</span>
              <span className={styles.donutCenterValue}>{formatINR(futureGoalValue)}</span>
            </div>
          </div>
          <div className={styles.donutLegend}>
            <div className={styles.donutLegendItem}>
              <span className={styles.donutDot} style={{ background: '#224c87' }}/>
              <div className={styles.donutLegendText}>
                <span className={styles.donutLegendLabel}>Invested</span>
                <span className={styles.donutLegendValue}>{formatINR(totalInvestment)}</span>
              </div>
            </div>
            <div className={styles.donutLegendItem}>
              <span className={styles.donutDot} style={{ background: '#da3832' }}/>
              <div className={styles.donutLegendText}>
                <span className={styles.donutLegendLabel}>Returns</span>
                <span className={styles.donutLegendValue}>{formatINR(wealthGained)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary below donut */}
        <div className={styles.summaryDivider}/>

        <h3 className={styles.summaryPanelTitle}>Investment Breakdown</h3>

        <div className={styles.summaryItem}>
          <span className={styles.summaryItemLabel}>Monthly SIP</span>
          <span className={styles.summaryItemValue}>{formatINR(requiredMonthlySIP)}</span>
          <span className={styles.summaryItemSub}>per month for {yearsCount} years</span>
        </div>

        <div className={styles.summaryItem}>
          <span className={styles.summaryItemLabel}>Future Goal Value</span>
          <span className={styles.summaryItemValue}>{formatINR(futureGoalValue)}</span>
          <span className={styles.summaryItemSub}>inflation-adjusted target</span>
        </div>

        <div className={styles.summaryBreakdown}>
          <div className={styles.summaryBreakdownRow}>
            <span className={styles.summaryBreakdownLabel}>Amount Invested</span>
            <span className={styles.summaryBreakdownValue}>{formatINR(totalInvestment)}</span>
          </div>
          <div className={styles.summaryBreakdownRow}>
            <span className={styles.summaryBreakdownLabel}>Est. Returns</span>
            <span className={styles.summaryBreakdownValue}>{formatINR(wealthGained)}</span>
          </div>
          <div className={styles.summaryBreakdownRow}>
            <span className={styles.summaryBreakdownLabel}>Return Rate</span>
            <span className={styles.summaryBreakdownValue}>{returnPercent}%</span>
          </div>
        </div>

        <p className={styles.growthNote}>
          Projections are illustrative only. Actual returns may vary depending on market conditions.
        </p>

      </div>

    </div>
  )
}