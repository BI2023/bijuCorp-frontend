"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { ROUTES } from "../utils/constants"
import {
  FileText,
  Type,
  Pencil,
  Highlighter,
  Eraser,
  Square,
  Circle,
  Image as ImageIcon,
  PenTool,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Trash2,
  Download,
  Upload,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Printer,
  Calendar,
  Stamp,
  Sparkles,
  Move,
  Lock,
  ArrowRight
} from "lucide-react"

// Pure JS Multi-Page PDF Compiler (standard PDF-1.4 with DCTDecode JPEG streams)
function compilePdfFromPages(pages) {
  const parts = []
  let byteLength = 0

  function write(str) {
    const buf = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) {
      buf[i] = str.charCodeAt(i) & 0xff
    }
    parts.push(buf)
    byteLength += buf.length
  }

  function writeBytes(uint8Arr) {
    parts.push(uint8Arr)
    byteLength += uint8Arr.length
  }

  write("%PDF-1.4\n")
  const offsets = []
  let objCount = 0

  function startObj() {
    objCount++
    offsets.push(byteLength)
    write(`${objCount} 0 obj\n`)
    return objCount
  }

  function endObj() {
    write("endobj\n")
  }

  const catalogId = 1
  const pagesId = 2

  // 1: Catalog
  startObj()
  write(`<< /Type /Catalog /Pages ${pagesId} 0 R >>\n`)
  endObj()

  // 2: Pages container
  const pageKids = []
  for (let i = 0; i < pages.length; i++) {
    pageKids.push(`${3 + i * 3} 0 R`)
  }
  startObj()
  write(`<< /Type /Pages /Kids [${pageKids.join(" ")}] /Count ${pages.length} >>\n`)
  endObj()

  // Per-page objects
  for (let i = 0; i < pages.length; i++) {
    const { width, height, jpegBytes } = pages[i]
    const pageId = 3 + i * 3
    const contentId = 4 + i * 3
    const imgId = 5 + i * 3

    // Page object
    startObj()
    write(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${width} ${height}] /Contents ${contentId} 0 R /Resources << /XObject << /Im${i} ${imgId} 0 R >> >> >>\n`
    )
    endObj()

    // Content stream: scale image to fit page
    const streamContent = `q\n${width} 0 0 ${height} 0 0 cm\n/Im${i} Do\nQ\n`
    startObj()
    write(`<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream\n`)
    endObj()

    // Image XObject with JPEG filter
    startObj()
    write(
      `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
    )
    writeBytes(jpegBytes)
    write("\nendstream\n")
    endObj()
  }

  // Cross-reference table
  const startXref = byteLength
  write(`xref\n0 ${objCount + 1}\n0000000000 65535 f \n`)
  for (let i = 0; i < offsets.length; i++) {
    const off = offsets[i].toString().padStart(10, "0")
    write(`${off} 00000 n \n`)
  }
  write(`trailer\n<< /Size ${objCount + 1} /Root ${catalogId} 0 R >>\nstartxref\n${startXref}\n%%EOF\n`)

  // Flatten array of Uint8Arrays into single Blob
  return new Blob(parts, { type: "application/pdf" })
}

