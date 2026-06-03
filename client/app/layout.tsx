import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Purplle Intelligence',
  description: 'Retail Analytics Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className="
          min-h-screen
          bg-[#0d0d0f]
          text-zinc-100
          antialiased
          overflow-x-hidden
        "
      >
        {children}
      </body>
    </html>
  )
}