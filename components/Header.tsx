'use client'

import { FaDroplet } from 'react-icons/fa6'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3'>
          <div className='flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
            <FaDroplet />
          </div>
          <h2 className='text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
            SplitBill Casa
          </h2>
        </div>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
          <SignedOut>
            <SignInButton>
              <button className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>
                Ingresar
              </button>
            </SignInButton>
            <SignUpButton>
              <button className='px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors'>
                Empezar
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
