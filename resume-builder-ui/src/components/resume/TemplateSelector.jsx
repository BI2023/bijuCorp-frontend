"use client"

import { useState } from "react"

const TemplateSelector = ({ selectedTemplate, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)

  const templates = [
    {
      id: "classic",
      name: "Classic",
      description: "Traditional and professional",
      preview: "/classic-professional-resume-template.jpg",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary and stylish",
      preview: "/modern-creative-resume.png",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean and simple",
      preview: "/minimal-elegant-resume-template.jpg",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Organized with bullet points",
      preview: "/professional-resume-with-sections-and-bullet-point.jpg",
    },
  ]

  const currentTemplate = templates.find((t) => t.id === selectedTemplate) || templates[0]

  const handleSelect = (templateId) => {
    onSelect(templateId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Compact Template Display */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Template:</span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-teal-500 transition-all"
          >
            <span className="font-semibold text-gray-900">{currentTemplate.name}</span>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 hidden sm:block">{currentTemplate.description}</p>
      </div>

      {/* Dropdown Template Selector */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-[997]" onClick={() => setIsOpen(false)}></div>

          {/* Dropdown Panel */}
          <div className="absolute left-4 right-4 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-[998] max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template.id)}
                  className={`p-3 border-2 rounded-lg transition-all hover:scale-105 ${
                    selectedTemplate === template.id
                      ? "border-teal-500 bg-teal-50 ring-2 ring-teal-200"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded mb-2 overflow-hidden">
                    <img
                      src={template.preview || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                  <p className="text-xs text-gray-600">{template.description}</p>
                  {selectedTemplate === template.id && (
                    <div className="mt-2 flex items-center justify-center">
                      <span className="text-xs font-semibold text-teal-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Selected
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TemplateSelector
