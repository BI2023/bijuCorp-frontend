"use client"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { RESUME_TEMPLATES, ROUTES } from "../utils/constants"

const templates = [
  {
    id: RESUME_TEMPLATES.CLASSIC,
    name: "Classic",
    description: "Traditional and professional layout perfect for corporate jobs",
    image: "/classic-professional-resume-template.jpg",
    features: ["Clean layout", "Easy to read", "ATS friendly"],
  },
  {
    id: RESUME_TEMPLATES.MODERN,
    name: "Modern",
    description: "Contemporary design with visual elements for creative roles",
    image: "/modern-creative-resume.png",
    features: ["Eye-catching", "Color accents", "Modern typography"],
  },
  {
    id: RESUME_TEMPLATES.MINIMAL,
    name: "Minimal",
    description: "Simple and elegant design focusing on content",
    image: "/minimal-elegant-resume-template.jpg",
    features: ["Minimalist", "Content focused", "Professional"],
  },
  {
    id: RESUME_TEMPLATES.PROFESSIONAL,
    name: "Professional",
    description: "Compact layout with header contact bar and gray section headers",
    image: "/professional-resume-with-sections-and-bullet-point.jpg",
    features: ["Compact design", "Traditional format", "Information dense"],
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleTemplateSelect = (templateId) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("selectedTemplate", templateId)
      navigate(ROUTES.LOGIN, { state: { from: { pathname: `/dashboard/resume-builder?template=${templateId}` } } })
      return
    }

    // If authenticated, navigate to resume builder with template
    navigate(`/dashboard/resume-builder?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-md"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              bijuCorp
            </h1>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/docs" className="text-gray-700 hover:text-teal-600 font-medium transition-colors hidden sm:block">
              Study Docs
            </a>
            {isAuthenticated ? (
              <button
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors hidden sm:block"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-6 border border-teal-200">
          Professional Resumes & Free Study Materials
        </div>
        <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight">
          Your Learning & Productivity Hub
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Build professional resumes in minutes and access free study materials for your learning journey - all in one
          place
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => (isAuthenticated ? navigate(ROUTES.RESUME_BUILDER) : navigate(ROUTES.REGISTER))}
            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold text-lg"
          >
            Create Resume
          </button>
          <a
            href="/docs"
            className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:shadow-xl hover:border-teal-300 transition-all font-semibold text-lg"
          >
            Browse Study Docs
          </a>
        </div>
      </section>

      {/* Template Gallery */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-4xl font-bold text-center mb-4 text-gray-900">Choose Your Resume Template</h3>
        <p className="text-center text-gray-600 mb-12 text-lg">Professional templates designed to get you hired</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src={template.image || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Select Template
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-bold mb-2 text-gray-900">{template.name}</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl my-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h3>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              1
            </div>
            <h4 className="text-2xl font-bold mb-3 text-gray-900">Choose Template</h4>
            <p className="text-gray-600 leading-relaxed text-lg">Select from our professional template collection</p>
          </div>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              2
            </div>
            <h4 className="text-2xl font-bold mb-3 text-gray-900">Fill Details</h4>
            <p className="text-gray-600 leading-relaxed text-lg">Add your information with our easy-to-use editor</p>
          </div>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              3
            </div>
            <h4 className="text-2xl font-bold mb-3 text-gray-900">Download PDF</h4>
            <p className="text-gray-600 leading-relaxed text-lg">Get your professional resume instantly</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg"></div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  bijuCorp
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Your one-stop platform for professional resume building and free study materials.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="/docs" className="hover:text-teal-600 transition-colors">
                    Study Docs
                  </a>
                </li>
                <li>
                  <a href="/templates" className="hover:text-teal-600 transition-colors">
                    Resume Templates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="/about" className="hover:text-teal-600 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-teal-600 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-600 pt-8 border-t border-gray-200">
            <p>© 2026 bijuCorp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
