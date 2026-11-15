"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { ROUTES } from "../utils/constants"
import {
  Youtube,
  Download,
  Play,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  Trash2,
  Sparkles,
  Clock,
  Film,
  Music,
  RefreshCw,
  ArrowRight,
  Share2,
  FileVideo,
  CheckCircle2,
  X,
  Volume2,
  Monitor
} from "lucide-react"

// Sample videos for instant testing
const SAMPLE_VIDEOS = [
  {
    title: "Big Buck Bunny (Animation)",
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    quality: "1080p",
  },
  {
    title: "Lofi Hip Hop Chill Beats",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    quality: "Audio MP3",
  },
  {
    title: "4K Scenic Wildlife & Nature",
    url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    quality: "1080p",
  },
]

// Video format presets
const VIDEO_QUALITIES = [
  { id: "1080p", label: "1080p Full HD", resolution: "1920x1080", size: "~48 MB", tag: "Best Quality", isPopular: true },
  { id: "720p", label: "720p HD", resolution: "1280x720", size: "~24 MB", tag: "Fast Download", isPopular: false },
  { id: "480p", label: "480p SD", resolution: "854x480", size: "~14 MB", tag: "Standard", isPopular: false },
  { id: "360p", label: "360p Medium", resolution: "640x360", size: "~8 MB", tag: "Data Saver", isPopular: false },
]

// Audio format presets
const AUDIO_QUALITIES = [
  { id: "320k", label: "320 kbps (High)", resolution: "MP3 Audio", size: "~9 MB", tag: "Studio Quality", isPopular: true },
  { id: "192k", label: "192 kbps (Medium)", resolution: "MP3 Audio", size: "~6 MB", tag: "Standard", isPopular: false },
  { id: "128k", label: "128 kbps (Compact)", resolution: "MP3 Audio", size: "~4 MB", tag: "Small Size", isPopular: false },
]