// Convert base64 dataURL to Uint8Array
function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// Sample Documents for one-click testing
const SAMPLE_DOCS = [
  {
    id: "offer-letter",
    title: "Job_Offer_Letter.pdf",
    pages: 1,
    renderTemplate: (ctx, width, height) => {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Header Banner
      ctx.fillStyle = "#0f766e"
      ctx.fillRect(0, 0, width, 18)

      // Logo & Company
      ctx.fillStyle = "#0f766e"
      ctx.font = "bold 26px sans-serif"
      ctx.fillText("BIJUCORP TECHNOLOGIES", 50, 70)

      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.fillText("123 Innovation Boulevard, Suite 500 • contact@bijucorp.com", 50, 92)

      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(50, 110)
      ctx.lineTo(width - 50, 110)
      ctx.stroke()

      // Date & Recipient
      ctx.fillStyle = "#1e293b"
      ctx.font = "13px sans-serif"
      ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 50, 140)
      ctx.fillText("Candidate: Alex Morgan", 50, 160)
      ctx.fillText("Position: Senior Full-Stack Engineer", 50, 180)

      // Body Title
      ctx.fillStyle = "#0f766e"
      ctx.font = "bold 18px sans-serif"
      ctx.fillText("FORMAL OFFER OF EMPLOYMENT", 50, 225)

      // Body Paragraphs
      ctx.fillStyle = "#334155"
      ctx.font = "13px sans-serif"
      const lines = [
        "Dear Alex,",
        "We are thrilled to extend an offer of employment for the position of Senior Full-Stack Engineer at bijuCorp.",
        "Your impressive engineering background and technical expertise will be instrumental in scaling our platform.",
        "",
        "Key Terms & Compensation:",
        "  • Annual Base Salary: $145,000 USD (paid semi-monthly)",
        "  • Equity Grant: 15,000 Incentive Stock Options (4-year vesting with 1-year cliff)",
        "  • Comprehensive Health, Dental & Vision coverage (100% company sponsored)",
        "  • Flexible Remote Work Policy & Annual Professional Development Allowance ($3,000)",
        "",
        "Please review this letter, sign on the signature line below, and return the executed document.",
        "We are eager to welcome you to our growing engineering team!",
        "",
        "Sincerely,",
        "Bhupendra Singh",
        "Founder & CEO, bijuCorp",
      ]

      let y = 255
      for (const line of lines) {
        if (line.startsWith("Key Terms") || line.startsWith("Sincerely")) {
          ctx.font = "bold 13px sans-serif"
          ctx.fillStyle = "#0f766e"
        } else {
          ctx.font = "13px sans-serif"
          ctx.fillStyle = "#334155"
        }
        ctx.fillText(line, 50, y)
        y += 20
      }

      // Signature area box
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 1.5
      ctx.strokeRect(50, height - 160, 260, 90)
      ctx.fillStyle = "#64748b"
      ctx.font = "italic 11px sans-serif"
      ctx.fillText("Candidate Signature & Date", 65, height - 85)

      // Footer
      ctx.fillStyle = "#94a3b8"
      ctx.font = "10px sans-serif"
      ctx.fillText("bijuCorp Technologies Inc. • Confidential Document • Page 1 of 1", 50, height - 30)
    },
  },
  {
    id: "consulting-agreement",
    title: "Consulting_Services_Agreement.pdf",
    pages: 1,
    renderTemplate: (ctx, width, height) => {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Blue accent line
      ctx.fillStyle = "#2563eb"
      ctx.fillRect(0, 0, width, 14)

      ctx.fillStyle = "#1e3a8a"
      ctx.font = "bold 24px serif"
      ctx.fillText("INDEPENDENT CONSULTING AGREEMENT", 50, 65)

      ctx.fillStyle = "#64748b"
      ctx.font = "11px sans-serif"
      ctx.fillText("Contract Ref: BJC-2026-CONSULT-042", 50, 85)

      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(50, 100)
      ctx.lineTo(width - 50, 100)
      ctx.stroke()

      const textBlocks = [
        "This Agreement is entered into by and between bijuCorp ('Client') and Consultant ('Contractor').",
        "",
        "1. SCOPE OF SERVICES",
        "The Consultant shall deliver professional software architecture design, security code reviews, and cloud",
        "infrastructure deployment guidelines in accordance with the specifications in Exhibit A.",
        "",
        "2. COMPENSATION & INVOICING",
        "Client agrees to pay Consultant an agreed project fee of $12,500 payable in milestones:",
        "  - Milestone 1: Architectural blueprint (30%)",
        "  - Milestone 2: Implementation & test suite completion (50%)",
        "  - Milestone 3: Production launch & sign-off (20%)",
        "",
        "3. INTELLECTUAL PROPERTY & CONFIDENTIALITY",
        "All work products, source code, and documentation generated under this agreement shall belong exclusively",
        "to Client as work-made-for-hire upon complete payment.",
      ]

      let y = 135
      for (const block of textBlocks) {
        if (/^[1-3]\./.test(block)) {
          ctx.font = "bold 13px sans-serif"
          ctx.fillStyle = "#1e3a8a"
        } else {
          ctx.font = "12px sans-serif"
          ctx.fillStyle = "#334155"
        }
        ctx.fillText(block, 50, y)
        y += 22
      }

      // Two signature boxes
      ctx.strokeStyle = "#cbd5e1"
      ctx.strokeRect(50, height - 160, 220, 80)
      ctx.strokeRect(width - 270, height - 160, 220, 80)

      ctx.fillStyle = "#64748b"
      ctx.font = "11px sans-serif"
      ctx.fillText("Client Representative Signature", 60, height - 95)
      ctx.fillText("Consultant Signature", width - 260, height - 95)

      ctx.fillStyle = "#94a3b8"
      ctx.font = "10px sans-serif"
      ctx.fillText("Confidential • bijuCorp Legal Department", 50, height - 30)
    },
  },
]

