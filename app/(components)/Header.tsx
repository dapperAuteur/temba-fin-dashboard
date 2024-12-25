"use client"

import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const Header: React.FC = () => {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }
  console.log('status :>> ', status);
  console.log('session :>> ', session);

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg font-bold">
              The Elementary MBA Financial Dashboard
            </Link>
          </div>

          <div className="flex sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
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

          <nav className="hidden sm:flex space-x-4">
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <Link href="/accounts" className="hover:text-gray-300">
                  Accounts
                </Link>
                <Link href="/transactions" className="hover:text-gray-300">
                  Transactions
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hover:text-gray-300"
                >
                  Sign Out
                </button>
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
            {status === 'authenticated' ? (
              <>
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
                    className="hover:text-gray-300"
                  >
                    Sign Out
                  </button>
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