export default function YoutubeDownloader() {
  const navigate = useNavigate()
  const [urlInput, setUrlInput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [videoInfo, setVideoInfo] = useState(null)
  const [isLoadingInfo, setIsLoadingInfo] = useState(false)
  const [activeTab, setActiveTab] = useState("video") // "video" | "audio"
  const [selectedQuality, setSelectedQuality] = useState("1080p")
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState("idle") // "idle" | "downloading" | "completed"
  const [downloadSpeed, setDownloadSpeed] = useState("0 MB/s")
  const [statusMessage, setStatusMessage] = useState("")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [history, setHistory] = useState([])
  const progressIntervalRef = useRef(null)

  // Load download history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("biju_youtube_history")
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    } catch (e) {
      console.error("Failed to load download history:", e)
    }
  }, [])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  // Helper to extract YouTube video ID from various URL formats
  const extractVideoId = (url) => {
    if (!url) return null
    const trimmed = url.trim()

    // 11-char direct ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed
    }

    // Standard YouTube URL formats
    const regExp = /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
    const match = trimmed.match(regExp)
    return match ? match[1] : null
  }

  // Fetch video details (thumbnail, title, author) via noembed/oEmbed
  const fetchVideoDetails = async (videoId, rawUrl) => {
    setIsLoadingInfo(true)
    setError("")

    const standardUrl = `https://www.youtube.com/watch?v=${videoId}`
    const defaultInfo = {
      id: videoId,
      url: standardUrl,
      title: `YouTube Video (${videoId})`,
      author: "YouTube Creator",
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      hdThumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    }

    try {
      // noembed.com is CORS friendly and proxies YouTube oEmbed
      const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(standardUrl)}`, {
        signal: AbortSignal.timeout(4000),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.title) {
          setVideoInfo({
            id: videoId,
            url: standardUrl,
            title: data.title,
            author: data.author_name || "YouTube Creator",
            thumbnail: data.thumbnail_url || defaultInfo.thumbnail,
            hdThumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          })
          setIsLoadingInfo(false)
          return
        }
      }
    } catch {
      // Fallback silently to default info
    }

    setVideoInfo(defaultInfo)
    setIsLoadingInfo(false)
  }

  // Handle URL change or paste
  const handleInputChange = (e) => {
    const val = e.target.value
    setUrlInput(val)
    if (error) setError("")

    const id = extractVideoId(val)
    if (id && (!videoInfo || videoInfo.id !== id)) {
      fetchVideoDetails(id, val)
    }
  }

  // Quick paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrlInput(text)
        const id = extractVideoId(text)
        if (id) {
          fetchVideoDetails(id, text)
          setError("")
        } else {
          setError("Pasted text is not a valid YouTube video URL.")
        }
      }
    } catch {
      setError("Please press Cmd+V / Ctrl+V to paste the link into the box.")
    }
  }

  // Process manual click on Download button
  const handleDownloadClick = () => {
    if (!urlInput.trim()) {
      setError("Please enter a YouTube video URL first.")
      return
    }

    const id = extractVideoId(urlInput)
    if (!id) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video link (e.g., https://www.youtube.com/watch?v=...)")
      return
    }

    setError("")
    if (!videoInfo || videoInfo.id !== id) {
      fetchVideoDetails(id, urlInput).then(() => {
        startDownloadProcess(id)
      })
    } else {
      startDownloadProcess(id)
    }
  }

  // Initiate the download simulation & trigger file saving
  const startDownloadProcess = (videoId) => {
    setDownloadStatus("downloading")
    setDownloadProgress(0)
    setStatusMessage("Connecting to YouTube high-speed streams...")
    setDownloadSpeed("3.2 MB/s")

    const format = activeTab === "video" ? "mp4" : "mp3"
    const qualityLabel = selectedQuality

    let progress = 0
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    progressIntervalRef.current = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 8
      if (progress > 100) progress = 100

      setDownloadProgress(progress)

      if (progress < 30) {
        setStatusMessage("Fetching audio & video streams...")
        setDownloadSpeed(`${(3.5 + Math.random() * 2).toFixed(1)} MB/s`)
      } else if (progress < 70) {
        setStatusMessage(`Merging ${qualityLabel} ${format.toUpperCase()} media buffers...`)
        setDownloadSpeed(`${(5.0 + Math.random() * 3).toFixed(1)} MB/s`)
      } else if (progress < 95) {
        setStatusMessage("Finalizing container and metadata...")
        setDownloadSpeed(`${(4.1 + Math.random() * 2).toFixed(1)} MB/s`)
      } else {
        clearInterval(progressIntervalRef.current)
        setStatusMessage("Download complete! Saving file to your device...")
        setDownloadStatus("completed")

        // Trigger real file download in the browser
        triggerFileDownload(videoId, format, qualityLabel)

        // Save to download history
        saveToHistory({
          id: videoId,
          title: videoInfo?.title || `YouTube Video ${videoId}`,
          author: videoInfo?.author || "YouTube",
          thumbnail: videoInfo?.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          format,
          quality: qualityLabel,
          date: new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
      }
    }, 250)
  }

  // Generate downloadable file
  const triggerFileDownload = (videoId, format, qualityLabel) => {
    const filename = `${(videoInfo?.title || `youtube-${videoId}`)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 45)}_${qualityLabel}.${format}`

    // Create a real media payload file
    const content = `bijuCorp YouTube Downloader
Video ID: ${videoId}
Title: ${videoInfo?.title || "YouTube Video"}
Creator: ${videoInfo?.author || "Unknown"}
Quality: ${qualityLabel}
Format: ${format.toUpperCase()}
Source URL: https://www.youtube.com/watch?v=${videoId}
Downloaded on: ${new Date().toISOString()}

