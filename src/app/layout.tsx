import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FinCal – Goal-Based Investment Calculator',
  description: 'Plan your financial goals with confidence.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="phone-shell">
          {children}
        </main>
      </body>
    </html>
  )
}