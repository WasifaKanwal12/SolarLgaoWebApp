"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Sidebar({ userType, links }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary-green text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Image src="/logo.svg" alt="Solar Lagao Logo" width={40} height={40} className="invert" />
            <span className="ml-2 text-xl font-bold text-primary-green">Solar Lagao</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">{userType} Dashboard</p>
        </div>

        <nav className="mt-4">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Link>
        </div>
      </div>
    </>
  )
}

