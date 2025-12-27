// context/ThemeContext.tsx - VERSIÓN CON INITIAL STATE
'use client'

import { createContext, useContext, useState, useLayoutEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicializar con un valor por defecto que se actualizará inmediatamente
  const [theme, setTheme] = useState<Theme>('light')
  const [isInitialized, setIsInitialized] = useState(false)

  // useLayoutEffect para aplicar el tema ANTES de que se renderice el contenido
  useLayoutEffect(() => {
    // Solo en cliente
    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem('theme') as Theme
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')

    // Actualizar estado y DOM sincrónicamente
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    setIsInitialized(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  // Opcional: mostrar un loader mientras se inicializa
  if (!isInitialized) {
    return null // o un loading skeleton
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
