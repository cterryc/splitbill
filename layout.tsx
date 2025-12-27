// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Noto_Sans } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-display'
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-body'
})

export const metadata: Metadata = {
  title: 'SplitBill Casa - Divide tus recibos justamente',
  description: 'La forma justa de compartir los gastos de agua en tu edificio'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es' suppressHydrationWarning>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
          rel='stylesheet'
        />
      </head>
      <body
        className={`${inter.variable} ${notoSans.variable} bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
