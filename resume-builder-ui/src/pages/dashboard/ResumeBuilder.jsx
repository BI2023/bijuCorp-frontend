"use client"

import { useRef, useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useReactToPrint } from "react-to-print"
import { useWallet } from "../../context/WalletContext"
import { resumeAPI } from "../../api/resume.api"
import Navbar from "../../components/layout/Navbar"
import ResumeForm from "../../components/resume/ResumeForm"
import ResumePreview from "../../components/resume/ResumePreview"
import TemplateSelector from "../../components/resume/TemplateSelector"
import Button from "../../components/common/Button"
import Modal from "../../components/common/Modal"
import { PDF_GENERATION_COST, ROUTES } from "../../utils/constants"
import { formatCurrency, downloadPDF } from "../../utils/helpers"

const ResumeBuilder = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { balance, deductMoney } = useWallet()
  const resumeId = searchParams.get("id")

  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: {
      text: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  })
  const [selectedTemplate, setSelectedTemplate] = useState("classic")
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)

  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: resumeData.personal.fullName || "Resume",
  })

  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId)
    }
  }, [resumeId])

  const loadResume = async (id) => {
    try {
      const data = await resumeAPI.getResume(id)
      setResumeData(data.content || resumeData)
      setSelectedTemplate(data.template || "classic")
    } catch (error) {
      console.error("Failed to load resume:", error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (resumeId) {
        await resumeAPI.updateResume(resumeId, {
          content: resumeData,
          template: selectedTemplate,
        })
      } else {
        const newResume = await resumeAPI.createResume({
          title: resumeData.personal.fullName || "Untitled Resume",
          content: resumeData,
          template: selectedTemplate,
        })
        navigate(`${ROUTES.RESUME_BUILDER}?id=${newResume.id}`, { replace: true })
      }
    } catch (error) {
      console.error("Failed to save resume:", error)
      alert("Failed to save resume. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (balance < PDF_GENERATION_COST) {
      alert(`Insufficient balance. You need ${formatCurrency(PDF_GENERATION_COST)} to generate a PDF.`)
      navigate(ROUTES.WALLET)
      return
    }

    if (!resumeId) {
      alert("Please save your resume first before generating a PDF.")
      return
    }

    setGenerating(true)
    try {
      // Deduct money first
      const success = await deductMoney(PDF_GENERATION_COST)
      if (success) {
        setShowPdfModal(false)
        // Trigger print after successful deduction
        // Small delay to ensure modal close doesn't interfere
        setTimeout(() => {
          handlePrint()
        }, 500)
      } else {
        alert("Transaction failed. Please try again.")
      }
    } catch (error) {
      console.error("Failed to process payment:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Toolbar */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              ← Back
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Resume Builder</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleSave} loading={saving}>
              Save
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowPdfModal(true)}>
              Generate PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Template Selector */}
      <TemplateSelector selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} />

      {/* Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form */}
        <div className="w-full lg:w-1/2 border-r border-border overflow-y-auto">
          <ResumeForm resumeData={resumeData} onUpdate={setResumeData} />
        </div>

        {/* Right: Preview */}
        <div className="hidden lg:block w-1/2 overflow-y-auto">
          <div ref={componentRef} className="h-full">
            <ResumePreview resumeData={resumeData} template={selectedTemplate} />
          </div>
        </div>
      </div>

      {/* PDF Generation Modal */}
      <Modal isOpen={showPdfModal} onClose={() => setShowPdfModal(false)} title="Generate PDF">
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            Generating a PDF will cost {formatCurrency(PDF_GENERATION_COST)} from your wallet balance.
          </p>
          <div className="bg-accent p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Balance:</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(balance)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Cost:</span>
              <span className="text-lg font-semibold text-destructive">-{formatCurrency(PDF_GENERATION_COST)}</span>
            </div>
            <div className="h-px bg-border my-2"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">After Generation:</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(balance - PDF_GENERATION_COST)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowPdfModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleGeneratePDF}
              loading={generating}
              disabled={balance < PDF_GENERATION_COST}
            >
              Confirm & Generate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ResumeBuilder
