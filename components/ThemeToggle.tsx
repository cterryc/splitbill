'use client'

import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
      aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <>
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z' />
          </svg>
          <span className='text-sm font-medium'>Oscuro</span>
        </>
      ) : (
        <>
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9z M12,2L9.91,4.09L12,6.18l2.09-2.09L12,2z M12,22l-2.09-2.09L12,17.82l2.09,2.09L12,22z M22,12l-2.09,2.09L17.82,12l2.09-2.09L22,12z M2,12l2.09,2.09L6.18,12l-2.09-2.09L2,12z M19.07,4.93l-2.09,2.09L19.07,9.1l2.09-2.09L19.07,4.93z M4.93,19.07l2.09-2.09L9.1,19.07L6.91,21.16L4.93,19.07z M19.07,19.07l-2.09-2.09l2.09-2.09l2.09,2.09L19.07,19.07z' />
          </svg>
          <span className='text-sm font-medium'>Claro</span>
        </>
      )}
    </button>
  )
}
