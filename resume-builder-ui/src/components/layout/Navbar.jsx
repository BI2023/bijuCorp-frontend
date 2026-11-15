"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useWallet } from "../../context/WalletContext"
import { formatCurrency } from "../../utils/helpers"
import { ROUTES } from "../../utils/constants"

const Navbar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { balance } = useWallet()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              bijuCorp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.MY_RESUMES}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  My Resumes
                </Link>
                <Link
                  to={ROUTES.RESUME_BUILDER}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Create Resume
                </Link>
                <a href="/docs" className="text-foreground hover:text-primary transition-colors font-medium">
                  Study Docs
                </a>
                <Link
                  to={ROUTES.YOUTUBE_DOWNLOADER}
                  className="flex items-center gap-1.5 text-foreground hover:text-red-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 text-red-600 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YT Downloader</span>
                </Link>
                <Link
                  to={ROUTES.PDF_EDITOR}
                  className="flex items-center gap-1.5 text-foreground hover:text-teal-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF Editor</span>
                </Link>

                {/* Wallet Balance */}
                <Link
                  to={ROUTES.WALLET}
                  className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors border border-teal-200"
                >
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold text-foreground">{formatCurrency(balance)}</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        {user?.first_name?.[0] || user?.email?.[0] || "U"}
                      </span>
                    </div>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-[998]" onClick={() => setIsProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-2xl py-2 z-[999]">
                        <div className="px-4 py-3 border-b border-gray-200 bg-white">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to={ROUTES.WALLET}
                          className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Wallet
                        </Link>
                        <Link
                          to={ROUTES.TRANSACTIONS}
                          className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Transactions
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <a href="/docs" className="text-foreground hover:text-primary transition-colors font-medium">
                  Study Docs
                </a>
                <Link
                  to={ROUTES.YOUTUBE_DOWNLOADER}
                  className="flex items-center gap-1.5 text-foreground hover:text-red-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 text-red-600 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YT Downloader</span>
                </Link>
                <Link
                  to={ROUTES.PDF_EDITOR}
                  className="flex items-center gap-1.5 text-foreground hover:text-teal-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF Editor</span>
                </Link>
                <Link to={ROUTES.LOGIN} className="text-foreground hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-foreground hover:text-primary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.MY_RESUMES}
                  className="text-foreground hover:text-primary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Resumes
                </Link>
                <Link
                  to={ROUTES.RESUME_BUILDER}
                  className="text-foreground hover:text-primary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Resume
                </Link>
                <Link
                  to={ROUTES.WALLET}
                  className="text-foreground hover:text-primary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Wallet ({formatCurrency(balance)})
                </Link>
                <a
                  href="/docs"
                  className="text-foreground hover:text-primary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Study Docs
                </a>
                <Link
                  to={ROUTES.YOUTUBE_DOWNLOADER}
                  className="text-red-600 font-medium py-2 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube Downloader</span>
                </Link>
                <Link
                  to={ROUTES.PDF_EDITOR}
                  className="text-teal-600 font-medium py-2 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF Editor</span>
                </Link>
                <button onClick={handleLogout} className="text-left text-destructive hover:text-destructive/80 py-2">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a
                  href="/docs"
                  className="text-foreground hover:text-primary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Study Docs
                </a>
                <Link
                  to={ROUTES.YOUTUBE_DOWNLOADER}
                  className="text-red-600 font-medium py-2 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube Downloader</span>
                </Link>
                <Link
                  to={ROUTES.PDF_EDITOR}
                  className="text-teal-600 font-medium py-2 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF Editor</span>
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-foreground hover:text-primary py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
