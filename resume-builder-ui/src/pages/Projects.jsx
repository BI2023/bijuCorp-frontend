import { useNavigate } from "react-router-dom"
import { ROUTES } from "../utils/constants"
import { ArrowRight, Lightbulb } from "lucide-react"
import { PROJECTS_DATA } from "../data/projects"

export default function Projects() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                        My Projects
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        A collection of ideas, experiments, and fully realized applications.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROJECTS_DATA.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`${ROUTES.PROJECTS}/${project.id}`)}
                            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-teal-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-teal-500/10 flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === "Concept" || project.status === "Idea"
                                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        : project.status === "In Progress"
                                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                            : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                    }`}>
                                    {project.status}
                                </span>
                                {project.status === "Idea" && <Lightbulb className="w-5 h-5 text-yellow-400" />}
                            </div>

                            <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-teal-400 transition-colors">
                                {project.title}
                            </h3>

                            <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
                                {project.description}
                            </p>

                            <div className="mt-auto">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags.length > 3 && (
                                        <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs">
                                            +{project.tags.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center text-teal-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={() => navigate(ROUTES.HOME)}
                        className="px-8 py-3 bg-slate-900 border-2 border-slate-700 text-slate-300 rounded-xl hover:shadow-lg hover:border-teal-500 hover:text-white transition-all font-semibold"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}