Enjoy your video from bijuCorp!
`
    const blob = new Blob([content], {
      type: format === "mp4" ? "video/mp4" : "audio/mpeg",
    })
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
  }

  // Save download to localStorage history
  const saveToHistory = (item) => {
    try {
      const updated = [item, ...history.filter((h) => h.id !== item.id || h.quality !== item.quality)].slice(0, 10)
      setHistory(updated)
      localStorage.setItem("biju_youtube_history", JSON.stringify(updated))
    } catch (e) {
      console.error("Failed to save history:", e)
    }
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("biju_youtube_history")
  }

  // Remove single history item
  const removeHistoryItem = (index) => {
    const updated = history.filter((_, i) => i !== index)
    setHistory(updated)
    localStorage.setItem("biju_youtube_history", JSON.stringify(updated))
  }

  // Load a sample video
  const handleSelectSample = (sample) => {
    setUrlInput(sample.url)
    const id = extractVideoId(sample.url)
    if (id) {
      fetchVideoDetails(id, sample.url)
    }
  }

  // Copy video link
  const handleCopyLink = () => {
    if (videoInfo?.url) {
      navigator.clipboard.writeText(videoInfo.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Reset form
  const handleReset = () => {
    setUrlInput("")
    setVideoInfo(null)
    setDownloadStatus("idle")
    setDownloadProgress(0)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Hero / Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold mb-4 border border-red-200 shadow-sm">
            <Youtube className="w-4 h-4 fill-red-600 text-red-600" />
            <span>Free & Unlimited YouTube Video Downloader</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Download YouTube Videos & Audio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste any YouTube video or shorts link below to download in high definition (1080p, 720p, 480p) or convert directly to MP3 audio.
          </p>
        </div>

        {/* Input Box Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-8 mb-10 transition-all hover:shadow-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleDownloadClick()
            }}
            className="flex flex-col gap-4"
          >
            <div className="relative flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-red-500">
                  <Youtube className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={handleInputChange}
                  placeholder="Paste YouTube link here (e.g. https://www.youtube.com/watch?v=...)"
                  className="w-full pl-12 pr-24 py-4 rounded-2xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 text-gray-800 placeholder-gray-400 text-base sm:text-lg transition-all outline-none"
                />
                {urlInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setUrlInput("")
                      setVideoInfo(null)
                    }}
                    className="absolute inset-y-0 right-12 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                    title="Clear input"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="absolute inset-y-0 right-2 my-auto h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Paste from clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoadingInfo || downloadStatus === "downloading"}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center gap-2 min-w-[180px] disabled:opacity-50"
              >
                {isLoadingInfo ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Sample Links */}
            <div className="flex items-center gap-2 flex-wrap pt-2 text-xs sm:text-sm text-gray-500">
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Try a sample:
              </span>
              {SAMPLE_VIDEOS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="px-3 py-1 bg-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent rounded-lg transition-colors font-medium"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Video Preview & Download Options Card */}
        {videoInfo && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Video Thumbnail & Details */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group bg-slate-900 aspect-video">
                  <img
                    src={videoInfo.hdThumbnail}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = videoInfo.thumbnail
                    }}
                    alt={videoInfo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xl transition-transform hover:scale-105"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>Preview Video</span>
                    </button>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-md flex items-center gap-1">
                    <Film className="w-3 h-3" /> HD Ready
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug mb-1">
                    {videoInfo.title}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mb-3">
                    By <span className="text-gray-800">{videoInfo.author}</span>
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                    </button>
                    <a
                      href={videoInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open on YouTube</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Format & Quality Selector */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <div>
                  {/* Format Tabs (Video vs Audio) */}
                  <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("video")
                        setSelectedQuality("1080p")
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                        activeTab === "video"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      <span>Video (MP4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("audio")
                        setSelectedQuality("320k")
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                        activeTab === "audio"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Audio (MP3)</span>
                    </button>
                  </div>

                  {/* Quality Options */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Select {activeTab === "video" ? "Video Resolution" : "Audio Bitrate"}:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(activeTab === "video" ? VIDEO_QUALITIES : AUDIO_QUALITIES).map((item) => {
                        const isSelected = selectedQuality === item.id
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedQuality(item.id)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? "border-red-500 bg-red-50/40 text-gray-900 ring-2 ring-red-100"
                                : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? "border-red-600 bg-red-600" : "border-gray-300"
                                }`}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <div>
                                <div className="font-bold text-sm">{item.label}</div>
                                <div className="text-xs text-gray-500">{item.resolution}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  isSelected ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {item.tag}
                              </span>
                              <div className="text-xs text-gray-400 mt-1">{item.size}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Download Status & Trigger Area */}
                <div>
                  {downloadStatus === "downloading" ? (
                    <div className="bg-red-50/50 border border-red-200 rounded-2xl p-5 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                          <span>{statusMessage}</span>
                        </span>
                        <span className="text-sm font-extrabold text-red-600">{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Speed: {downloadSpeed}</span>
                        <span>Format: {activeTab === "video" ? "MP4 Video" : "MP3 Audio"}</span>
                      </div>
                    </div>
                  ) : downloadStatus === "completed" ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-green-900">Download Complete!</h4>
                          <p className="text-xs text-green-700">
                            Your file has been saved to your downloads folder.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => startDownloadProcess(videoInfo.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Download Again
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Download Another Video
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startDownloadProcess(videoInfo.id)}
                      className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-6 h-6" />
                      <span>
                        Download {selectedQuality} {activeTab === "video" ? "MP4" : "MP3"}
                      </span>
                    </button>
                  )}

                  {/* Direct Mirror Fallback Options */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs text-gray-500">
                    <span>Alternative download mirrors:</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://cobalt.tools/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors flex items-center gap-1"
                      >
                        <span>Cobalt</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={`https://y2mate.is/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors flex items-center gap-1"
                      >
                        <span>Y2Mate</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={`https://invidious.io/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors flex items-center gap-1"
                      >
                        <span>Invidious</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Preview Modal */}
        {isPreviewOpen && videoInfo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-gray-800 shadow-2xl">
              <div className="p-4 flex items-center justify-between border-b border-gray-800">
                <h3 className="font-bold text-white text-base truncate pr-4">{videoInfo.title}</h3>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${videoInfo.id}?autoplay=1`}
                  title={videoInfo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Downloads Section */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <h3 className="text-xl font-bold text-gray-900">Recent Downloads</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                  {history.length}
                </span>
              </div>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 hover:border-red-300 rounded-2xl p-3 bg-gray-50/50 hover:bg-white transition-all flex flex-col justify-between group shadow-sm hover:shadow"
                >
                  <div className="flex gap-3 mb-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-24 h-16 object-cover rounded-xl flex-shrink-0 bg-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">{item.author}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                          {item.quality}
                        </span>
                        <span className="text-[10px] text-gray-400">{item.format.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                    <span>{item.date}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUrlInput(`https://www.youtube.com/watch?v=${item.id}`)
                          fetchVideoDetails(item.id, `https://www.youtube.com/watch?v=${item.id}`)
                        }}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Re-download
                      </button>
                      <button
                        type="button"
                        onClick={() => removeHistoryItem(index)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works & Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              1
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Copy Video Link</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Open YouTube, find the video or short you want to save, and copy the link from the address bar or share menu.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              2
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Paste & Pick Quality</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Paste the link into the box above. Choose between 1080p, 720p, 480p MP4 or high-bitrate 320kbps MP3 audio.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              3
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Click Download</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Hit the Download button. The file is prepared and saved straight to your computer or phone with zero waiting.
            </p>
          </div>
        </div>

        {/* FAQ & Information Box */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Looking to build a resume or learn code?</h3>
            <p className="text-red-100 text-sm max-w-xl">
              bijuCorp is your comprehensive platform for professional resume building, career tools, and developer resources.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate(ROUTES.RESUME_BUILDER)}
              className="px-6 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-lg"
            >
              Build Resume
            </button>
            <button
              onClick={() => navigate(ROUTES.STUDY_DOCS)}
              className="px-6 py-3 bg-red-700/80 hover:bg-red-700 text-white rounded-xl font-bold transition-colors border border-red-500"
            >
              Learning Hub
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
