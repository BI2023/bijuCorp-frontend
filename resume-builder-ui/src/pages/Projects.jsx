import { useNavigate } from "react-router-dom"
import { ROUTES } from "../utils/constants"
import { Briefcase, Layers, Rocket, FolderKanban } from "lucide-react"

export default function Projects() {
    const navigate = useNavigate()

    const features = [
        {
            icon: <Briefcase className="w-6 h-6 text-teal-500" />,
            title: "Project Overview",
            description: "Detailed insights into the goals and scope of each project.",
        },
        {
            icon: <Layers className="w-6 h-6 text-purple-500" />,
            title: "Status Tracking",
            description: "Live updates on project status: Planned, In Progress, or Completed.",
        },
        {
            icon: <Rocket className="w-6 h-6 text-orange-500" />,
            title: "Updates & Details",
            description: "Stay informed with the latest progress and feature releases.",
        },
        {
            icon: <FolderKanban className="w-6 h-6 text-blue-500" />,
            title: "Curated Showcase",
            description: "A collection of my best work and upcoming experiments.",
        },
    ]

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-2 bg-slate-800 text-teal-400 rounded-full text-sm font-semibold mb-6 border border-slate-700">
                            Coming Soon 🚀
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                            Projects
                        </h1>

                        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                            I’m currently planning and curating projects. This section will be updated soon.
                        </p>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-sm hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-900 rounded-xl shadow-sm border border-slate-700">{feature.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-slate-200 mb-1">{feature.title}</h3>
                                            <p className="text-slate-400 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate(ROUTES.HOME)}
                            className="px-8 py-3 bg-slate-900 border-2 border-slate-700 text-slate-300 rounded-xl hover:shadow-lg hover:border-teal-500 hover:text-white transition-all font-semibold"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
