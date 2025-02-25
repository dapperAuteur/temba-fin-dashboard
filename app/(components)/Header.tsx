"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { LoadingState } from '@/types/common';
import { ChevronDown } from 'lucide-react'

interface DropdownItem {
  label: string;
  href: string;
}

interface NavSection {
  label: string;
  href?: string;
  items?: DropdownItem[];
}

const Header: React.FC = () => {
  const { data: session, status } = useSession()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const [signOutState, setSignOutState] = useState<LoadingState<void>>({
    isLoading: false,
    error: null,
    data: null
  });

  console.log('signOutState :>> ', signOutState);

  // Define our navigation structure
  const navigation: NavSection[] = [
    {
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      label: 'Accounts',
      items: [
        { label: 'View Accounts', href: '/accounts' },
        { label: 'Create New Account', href: '/accounts/new' }
      ]
    },
    {
      label: 'Tags',
      items: [
        { label: 'View Tags', href: '/tags' },
        { label: 'Create New Tag', href: '/tags/new' }
      ]
    },
    {
      label: 'Transactions',
      items: [
        { label: 'View Transactions', href: '/transactions' },
        { label: 'Create New Transaction', href: '/transactions/new' }
      ]
    },
    {
      label: 'Vendors',
      items: [
        { label: 'View Vendors', href: '/vendors' },
        { label: 'Create New Vendor', href: '/vendors/new' }
      ]
    }
  ]

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
    setActiveDropdown(null)
  }

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
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

  // Helper function to render dropdown menu
  const renderDropdownMenu = (items: DropdownItem[]) => (
    <div className="absolute top-full left-0 w-48 bg-gray-700 rounded-md shadow-lg py-1 mt-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
          onClick={() => setActiveDropdown(null)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg font-bold">
              The Elementary MBA Financial Dashboard
            </Link>
          </div>

          {/* begin pt 1 */}
          <div className="hidden md:flex space-x-4 items-center">
            {session && status === 'authenticated' && navigation.map((item) => (
              <div key={item.label} className="relative">
                {item.href ? (
                  <Link href={item.href} className="hover:text-gray-300">
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className="flex items-center hover:text-gray-300 focus:outline-none"
                    onClick={() => toggleDropdown(item.label)}
                  >
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                )}
                {item.items && activeDropdown === item.label && renderDropdownMenu(item.items)}
              </div>
            ))}
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
            {session && status === 'authenticated' ? (
              <button
                onClick={handleSignOut}
                className="hover:text-gray-300"
              >
                Sign Out
              </button>
            ) : (
              <div className="space-x-4">
                <Link href="/api/auth/signin" className="hover:text-gray-300">
                  Login
                </Link>
                <Link href="/auth/signup" className="hover:text-gray-300">
                  Sign Up
                </Link>
              </div>
            )}
            {/* end pt 1 */}

          {/* Mobile menu button */}
          <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
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
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {status === 'authenticated' && navigation.map((item) => (
              <div key={item.label} className="px-3 py-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block text-gray-200 hover:text-white"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      className="flex items-center w-full text-gray-200 hover:text-white"
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {item.items && activeDropdown === item.label && (
                      <div className="pl-4 mt-2 space-y-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block text-gray-300 hover:text-white"
                            onClick={toggleMenu}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
