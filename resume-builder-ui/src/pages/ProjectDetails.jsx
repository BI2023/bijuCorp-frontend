import { useParams, useNavigate } from "react-router-dom"
import { PROJECTS_DATA } from "../data/projects"
import { ROUTES } from "../utils/constants"
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react"

export default function ProjectDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const project = PROJECTS_DATA.find((p) => p.id === id)

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-200 mb-4">Project Not Found</h2>
                    <button
                        onClick={() => navigate(ROUTES.PROJECTS)}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(ROUTES.PROJECTS)}
                    className="flex items-center text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
                </button>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                            {project.title}
                        </h1>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${project.status === "Concept" || project.status === "Idea"
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : project.status === "In Progress"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            }`}>
                            {project.status}
                        </span>
                    </div>

                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Overview & Features */}
                    <div className="space-y-8">
                        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-slate-200 mb-4">Overview</h2>
                            <p className="text-slate-400 leading-relaxed">
                                {project.details.overview}
                            </p>
                        </div>

                        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-slate-200 mb-4">Key Features</h2>
                            <ul className="space-y-3">
                                {project.details.features.map((feature, index) => (
                                    <li key={index} className="flex items-start text-slate-400">
                                        <CheckCircle2 className="w-5 h-5 text-teal-500 mr-3 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Tech Stack & Roadmap */}
                    <div className="space-y-8">
                        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-slate-200 mb-4">Tech Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.details.technicalStack.map((tech, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-slate-200 mb-4">Roadmap</h2>
                            <div className="space-y-6">
                                {project.details.roadmap.map((item, index) => (
                                    <div key={index} className="relative pl-6 border-l-2 border-slate-800 pb-2">
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${item.status === "Completed" ? "bg-teal-500 border-teal-500" :
                                                item.status === "In Progress" ? "bg-slate-900 border-blue-500" :
                                                    "bg-slate-900 border-slate-600"
                                            }`}></div>
                                        <div className="mb-2">
                                            <h3 className="text-slate-200 font-semibold">{item.stage}</h3>
                                            <span className={`text-xs ${item.status === "In Progress" ? "text-blue-400" : "text-slate-500"
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <ul className="space-y-1">
                                            {item.items.map((subItem, subIndex) => (
                                                <li key={subIndex} className="text-sm text-slate-400 flex items-center">
                                                    <Circle className="w-1.5 h-1.5 bg-slate-600 mr-2 rounded-full" />
                                                    {subItem}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