export default function PdfEditor() {
  const navigate = useNavigate()
  const [docName, setDocName] = useState("")
  const [pages, setPages] = useState([]) // Array of base canvas image dataURLs
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [annotations, setAnnotations] = useState({}) // { [pageIndex]: Array<Annotation> }
  const [history, setHistory] = useState([]) // Undo history
  const [redoList, setRedoList] = useState([]) // Redo history
  const [activeTool, setActiveTool] = useState("select") // 'select' | 'text' | 'draw' | 'highlight' | 'whiteout' | 'shape' | 'stamp'
  const [zoom, setZoom] = useState(1.0)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  // Tool settings
  const [textColor, setTextColor] = useState("#000000")
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState("sans-serif")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isTextWhiteoutBg, setIsTextWhiteoutBg] = useState(false)
  const [penColor, setPenColor] = useState("#dc2626")
  const [penSize, setPenSize] = useState(3)
  const [whiteoutColor, setWhiteoutColor] = useState("#ffffff")
  const [highlightColor, setHighlightColor] = useState("rgba(250, 204, 21, 0.45)")
  const [selectedShape, setSelectedShape] = useState("rectangle")
  const [shapeStrokeColor, setShapeStrokeColor] = useState("#0f766e")
  const [shapeFillColor, setShapeFillColor] = useState("transparent")

  // Freehand drawing state
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState([])

  // Dragging & Resizing state
  const [draggingId, setDraggingId] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizingId, setResizingId] = useState(null)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  // Signature Modal state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
  const [sigMode, setSigMode] = useState("draw") // 'draw' | 'type'
  const [typedSigText, setTypedSigText] = useState("Alex Morgan")
  const [typedSigFont, setTypedSigFont] = useState("cursive")
  const sigCanvasRef = useRef(null)
  const [isSigDrawing, setIsSigDrawing] = useState(false)

  // Document Container & Canvas Refs
  const pageContainerRef = useRef(null)
  const baseCanvasRef = useRef(null)
  const drawCanvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageUploadRef = useRef(null)

  // Standard Page Dimensions (Letter: 612 x 792 pt, scaled 1.5x for crisp 918 x 1188 px)
  const PAGE_WIDTH = 612
  const PAGE_HEIGHT = 792

  // Save state to undo history
  const recordHistory = (newAnnotations) => {
    setHistory((prev) => [...prev.slice(-20), annotations])
    setRedoList([])
    setAnnotations(newAnnotations)
  }

  // Undo
  const handleUndo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setRedoList((r) => [annotations, ...r])
    setAnnotations(prev)
    setHistory((h) => h.slice(0, -1))
  }

  // Redo
  const handleRedo = () => {
    if (redoList.length === 0) return
    const next = redoList[0]
    setHistory((h) => [...h, annotations])
    setAnnotations(next)
    setRedoList((r) => r.slice(1))
  }

  // Load a sample document
  const handleLoadSample = (sampleDoc) => {
    const canvas = document.createElement("canvas")
    canvas.width = PAGE_WIDTH
    canvas.height = PAGE_HEIGHT
    const ctx = canvas.getContext("2d")
    sampleDoc.renderTemplate(ctx, PAGE_WIDTH, PAGE_HEIGHT)
    const dataUrl = canvas.toDataURL("image/png")

    setDocName(sampleDoc.title)
    setPages([dataUrl])
    setCurrentPageIndex(0)
    setAnnotations({})
    setHistory([])
    setRedoList([])
    setSelectedAnnotationId(null)
  }

  // Handle uploading PDF from user's file picker
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setDocName(file.name)
    setAnnotations({})
    setHistory([])
    setRedoList([])
    setSelectedAnnotationId(null)

    const arrayBuffer = await file.arrayBuffer()

    // Try loading with pdfjsLib if available
    if (window.pdfjsLib) {
      try {
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const renderedPages = []

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 1.5 })
          const canvas = document.createElement("canvas")
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext("2d")
          await page.render({ canvasContext: ctx, viewport }).promise
          renderedPages.push(canvas.toDataURL("image/png"))
        }

        if (renderedPages.length > 0) {
          setPages(renderedPages)
          setCurrentPageIndex(0)
          return
        }
      } catch (err) {
        console.warn("PDF.js render failed or not supported, falling back to document canvas", err)
      }
    }

    // Fallback: Generate clean initial document canvas
    const canvas = document.createElement("canvas")
    canvas.width = PAGE_WIDTH
    canvas.height = PAGE_HEIGHT
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT)

    // Document header banner
    ctx.fillStyle = "#0f766e"
    ctx.fillRect(0, 0, PAGE_WIDTH, 12)

    ctx.fillStyle = "#0f766e"
    ctx.font = "bold 20px sans-serif"
    ctx.fillText("UPLOADED DOCUMENT", 50, 60)

    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.fillText(`File: ${file.name} • ${Math.round(file.size / 1024)} KB`, 50, 85)

    ctx.strokeStyle = "#e2e8f0"
    ctx.beginPath()
    ctx.moveTo(50, 105)
    ctx.lineTo(PAGE_WIDTH - 50, 105)
    ctx.stroke()

    ctx.fillStyle = "#334155"
    ctx.font = "13px sans-serif"
    ctx.fillText("You can now edit this document using the toolbar above.", 50, 140)
    ctx.fillText("• Click 'Text' to place text anywhere on the page.", 50, 170)
    ctx.fillText("• Use 'Whiteout' to redact or cover up unwanted information.", 50, 195)
    ctx.fillText("• Click 'Sign' to insert a digital signature.", 50, 220)
    ctx.fillText("• Use 'Pen' to draw or 'Highlight' to mark important areas.", 50, 245)

    setPages([canvas.toDataURL("image/png")])
    setCurrentPageIndex(0)
  }

  // Create a new blank page
  const handleAddBlankPage = () => {
    const canvas = document.createElement("canvas")
    canvas.width = PAGE_WIDTH
    canvas.height = PAGE_HEIGHT
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT)
    const newPages = [...pages, canvas.toDataURL("image/png")]
    setPages(newPages)
    setCurrentPageIndex(newPages.length - 1)
  }

  // Delete current page
  const handleDeleteCurrentPage = () => {
    if (pages.length <= 1) return
    const newPages = pages.filter((_, i) => i !== currentPageIndex)
    setPages(newPages)
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1))
  }

  // Rotate current page 90 degrees
  const handleRotatePage = () => {
    if (!pages[currentPageIndex]) return
    const img = new Image()
    img.src = pages[currentPageIndex]
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.height
      canvas.height = img.width
      const ctx = canvas.getContext("2d")
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((90 * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      const updated = [...pages]
      updated[currentPageIndex] = canvas.toDataURL("image/png")
      setPages(updated)
    }
  }

  // Render base page to baseCanvasRef
  useEffect(() => {
    if (!baseCanvasRef.current || pages.length === 0) return
    const canvas = baseCanvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.src = pages[currentPageIndex]
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
    }
  }, [pages, currentPageIndex])

  // Get current page's annotations
  const currentAnnotations = annotations[currentPageIndex] || []

  // Add an annotation to current page
  const addAnnotation = (annotation) => {
    const newAnnotations = {
      ...annotations,
      [currentPageIndex]: [...currentAnnotations, { ...annotation, id: Date.now().toString() }],
    }
    recordHistory(newAnnotations)
  }

  // Update an annotation
  const updateAnnotation = (id, updates) => {
    const newAnnotations = {
      ...annotations,
      [currentPageIndex]: currentAnnotations.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }
    recordHistory(newAnnotations)
  }

  // Delete an annotation
  const deleteAnnotation = (id) => {
    const newAnnotations = {
      ...annotations,
      [currentPageIndex]: currentAnnotations.filter((item) => item.id !== id),
    }
    recordHistory(newAnnotations)
    setSelectedAnnotationId(null)
  }

  // Stage click: place text or whiteout or shape when clicking canvas
  const handleStageClick = (e) => {
    if (activeTool === "select" || activeTool === "draw") return

    const rect = pageContainerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = Math.round((e.clientX - rect.left) / zoom)
    const y = Math.round((e.clientY - rect.top) / zoom)

    if (activeTool === "text") {
      addAnnotation({
        type: "text",
        x: Math.max(10, x - 50),
        y: Math.max(10, y - 15),
        text: "Type text here...",
        fontSize,
        fontFamily,
        color: textColor,
        bold: isBold,
        italic: isItalic,
        whiteoutBg: isTextWhiteoutBg,
        width: 180,
      })
      setActiveTool("select")
    } else if (activeTool === "whiteout") {
      addAnnotation({
        type: "whiteout",
        x: Math.max(10, x - 60),
        y: Math.max(10, y - 12),
        width: 120,
        height: 24,
        color: whiteoutColor,
      })
      setActiveTool("select")
    } else if (activeTool === "highlight") {
      addAnnotation({
        type: "highlight",
        x: Math.max(10, x - 80),
        y: Math.max(10, y - 10),
        width: 160,
        height: 20,
        color: highlightColor,
      })
      setActiveTool("select")
    } else if (activeTool === "shape") {
      addAnnotation({
        type: "shape",
        shapeType: selectedShape,
        x: Math.max(10, x - 60),
        y: Math.max(10, y - 40),
        width: 120,
        height: 80,
        strokeColor: shapeStrokeColor,
        fillColor: shapeFillColor,
      })
      setActiveTool("select")
    }
  }

  // Freehand drawing handlers on overlay canvas
  const handleDrawMouseDown = (e) => {
    if (activeTool !== "draw") return
    setIsDrawing(true)
    const rect = pageContainerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom
    setCurrentPath([{ x, y }])
  }

  const handleDrawMouseMove = (e) => {
    if (!isDrawing || activeTool !== "draw") return
    const rect = pageContainerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom
    setCurrentPath((prev) => [...prev, { x, y }])

    // Render path onto active draw canvas
    if (drawCanvasRef.current) {
      const ctx = drawCanvasRef.current.getContext("2d")
      ctx.strokeStyle = penColor
      ctx.lineWidth = penSize
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      if (currentPath.length > 0) {
        ctx.moveTo(currentPath[0].x, currentPath[0].y)
        for (let i = 1; i < currentPath.length; i++) {
          ctx.lineTo(currentPath[i].x, currentPath[i].y)
        }
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }
  }

  const handleDrawMouseUp = () => {
    if (!isDrawing || activeTool !== "draw") return
    setIsDrawing(false)
    if (currentPath.length > 1) {
      addAnnotation({
        type: "draw",
        points: currentPath,
        color: penColor,
        size: penSize,
      })
    }
    setCurrentPath([])
    if (drawCanvasRef.current) {
      const ctx = drawCanvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height)
    }
  }

  // Handle Dragging an annotation
  const handleAnnotationMouseDown = (e, id) => {
    if (activeTool !== "select") return
    e.stopPropagation()
    setSelectedAnnotationId(id)
    setDraggingId(id)

    const ann = currentAnnotations.find((a) => a.id === id)
    if (!ann) return
    setDragOffset({
      x: e.clientX - ann.x * zoom,
      y: e.clientY - ann.y * zoom,
    })
  }

  const handleStageMouseMove = (e) => {
    if (draggingId) {
      const newX = Math.round((e.clientX - dragOffset.x) / zoom)
      const newY = Math.round((e.clientY - dragOffset.y) / zoom)
      updateAnnotation(draggingId, { x: newX, y: newY })
    } else if (resizingId) {
      const deltaX = (e.clientX - resizeStart.x) / zoom
      const deltaY = (e.clientY - resizeStart.y) / zoom
      const newW = Math.max(30, Math.round(resizeStart.width + deltaX))
      const newH = Math.max(20, Math.round(resizeStart.height + deltaY))
      updateAnnotation(resizingId, { width: newW, height: newH })
    }
  }

  const handleStageMouseUp = () => {
    if (draggingId) setDraggingId(null)
    if (resizingId) setResizingId(null)
  }

  // Image insertion handler
  const handleInsertImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      addAnnotation({
        type: "image",
        x: 100,
        y: 100,
        width: 140,
        height: 100,
        dataUrl,
      })
      setActiveTool("select")
    }
    reader.readAsDataURL(file)
  }

  // Stamp quick insertion
  const handleInsertStamp = (label, color = "#dc2626") => {
    addAnnotation({
      type: "stamp",
      x: 150,
      y: 150,
      label,
      color,
    })
    setActiveTool("select")
  }

  // Signature canvas handlers
  const handleSigMouseDown = (e) => {
    setIsSigDrawing(true)
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    ctx.strokeStyle = "#1e3a8a"
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const handleSigMouseMove = (e) => {
    if (!isSigDrawing) return
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const handleSigMouseUp = () => {
    setIsSigDrawing(false)
  }

  const clearSigCanvas = () => {
    if (sigCanvasRef.current) {
      const ctx = sigCanvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height)
    }
  }

  // Save Signature onto PDF
  const handleAdoptSignature = () => {
    let sigDataUrl = ""
    if (sigMode === "draw") {
      if (!sigCanvasRef.current) return
      sigDataUrl = sigCanvasRef.current.toDataURL("image/png")
    } else {
      const canvas = document.createElement("canvas")
      canvas.width = 300
      canvas.height = 100
      const ctx = canvas.getContext("2d")
      ctx.font = "italic 36px cursive"
      ctx.fillStyle = "#1e3a8a"
      ctx.fillText(typedSigText, 20, 60)
      sigDataUrl = canvas.toDataURL("image/png")
    }

    addAnnotation({
      type: "signature",
      x: 100,
      y: 350,
      width: 180,
      height: 70,
      dataUrl: sigDataUrl,
    })
    setIsSignatureModalOpen(false)
    setActiveTool("select")
  }

  // Generate composite canvas for a given page
  const renderCompositePage = (pageIdx) => {
    return new Promise((resolve) => {
      const baseImg = new Image()
      baseImg.src = pages[pageIdx]
      baseImg.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = baseImg.width
        canvas.height = baseImg.height
        const ctx = canvas.getContext("2d")

        // Draw original page
        ctx.drawImage(baseImg, 0, 0)

        // Draw annotations
        const pageAnns = annotations[pageIdx] || []

        // 1. Whiteouts & Highlights first
        for (const ann of pageAnns) {
          if (ann.type === "whiteout") {
            ctx.fillStyle = ann.color || "#ffffff"
            ctx.fillRect(ann.x, ann.y, ann.width, ann.height)
          } else if (ann.type === "highlight") {
            ctx.fillStyle = ann.color || "rgba(250, 204, 21, 0.45)"
            ctx.fillRect(ann.x, ann.y, ann.width, ann.height)
          }
        }

        // 2. Shapes
        for (const ann of pageAnns) {
          if (ann.type === "shape") {
            ctx.strokeStyle = ann.strokeColor || "#0f766e"
            ctx.lineWidth = 2
            if (ann.shapeType === "rectangle") {
              if (ann.fillColor && ann.fillColor !== "transparent") {
                ctx.fillStyle = ann.fillColor
                ctx.fillRect(ann.x, ann.y, ann.width, ann.height)
              }
              ctx.strokeRect(ann.x, ann.y, ann.width, ann.height)
            } else if (ann.shapeType === "circle") {
              ctx.beginPath()
              ctx.ellipse(
                ann.x + ann.width / 2,
                ann.y + ann.height / 2,
                ann.width / 2,
                ann.height / 2,
                0,
                0,
                2 * Math.PI
              )
              if (ann.fillColor && ann.fillColor !== "transparent") {
                ctx.fillStyle = ann.fillColor
                ctx.fill()
              }
              ctx.stroke()
            }
          }
        }

        // 3. Freehand drawings
        for (const ann of pageAnns) {
          if (ann.type === "draw" && ann.points && ann.points.length > 1) {
            ctx.strokeStyle = ann.color || "#dc2626"
            ctx.lineWidth = ann.size || 3
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.beginPath()
            ctx.moveTo(ann.points[0].x, ann.points[0].y)
            for (let i = 1; i < ann.points.length; i++) {
              ctx.lineTo(ann.points[i].x, ann.points[i].y)
            }
            ctx.stroke()
          }
        }

        // 4. Text & Stamps
        for (const ann of pageAnns) {
          if (ann.type === "text") {
            const fontStyle = `${ann.italic ? "italic " : ""}${ann.bold ? "bold " : ""}${ann.fontSize || 16}px ${
              ann.fontFamily || "sans-serif"
            }`
            ctx.font = fontStyle

            if (ann.whiteoutBg) {
              const metrics = ctx.measureText(ann.text)
              ctx.fillStyle = "#ffffff"
              ctx.fillRect(ann.x - 2, ann.y - (ann.fontSize || 16), metrics.width + 6, (ann.fontSize || 16) + 6)
            }

            ctx.fillStyle = ann.color || "#000000"
            ctx.fillText(ann.text, ann.x, ann.y)
          } else if (ann.type === "stamp") {
            ctx.save()
            ctx.translate(ann.x, ann.y)
            ctx.rotate((-12 * Math.PI) / 180)
            ctx.strokeStyle = ann.color || "#dc2626"
            ctx.lineWidth = 3
            ctx.strokeRect(0, 0, 160, 48)

            ctx.fillStyle = ann.color || "#dc2626"
            ctx.font = "bold 18px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(ann.label || "APPROVED", 80, 32)
            ctx.restore()
          }
        }

        // 5. Images and Signatures (require image loading)
        const imageAnns = pageAnns.filter((a) => a.type === "image" || a.type === "signature")
        if (imageAnns.length === 0) {
          resolve(canvas)
          return
        }

        let loadedCount = 0
        imageAnns.forEach((imgAnn) => {
          const img = new Image()
          img.src = imgAnn.dataUrl
          img.onload = () => {
            ctx.drawImage(img, imgAnn.x, imgAnn.y, imgAnn.width, imgAnn.height)
            loadedCount++
            if (loadedCount === imageAnns.length) {
              resolve(canvas)
            }
          }
        })
      }
    })
  }

  // Export / Download the Edited PDF
  const handleDownloadPdf = async () => {
    if (pages.length === 0) return
    setIsExporting(true)

    try {
      const compiledPages = []
      for (let i = 0; i < pages.length; i++) {
        const pageCanvas = await renderCompositePage(i)
        const jpegDataUrl = pageCanvas.toDataURL("image/jpeg", 0.92)
        const jpegBytes = dataUrlToUint8Array(jpegDataUrl)
        compiledPages.push({
          width: pageCanvas.width,
          height: pageCanvas.height,
          jpegBytes,
        })
      }

      const pdfBlob = compilePdfFromPages(compiledPages)
      const downloadUrl = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      const finalName = (docName || "document").replace(/\.[^/.]+$/, "") + "_edited.pdf"
      a.href = downloadUrl
      a.download = finalName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 4000)
    } catch (err) {
      console.error("Export failed:", err)
    } finally {
      setIsExporting(false)
    }
  }

  // Print Document
  const handlePrint = async () => {
    if (pages.length === 0) return
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const pageImages = []
    for (let i = 0; i < pages.length; i++) {
      const pageCanvas = await renderCompositePage(i)
      pageImages.push(pageCanvas.toDataURL("image/png"))
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${docName || "Print Document"}</title>
          <style>
            body { margin: 0; padding: 0; }
            .page { width: 100vw; height: 100vh; page-break-after: always; display: flex; align-items: center; justify-content: center; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          ${pageImages.map((src) => `<div class="page"><img src="${src}"/></div>`).join("")}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col">
        {pages.length === 0 ? (
          /* Empty / Upload View */
          <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-3 border border-teal-200">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Free & Unlimited Online PDF Editor</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Edit, Sign & Annotate Any PDF
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Add text, erase unwanted content with whiteout, draw signatures, highlight important clauses, and
                download your edited PDF in seconds.
              </p>
            </div>

            {/* Dropzone Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-3xl border-2 border-dashed border-teal-300 hover:border-teal-500 shadow-xl p-10 text-center cursor-pointer transition-all hover:shadow-2xl group relative overflow-hidden"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload your PDF file</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Drag and drop your PDF here, or click anywhere to choose a file from your computer
              </p>
              <button
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-teal-500/30 transition-all inline-flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                <span>Choose PDF File</span>
              </button>
            </div>

            {/* One-click Sample Documents */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-700">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Or test immediately with a sample document:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {SAMPLE_DOCS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className="px-4 py-2 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-gray-200 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Promise & Features Grid */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>100% Private:</strong> Your document is processed strictly in your browser. Files are never
                uploaded to external servers.
              </span>
            </div>
          </div>
        ) : (
          /* Active Editor Canvas View */
          <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
            {/* Top Editor Toolbar */}
            <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between gap-4 z-20 shadow-sm flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-sm text-gray-800 max-w-[180px] sm:max-w-xs truncate">
                    {docName}
                  </span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-gray-500 hover:text-gray-800 font-semibold underline hidden sm:inline"
                >
                  Replace PDF
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Zoom & History Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="p-1.5 text-gray-600 hover:bg-slate-100 rounded-lg disabled:opacity-40 transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoList.length === 0}
                  className="p-1.5 text-gray-600 hover:bg-slate-100 rounded-lg disabled:opacity-40 transition-colors"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
                <div className="h-5 w-px bg-gray-200 mx-1" />
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                  className="p-1.5 text-gray-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-gray-700 w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
                  className="p-1.5 text-gray-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Actions: Print & Download */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 text-gray-700 hover:bg-slate-100 rounded-xl transition-colors border border-gray-200 hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                  title="Print PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-teal-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? "Compiling PDF..." : "Download Edited PDF"}</span>
                </button>
              </div>
            </header>

            {/* Secondary Tool Selection Ribbon */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto z-10">
              <div className="flex items-center gap-1.5">
                {/* Select Tool */}
                <button
                  onClick={() => {
                    setActiveTool("select")
                    setSelectedAnnotationId(null)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTool === "select"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <Move className="w-3.5 h-3.5" />
                  <span>Select / Move</span>
                </button>

                {/* Text Tool */}
                <button
                  onClick={() => {
                    setActiveTool("text")
                    setSelectedAnnotationId(null)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTool === "text"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Text</span>
                </button>

                {/* Whiteout Tool */}
                <button
                  onClick={() => {
                    setActiveTool("whiteout")
                    setSelectedAnnotationId(null)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTool === "whiteout"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Whiteout</span>
                </button>

                {/* Freehand Pen */}
                <button
                  onClick={() => {
                    setActiveTool("draw")
                    setSelectedAnnotationId(null)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTool === "draw"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Draw / Pen</span>
                </button>

                {/* Highlight */}
                <button
                  onClick={() => {
                    setActiveTool("highlight")
                    setSelectedAnnotationId(null)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTool === "highlight"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <Highlighter className="w-3.5 h-3.5" />
                  <span>Highlight</span>
                </button>

                {/* Digital Signature */}
                <button
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all border border-blue-200"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Sign Document</span>
                </button>

                {/* Shapes */}
                <button
                  onClick={() => {
                    setActiveTool("shape")
                    setSelectedAnnotationId(null)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTool === "shape"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Shapes</span>
                </button>

                {/* Add Image */}
                <button
                  onClick={() => imageUploadRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-gray-700 hover:bg-slate-100 transition-all border border-gray-200"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span>Insert Image</span>
                </button>
                <input
                  ref={imageUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInsertImage}
                  className="hidden"
                />

                {/* Date Stamp */}
                <button
                  onClick={() => handleInsertStamp(`DATE: ${new Date().toLocaleDateString()}`, "#2563eb")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-gray-700 hover:bg-slate-100 transition-all border border-gray-200"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Date Stamp</span>
                </button>

                {/* Approved Stamp */}
                <button
                  onClick={() => handleInsertStamp("APPROVED", "#16a34a")}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
                >
                  + Approved Stamp
                </button>
              </div>

              {/* Clear Page Annotations */}
              <button
                onClick={() => {
                  const updated = { ...annotations, [currentPageIndex]: [] }
                  recordHistory(updated)
                }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 px-2 py-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Annotations</span>
              </button>
            </div>

            {/* Context Tool Controls Bar */}
            {(activeTool === "text" || (selectedAnnotationId && currentAnnotations.find((a) => a.id === selectedAnnotationId)?.type === "text")) && (
              <div className="bg-slate-50 border-b border-gray-200 px-6 py-2 flex items-center gap-4 text-xs">
                <span className="font-bold text-gray-600">Text Settings:</span>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    const sz = Number(e.target.value)
                    setFontSize(sz)
                    if (selectedAnnotationId) updateAnnotation(selectedAnnotationId, { fontSize: sz })
                  }}
                  className="px-2 py-1 border rounded bg-white text-gray-800"
                >
                  {[12, 14, 16, 18, 20, 24, 28, 32].map((s) => (
                    <option key={s} value={s}>
                      {s}px
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setIsBold(!isBold)
                      if (selectedAnnotationId) updateAnnotation(selectedAnnotationId, { bold: !isBold })
                    }}
                    className={`px-2 py-1 border rounded font-bold ${isBold ? "bg-teal-600 text-white" : "bg-white text-gray-700"}`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => {
                      setIsItalic(!isItalic)
                      if (selectedAnnotationId) updateAnnotation(selectedAnnotationId, { italic: !isItalic })
                    }}
                    className={`px-2 py-1 border rounded italic ${isItalic ? "bg-teal-600 text-white" : "bg-white text-gray-700"}`}
                  >
                    I
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Color:</span>
                  {["#000000", "#dc2626", "#2563eb", "#16a34a", "#9333ea"].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setTextColor(c)
                        if (selectedAnnotationId) updateAnnotation(selectedAnnotationId, { color: c })
                      }}
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={isTextWhiteoutBg}
                    onChange={(e) => {
                      setIsTextWhiteoutBg(e.target.checked)
                      if (selectedAnnotationId) updateAnnotation(selectedAnnotationId, { whiteoutBg: e.target.checked })
                    }}
                  />
                  <span>White background (Opaque)</span>
                </label>
              </div>
            )}

            {activeTool === "draw" && (
              <div className="bg-slate-50 border-b border-gray-200 px-6 py-2 flex items-center gap-4 text-xs">
                <span className="font-bold text-gray-600">Pen Settings:</span>
                <div className="flex items-center gap-1.5">
                  {["#dc2626", "#000000", "#2563eb", "#16a34a", "#d97706"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setPenColor(c)}
                      className={`w-5 h-5 rounded-full border-2 ${penColor === c ? "border-gray-800 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span>Size:</span>
                  {[2, 4, 8].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setPenSize(sz)}
                      className={`px-2 py-0.5 border rounded ${penSize === sz ? "bg-teal-600 text-white" : "bg-white"}`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Split Canvas Layout: Thumbnails + Main View */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Thumbnails Strip */}
              <aside className="w-48 bg-slate-200 border-r border-gray-300 p-3 overflow-y-auto hidden md:flex flex-col gap-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Pages ({pages.length})
                </div>
                {pages.map((pageUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentPageIndex(idx)
                      setSelectedAnnotationId(null)
                    }}
                    className={`relative rounded-xl border-2 p-1.5 cursor-pointer transition-all bg-white shadow-sm hover:shadow ${
                      currentPageIndex === idx
                        ? "border-teal-600 ring-2 ring-teal-200"
                        : "border-gray-300 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img src={pageUrl} alt={`Page ${idx + 1}`} className="w-full aspect-[612/792] object-cover rounded" />
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded">
                      Page {idx + 1}
                    </span>
                  </div>
                ))}

                <button
                  onClick={handleAddBlankPage}
                  className="w-full py-2.5 border-2 border-dashed border-gray-400 hover:border-teal-600 rounded-xl text-xs font-bold text-gray-600 hover:text-teal-700 transition-colors flex items-center justify-center gap-1 bg-white/50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Blank Page</span>
                </button>
              </aside>

              {/* Center Canvas Area */}
              <div
                className="flex-1 bg-slate-200 overflow-auto p-4 sm:p-8 flex items-center justify-center"
                onMouseMove={handleStageMouseMove}
                onMouseUp={handleStageMouseUp}
              >
                {/* Simulated Paper Sheet */}
                <div
                  ref={pageContainerRef}
                  onClick={handleStageClick}
                  style={{
                    width: PAGE_WIDTH * zoom,
                    height: PAGE_HEIGHT * zoom,
                  }}
                  className="relative bg-white shadow-2xl rounded border border-gray-300 overflow-hidden cursor-crosshair select-none flex-shrink-0"
                >
                  {/* Base PDF Page Canvas */}
                  <canvas
                    ref={baseCanvasRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />

                  {/* Freehand Draw Canvas */}
                  <canvas
                    ref={drawCanvasRef}
                    width={PAGE_WIDTH}
                    height={PAGE_HEIGHT}
                    onMouseDown={handleDrawMouseDown}
                    onMouseMove={handleDrawMouseMove}
                    onMouseUp={handleDrawMouseUp}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      pointerEvents: activeTool === "draw" ? "auto" : "none",
                      zIndex: 10,
                    }}
                  />

                  {/* Annotations Overlay Layer */}
                  <div
                    style={{
                      width: PAGE_WIDTH,
                      height: PAGE_HEIGHT,
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                    }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {currentAnnotations.map((ann) => {
                      const isSelected = selectedAnnotationId === ann.id

                      if (ann.type === "text") {
                        return (
                          <div
                            key={ann.id}
                            onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)}
                            style={{
                              left: ann.x,
                              top: ann.y - (ann.fontSize || 16),
                              color: ann.color || "#000000",
                              fontSize: ann.fontSize || 16,
                              fontFamily: ann.fontFamily || "sans-serif",
                              fontWeight: ann.bold ? "bold" : "normal",
                              fontStyle: ann.italic ? "italic" : "normal",
                              backgroundColor: ann.whiteoutBg ? "#ffffff" : "transparent",
                            }}
                            className={`absolute pointer-events-auto p-1 rounded cursor-move transition-shadow ${
                              isSelected ? "ring-2 ring-teal-500 bg-teal-50/20" : ""
                            }`}
                          >
                            <input
                              type="text"
                              value={ann.text}
                              onChange={(e) => updateAnnotation(ann.id, { text: e.target.value })}
                              className="bg-transparent border-0 outline-none w-auto min-w-[60px]"
                              style={{ color: "inherit", font: "inherit" }}
                            />
                            {isSelected && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteAnnotation(ann.id)
                                }}
                                className="absolute -top-3 -right-3 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )
                      }

                      if (ann.type === "whiteout") {
                        return (
                          <div
                            key={ann.id}
                            onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)}
                            style={{
                              left: ann.x,
                              top: ann.y,
                              width: ann.width,
                              height: ann.height,
                              backgroundColor: ann.color || "#ffffff",
                            }}
                            className={`absolute pointer-events-auto cursor-move shadow-sm border border-gray-300 ${
                              isSelected ? "ring-2 ring-teal-500" : ""
                            }`}
                          >
                            {isSelected && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteAnnotation(ann.id)
                                  }}
                                  className="absolute -top-3 -right-3 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div
                                  onMouseDown={(e) => {
                                    e.stopPropagation()
                                    setResizingId(ann.id)
                                    setResizeStart({
                                      x: e.clientX,
                                      y: e.clientY,
                                      width: ann.width,
                                      height: ann.height,
                                    })
                                  }}
                                  className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-teal-600 cursor-nwse-resize rounded"
                                />
                              </>
                            )}
                          </div>
                        )
                      }

                      if (ann.type === "highlight") {
                        return (
                          <div
                            key={ann.id}
                            onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)}
                            style={{
                              left: ann.x,
                              top: ann.y,
                              width: ann.width,
                              height: ann.height,
                              backgroundColor: ann.color || "rgba(250, 204, 21, 0.45)",
                            }}
                            className={`absolute pointer-events-auto cursor-move rounded-sm ${
                              isSelected ? "ring-2 ring-teal-500" : ""
                            }`}
                          >
                            {isSelected && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteAnnotation(ann.id)
                                }}
                                className="absolute -top-3 -right-3 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )
                      }

                      if (ann.type === "shape") {
                        return (
                          <div
                            key={ann.id}
                            onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)}
                            style={{
                              left: ann.x,
                              top: ann.y,
                              width: ann.width,
                              height: ann.height,
                              borderColor: ann.strokeColor || "#0f766e",
                              backgroundColor: ann.fillColor || "transparent",
                              borderRadius: ann.shapeType === "circle" ? "9999px" : "4px",
                            }}
                            className={`absolute pointer-events-auto cursor-move border-2 ${
                              isSelected ? "ring-2 ring-teal-500" : ""
                            }`}
                          >
                            {isSelected && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteAnnotation(ann.id)
                                }}
                                className="absolute -top-3 -right-3 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )
                      }

                      if (ann.type === "stamp") {
                        return (
                          <div
                            key={ann.id}
                            onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)}
                            style={{
                              left: ann.x,
                              top: ann.y,
                              borderColor: ann.color || "#dc2626",
                              color: ann.color || "#dc2626",
                              transform: "rotate(-12deg)",
                            }}
                            className={`absolute pointer-events-auto cursor-move border-4 px-4 py-1.5 font-extrabold text-lg uppercase tracking-wider rounded-lg shadow-sm ${
                              isSelected ? "ring-2 ring-teal-500" : ""
                            }`}
                          >
                            <span>{ann.label}</span>
                            {isSelected && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteAnnotation(ann.id)
                                }}
                                className="absolute -top-3 -right-3 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )
                      }

                      if (ann.type === "signature" || ann.type === "image") {
                        return (
                          <div
                            key={ann.id}
                            onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)}
                            style={{
                              left: ann.x,
                              top: ann.y,
                              width: ann.width,
                              height: ann.height,
                            }}
                            className={`absolute pointer-events-auto cursor-move ${
                              isSelected ? "ring-2 ring-teal-500 p-0.5" : ""
                            }`}
                          >
                            <img src={ann.dataUrl} alt="Placed element" className="w-full h-full object-contain pointer-events-none" />
                            {isSelected && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteAnnotation(ann.id)
                                  }}
                                  className="absolute -top-3 -right-3 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div
                                  onMouseDown={(e) => {
                                    e.stopPropagation()
                                    setResizingId(ann.id)
                                    setResizeStart({
                                      x: e.clientX,
                                      y: e.clientY,
                                      width: ann.width,
                                      height: ann.height,
                                    })
                                  }}
                                  className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-teal-600 cursor-nwse-resize rounded"
                                />
                              </>
                            )}
                          </div>
                        )
                      }

                      return null
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Page Navigation Bar */}
            <footer className="bg-white border-t border-gray-200 px-6 py-2.5 flex items-center justify-between z-10 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPageIndex((p) => Math.max(0, p - 1))
                    setSelectedAnnotationId(null)
                  }}
                  disabled={currentPageIndex === 0}
                  className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-40 font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous Page</span>
                </button>
                <span className="font-bold text-gray-700">
                  Page {currentPageIndex + 1} of {pages.length}
                </span>
                <button
                  onClick={() => {
                    setCurrentPageIndex((p) => Math.min(pages.length - 1, p + 1))
                    setSelectedAnnotationId(null)
                  }}
                  disabled={currentPageIndex === pages.length - 1}
                  className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-40 font-semibold flex items-center gap-1"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRotatePage}
                  className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 font-semibold flex items-center gap-1 text-gray-700"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate 90°</span>
                </button>
                {pages.length > 1 && (
                  <button
                    onClick={handleDeleteCurrentPage}
                    className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Page</span>
                  </button>
                )}
              </div>
            </footer>
          </div>
        )}

        {/* Signature Pad Modal */}
        {isSignatureModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-teal-600" />
                  <span>Create Digital Signature</span>
                </h3>
                <button
                  onClick={() => setIsSignatureModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
                <button
                  onClick={() => setSigMode("draw")}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    sigMode === "draw" ? "bg-white text-teal-700 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Draw Signature
                </button>
                <button
                  onClick={() => setSigMode("type")}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    sigMode === "type" ? "bg-white text-teal-700 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Type Signature
                </button>
              </div>

              {sigMode === "draw" ? (
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-slate-50 mb-2 overflow-hidden">
                    <canvas
                      ref={sigCanvasRef}
                      width={450}
                      height={180}
                      onMouseDown={handleSigMouseDown}
                      onMouseMove={handleSigMouseMove}
                      onMouseUp={handleSigMouseUp}
                      className="w-full h-44 cursor-crosshair bg-white"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-6">
                    <span>Draw your signature above using your mouse or touchpad</span>
                    <button onClick={clearSigCanvas} className="text-red-600 font-semibold hover:underline">
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    value={typedSigText}
                    onChange={(e) => setTypedSigText(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl mb-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="p-6 bg-slate-50 border rounded-2xl text-center">
                    <span className="text-3xl text-blue-900" style={{ fontFamily: typedSigFont }}>
                      {typedSigText || "Your Signature"}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsSignatureModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdoptSignature}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-teal-500/25"
                >
                  Adopt & Place Signature
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Download Success Toast */}
        {exportSuccess && (
          <div className="fixed bottom-6 right-6 z-50 bg-green-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <Check className="w-5 h-5 text-green-400" />
            <div>
              <h4 className="font-bold text-sm">Download Complete!</h4>
              <p className="text-xs text-green-200">Your edited PDF has been saved successfully.</p>
            </div>
          </div>
        )}
      </main>

      {pages.length === 0 && <Footer />}
    </div>
  )
}
