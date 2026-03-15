# StepWise
FinCal Innovation Hackathon
# FinCal — Goal-Based Investment Calculator

A modern, accessible, and interactive financial calculator built for the **FinCal Innovation Hackathon** at Technex '26, co-sponsored by **HDFC Mutual Fund**.

---

## About

FinCal helps users estimate how much they need to invest every month to achieve a specific financial goal — whether that's buying a house, funding higher education, planning a wedding, or retiring comfortably.

The calculator accounts for:
- **Inflation** — rising costs over time
- **Expected returns** — growth from mutual fund investments
- **Time horizon** — how many years until the goal

---

## Calculator Type

**Goal-Based Investment Calculator**

One of five permitted categories under the FinCal Innovation Hackathon guidelines.

---

## Financial Logic

### Step 1 — Inflate the Goal
```
Future Goal Value = Current Cost × (1 + Inflation Rate) ^ Years
```

### Step 2 — Calculate Required Monthly SIP
```
r = Annual Return ÷ 12
n = Years × 12
Monthly SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]
```

All calculations follow industry-standard financial formulas as specified in the hackathon guidelines.

---

## Features

- 7 preset financial goals with suggested inflation and return assumptions
- All assumptions are fully user-editable
- Live number-to-words display as you type (e.g. 500000 → 5.00 Lakh)
- Interactive sliders for inflation and return rates
- Area chart showing investment growth year by year
- Donut chart showing corpus breakdown (invested vs returns)
- Real-time Goal Summary panel on desktop
- FAQ and formula explanation section
- Mandatory compliance disclaimer (HDFC Mutual Fund)
- WCAG 2.1 AA accessibility compliant
- Fully responsive across mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React, TypeScript |
| Styling | CSS Modules, Montserrat font |
| Charts | Recharts (AreaChart + PieChart) |
| Runtime | Node.js 22.11.0 |
| Package Manager | NPM 10.9.0 |

---

## Brand Guidelines

Colors used as per HDFC Mutual Fund brand guidelines:

| Color | Hex |
|---|---|
| Blue | `#224c87` |
| Red | `#da3832` |
| Grey | `#919090` |

Fonts: Montserrat, Arial, Verdana

---

##  Getting Started

### Prerequisites
- Node.js 22.11.0 or higher
- NPM 10.9.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/YOURUSERNAME/fincal.git

# Navigate into the project
cd fincal

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Project Structure
```
src/app/
├── page.tsx                  # Welcome page
├── welcome.module.css
├── globals.css
├── layout.tsx
├── goal/
│   ├── page.tsx              # Goal selection page
│   └── goal.module.css
└── calculator/
    ├── page.tsx              # Calculator input page
    ├── GrowthTab.tsx         # Growth results + charts
    ├── calculator.module.css
    └── growth.module.css
public/
└── Calculator-rafiki.svg     # Hero illustration
```

---

## Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.

---

##  Hackathon

**Event:** Technex '26 — FinCal Innovation Hackathon
**Sponsor:** HDFC Mutual Fund
**Dates:** 13 Mar – 15 Mar 2026
**Category:** Goal-Based Investment Calculator



##  License

All calculators and code are the intellectual property of HDFC AMC as per hackathon terms and conditions.



*Illustration by [Storyset](https://storyset.com/work)*
