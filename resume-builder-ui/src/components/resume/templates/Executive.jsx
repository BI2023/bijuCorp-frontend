"use client"

const ExecutiveTemplate = ({ data }) => {
    return (
        <div className="font-serif text-gray-800 bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm]">
            {/* Header */}
            <header className="border-b-2 border-slate-800 pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2 uppercase tracking-wider">
                    {data.personal.fullName || "Your Name"}
                </h1>
                {data.personal.title && (
                    <p className="text-xl text-slate-600 font-medium mb-4">{data.personal.title}</p>
                )}

                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                    {data.personal.email && (
                        <span className="flex items-center gap-1">
                            <span>{data.personal.email}</span>
                        </span>
                    )}
                    {data.personal.phone && (
                        <>
                            <span className="text-slate-300">•</span>
                            <span>{data.personal.phone}</span>
                        </>
                    )}
                    {data.personal.location && (
                        <>
                            <span className="text-slate-300">•</span>
                            <span>{data.personal.location}</span>
                        </>
                    )}
                    {data.personal.linkedin && (
                        <>
                            <span className="text-slate-300">•</span>
                            <a
                                href={data.personal.linkedin.startsWith("www.") ? `https://${data.personal.linkedin}` : data.personal.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-slate-900"
                            >
                                LinkedIn
                            </a>
                        </>
                    )}
                    {data.personal.website && (
                        <>
                            <span className="text-slate-300">•</span>
                            <a
                                href={data.personal.website.startsWith("www.") ? `https://${data.personal.website}` : data.personal.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-slate-900"
                            >
                                Portfolio
                            </a>
                        </>
                    )}
                </div>
            </header>

            {/* Summary */}
            {data.summary.text && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-7 text-gray-700 text-justify">
                        {data.summary.text}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                        Professional Experience
                    </h2>
                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-lg text-slate-800">{exp.position}</h3>
                                    <span className="text-sm text-slate-500 font-medium">
                                        {exp.startDate} – {exp.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-base font-semibold text-slate-700 italic">
                                        {exp.company}
                                    </span>
                                    {exp.location && <span className="text-sm text-slate-500">{exp.location}</span>}
                                </div>
                                {exp.description && (
                                    <ul className="list-disc list-outside ml-4 text-sm leading-6 text-gray-700 space-y-1">
                                        {exp.description
                                            .split("\n")
                                            .filter(line => line.trim())
                                            .map((line, idx) => (
                                                <li key={idx} className="pl-1">{line}</li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Two Column Layout for Skills & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills */}
                {data.skills.length > 0 && data.skills[0] !== "" && (
                    <section>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                            Core Competencies
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.filter(s => s).map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-slate-100 text-slate-700 px-3 py-1 text-sm font-medium border border-slate-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <h3 className="font-bold text-slate-800 text-sm">{edu.school}</h3>
                                    <p className="text-sm text-gray-700">
                                        {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                                    </p>
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>{edu.location}</span>
                                        <span>{edu.graduationDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Projects (Full Width if exists) */}
            {data.projects.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                        Key Projects
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {data.projects.map((project, index) => (
                            <div key={index} className="bg-slate-50 p-4 border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800">{project.name}</h3>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 text-xs hover:underline">
                                            View Project
                                        </a>
                                    )}
                                </div>
                                {project.technologies && (
                                    <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                                        {project.technologies}
                                    </p>
                                )}
                                {project.description && (
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default ExecutiveTemplate
