"use client"

import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { LoadingState } from '@/types/common';
import { useState } from 'react'

const Header: React.FC = () => {
  const { data: session, status } = useSession()
  
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [signOutState, setSignOutState] = useState<LoadingState<void>>({
    isLoading: false,
    error: null,
    data: null
  });

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSignOut = async () => {
    setSignOutState({ isLoading: true, error: null, data: null });
    try {
      await signOut({ callbackUrl: '/' });
      setSignOutState({ isLoading: false, error: null, data: null });
    } catch (error) {
      console.log('error', error)
      setSignOutState({ 
        isLoading: false, 
        error: new Error('Failed to sign out'), 
        data: null 
      });
    }
  }

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg font-bold">
              The Elementary MBA Financial Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <div className="flex sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <nav className="hidden sm:flex space-x-4">
            {session && status === 'authenticated' ? (
              <>
                <span className="text-gray-300">
                  {session.user?.email}
                </span>
                <Link href="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <Link href="/accounts" className="hover:text-gray-300">
                  Accounts
                </Link>
                <Link href="/accounts/create-new-account" className="hover:text-gray-300">
                  Create New Account
                </Link>
                <Link href="/transactions" className="hover:text-gray-300">
                  Transactions
                </Link>
                <button 
                  onClick={handleSignOut}
                  disabled={signOutState.isLoading}
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md"
                >
                  {signOutState.isLoading ? 'Signing out...' : 'Sign Out'}
                </button>
                {signOutState.error && (
                  <div className="text-red-500">{signOutState.error.message}</div>
                )}
              </>
            ) : (
              <>
                <Link href="/api/auth/signin" className="hover:text-gray-300">
                  Login
                </Link>
                <Link href="/auth/signup" className="hover:text-gray-300">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="sm:hidden bg-gray-700">
          <ul className="flex flex-col space-y-2 p-4">
            {session && status === 'authenticated' ? (
              <>
                <span className="text-gray-300">
                  {session.user?.email}
                </span>
                <li>
                  <Link href="/dashboard" className="hover:text-gray-300">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/accounts" className="hover:text-gray-300">
                    Accounts
                  </Link>
                </li>
                <li>
                  <Link href="/transactions" className="hover:text-gray-300">
                    Transactions
                  </Link>
                </li>
                <li>
                <button 
                  onClick={handleSignOut}
                  disabled={signOutState.isLoading}
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md"
                >
                  {signOutState.isLoading ? 'Signing out...' : 'Sign Out'}
                </button>
                {signOutState.error && (
                  <div className="text-red-500">{signOutState.error.message}</div>
                )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/api/auth/signin" className="hover:text-gray-300">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-gray-300">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
