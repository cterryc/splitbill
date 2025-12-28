import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/context/ThemeContext'
import { esMX } from '@clerk/localizations'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'SplitBill Casa',
  description: 'Divide tus recibos justamente'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const customEs = {
    ...esMX,
    signIn: {
      ...esMX.signIn,
      start: {
        ...esMX.signIn?.start,
        subtitle: 'para continuar con SplitBill'
      }
    },
    signUp: {
      ...esMX.signUp,
      start: { ...esMX.signUp?.start, subtitle: 'para continuar con SplitBill' }
    },
    formFieldHintText__optional: ''
  }
  return (
    <ClerkProvider localization={customEs}>
      {/* IMPORTANTE: suppressHydrationWarning es necesario */}
      <html lang='es' suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-background-light dark:bg-background-dark text-text-main dark:text-white antialiased`}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
