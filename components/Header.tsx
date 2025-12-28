'use client'

import { FaDroplet } from 'react-icons/fa6'
import { useState } from 'react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import ThemeToggle from './ThemeToggle'
import { FiMenu, FiX } from 'react-icons/fi'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
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

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-4'>
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

          {/* Mobile Menu Button */}
          <div className='flex md:hidden items-center gap-4'>
            <ThemeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none'
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isMenuOpen ? (
                  <FiX className='h-6 w-6' />
                ) : (
                  <FiMenu className='h-6 w-6' />
                )}
              </button>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden fixed inset-x-0 top-16 z-40 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 backdrop-blur-md'>
          <div className='px-4 py-6 space-y-4'>
            <SignedOut>
              <div className='flex flex-col space-y-4'>
                <SignInButton>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className='w-full px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors'
                  >
                    Ingresar
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className='w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
                  >
                    Empezar
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className='md:hidden fixed inset-0 z-30 bg-black/20 dark:bg-black/40 backdrop-blur-sm'
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}
