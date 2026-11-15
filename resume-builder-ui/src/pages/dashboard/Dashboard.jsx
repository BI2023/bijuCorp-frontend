"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useWallet } from "../../context/WalletContext"
import { resumeAPI } from "../../api/resume.api"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import { ROUTES } from "../../utils/constants"
import { formatCurrency, formatDate } from "../../utils/helpers"

const Dashboard = () => {
  const { user } = useAuth()
  const { balance } = useWallet()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const data = await resumeAPI.getResumes()
      setResumes(data.slice(0, 3)) // Show only 3 recent resumes
    } catch (error) {
      console.error("Failed to fetch resumes:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
              <h1 className="text-4xl font-bold mb-3">Welcome back, {user?.first_name || "there"}! 👋</h1>
              <p className="text-teal-50 text-lg">Here's what's happening with your resumes today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white border-2 border-teal-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Resumes</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {resumes.length}
                </p>
                <p className="text-gray-500 mt-2 text-sm">Created resumes</p>
              </div>

              <div className="bg-white border-2 border-cyan-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Wallet Balance</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {formatCurrency(balance)}
                </p>
                <p className="text-gray-500 mt-2 text-sm">Available credits</p>
              </div>

              <div className="bg-white border-2 border-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">PDFs Generated</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  0
                </p>
                <p className="text-gray-500 mt-2 text-sm">Downloads this month</p>
              </div>
            </div>

            {/* Quick Tools Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* PDF Editor Tool Card */}
              <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-bold mb-1">
                      New Tool
                    </div>
                    <h3 className="text-xl font-bold">PDF Editor & Digital Sign</h3>
                    <p className="text-white/80 text-xs sm:text-sm mt-1">
                      Upload any PDF to edit text, redact with whiteout, sign documents, and download instantly.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link
                    to={ROUTES.PDF_EDITOR}
                    className="px-5 py-2.5 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-md text-xs sm:text-sm flex items-center gap-2"
                  >
                    <span>Open PDF Editor</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* YouTube Downloader Tool Card */}
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                    <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-bold mb-1">
                      Free Tool
                    </div>
                    <h3 className="text-xl font-bold">YouTube Video Downloader</h3>
                    <p className="text-white/80 text-xs sm:text-sm mt-1">
                      Download videos in 1080p, 720p or convert directly to high-bitrate MP3 audio.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link
                    to={ROUTES.YOUTUBE_DOWNLOADER}
                    className="px-5 py-2.5 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-md text-xs sm:text-sm flex items-center gap-2"
                  >
                    <span>Open Downloader</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Resumes</h2>
                  <p className="text-gray-600">Your latest resume projects</p>
                </div>
                <Link
                  to={ROUTES.MY_RESUMES}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                >
                  View all
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : resumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-foreground mb-2">{resume.title || "Untitled Resume"}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Updated: {formatDate(resume.updated_at || new Date().toISOString())}
                      </p>
                      <Link
                        to={`${ROUTES.RESUME_BUILDER}?id=${resume.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit Resume →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-muted-foreground mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-foreground mb-2">No resumes yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first resume to get started</p>
                  <Link
                    to={ROUTES.RESUME_BUILDER}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Resume
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
