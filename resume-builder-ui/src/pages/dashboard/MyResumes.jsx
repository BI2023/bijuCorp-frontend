"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { resumeAPI } from "../../api/resume.api"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import Button from "../../components/common/Button"
import { ROUTES } from "../../utils/constants"
import { formatDate } from "../../utils/helpers"

const MyResumes = () => {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const data = await resumeAPI.getResumes()
      setResumes(data)
    } catch (error) {
      console.error("Failed to fetch resumes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resumeId) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    setDeletingId(resumeId)
    try {
      await resumeAPI.deleteResume(resumeId)
      setResumes(resumes.filter((r) => r.id !== resumeId))
    } catch (error) {
      console.error("Failed to delete resume:", error)
      alert("Failed to delete resume. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">My Resumes</h1>
                <p className="text-muted-foreground">Manage and edit your resumes</p>
              </div>
              <Button onClick={() => navigate(ROUTES.RESUME_BUILDER)}>Create New Resume</Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : resumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-muted-foreground"
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
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        {resume.title || "Untitled Resume"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Updated: {formatDate(resume.updated_at || new Date().toISOString())}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => navigate(`${ROUTES.RESUME_BUILDER}?id=${resume.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDelete(resume.id)}
                          loading={deletingId === resume.id}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg
                  className="w-20 h-20 text-muted-foreground mx-auto mb-4"
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
                <h3 className="text-xl font-medium text-foreground mb-2">No resumes yet</h3>
                <p className="text-muted-foreground mb-6">Create your first professional resume in minutes</p>
                <Button onClick={() => navigate(ROUTES.RESUME_BUILDER)}>Create Your First Resume</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MyResumes
