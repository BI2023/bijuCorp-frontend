"use client"

const TechTemplate = ({ data }) => {
    return (
        <div className="flex font-mono text-gray-800 bg-white min-h-[297mm]">
            {/* Left Sidebar (Dark) */}
            <aside className="w-[30%] bg-slate-900 text-slate-300 p-6 flex flex-col">
                {/* Contact Info */}
                <div className="mb-8 text-xs space-y-3">
                    <h3 className="text-slate-500 font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">Contact</h3>
                    {data.personal.email && (
                        <div className="break-all">
                            <span className="block text-slate-500 mb-1">Email</span>
                            <span className="text-slate-100">{data.personal.email}</span>
                        </div>
                    )}
                    {data.personal.phone && (
                        <div>
                            <span className="block text-slate-500 mb-1">Phone</span>
                            <span className="text-slate-100">{data.personal.phone}</span>
                        </div>
                    )}
                    {data.personal.location && (
                        <div>
                            <span className="block text-slate-500 mb-1">Location</span>
                            <span className="text-slate-100">{data.personal.location}</span>
                        </div>
                    )}
                    {data.personal.linkedin && (
                        <div className="break-all">
                            <span className="block text-slate-500 mb-1">LinkedIn</span>
                            <a href={data.personal.linkedin.startsWith("www.") ? `https://${data.personal.linkedin}` : data.personal.linkedin} className="text-blue-400 hover:text-blue-300 transition-colors">
                                {data.personal.linkedin}
                            </a>
                        </div>
                    )}
                    {data.personal.website && (
                        <div className="break-all">
                            <span className="block text-slate-500 mb-1">Website</span>
                            <a href={data.personal.website.startsWith("www.") ? `https://${data.personal.website}` : data.personal.website} className="text-blue-400 hover:text-blue-300 transition-colors">
                                {data.personal.website}
                            </a>
                        </div>
                    )}
                </div>

                {/* Skills */}
                {data.skills.length > 0 && data.skills[0] !== "" && (
                    <div className="mb-8">
                        <h3 className="text-slate-500 font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.filter(s => s).map((skill, index) => (
                                <span key={index} className="text-xs bg-slate-800 text-teal-400 px-2 py-1 rounded border border-slate-700">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education (Sidebar) */}
                {data.education.length > 0 && (
                    <div>
                        <h3 className="text-slate-500 font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">Education</h3>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index} className="text-xs">
                                    <div className="font-bold text-slate-100">{edu.school}</div>
                                    <div className="text-slate-400 mb-1">{edu.degree}</div>
                                    {edu.graduationDate && <div className="text-slate-600 text-[10px]">{edu.graduationDate}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Header Name */}
                <header className="mb-8 border-b-2 border-teal-500 pb-4 inline-block w-full">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">
                        <span className="text-teal-600">{`const `}</span>
                        {data.personal.fullName || "Your Name"}
                        <span className="text-teal-600">;</span>
                    </h1>
                    {data.personal.title && (
                        <p className="text-lg text-slate-600 font-medium">
                            <span className="text-slate-400">{'// '}</span>
                            {data.personal.title}
                        </p>
                    )}
                </header>

                {/* Summary */}
                {data.summary.text && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <span className="text-teal-500 text-xl font-mono">{`{`}</span>
                            About
                            <span className="text-teal-500 text-xl font-mono">{`}`}</span>
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-700 border-l-2 border-slate-200 pl-4 py-1">
                            {data.summary.text}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="text-teal-500 text-xl font-mono">{`{`}</span>
                            Experience
                            <span className="text-teal-500 text-xl font-mono">{`}`}</span>
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-teal-500 before:rounded-full">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base text-slate-900">{exp.position}</h3>
                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold text-teal-700 mb-2">
                                        @ {exp.company} {exp.location && <span className="text-slate-400 font-normal">| {exp.location}</span>}
                                    </div>
                                    {exp.description && (
                                        <ul className="list-none text-sm space-y-1.5 text-gray-600">
                                            {exp.description
                                                .split("\n")
                                                .filter(line => line.trim())
                                                .map((line, idx) => (
                                                    <li key={idx} className="flex gap-2">
                                                        <span className="text-teal-400 select-none">{`>`}</span>
                                                        <span>{line}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="text-teal-500 text-xl font-mono">{`{`}</span>
                            Projects
                            <span className="text-teal-500 text-xl font-mono">{`}`}</span>
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {data.projects.map((project, index) => (
                                <div key={index} className="border border-slate-200 p-4 rounded bg-slate-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900">{project.name}</h3>
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-mono">
                                                [link]
                                            </a>
                                        )}
                                    </div>
                                    {project.technologies && (
                                        <div className="mb-2 text-xs font-mono text-teal-600">
                                            {`[`} {project.technologies} {`]`}
                                        </div>
                                    )}
                                    {project.description && (
                                        <p className="text-sm text-gray-700">
                                            {project.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </div>
    )
}

export default TechTemplate
