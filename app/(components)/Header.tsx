"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/"
              className="text-lg font-bold">
              Financial Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
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
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <nav className="hidden sm:flex space-x-4">
            {session ? (
              <>
                <Link href="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <Link href="/#" className="hover:text-gray-300">
                  Accounts
                </Link>
                <Link href="/#" className="hover:text-gray-300">
                  Transactions
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hover:text-gray-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/#"
                  className="hover:text-gray-300">
                    Login
                </Link>
                <Link href="/#" className="hover:text-gray-300">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="sm:hidden bg-gray-700">
          <ul className="flex flex-col space-y-2 p-4">
            {session ? (
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
                    onClick={() => signOut()}
                    className="hover:text-gray-300"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/api/auth/signin"
                    onClick={() => signIn()} className="hover:text-gray-300">
                    
                      Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup"
                    className="hover:text-gray-300">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
