"use client"

const ModernTemplate = ({ data }) => {
  return (
    <div className="flex font-sans text-gray-900">
      {/* Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{data.personal.fullName || "Your Name"}</h1>
          {data.personal.title && <p className="text-lg font-medium opacity-90 mb-2">{data.personal.title}</p>}
          <div className="w-12 h-1 bg-white mb-4"></div>
          <div className="space-y-2 text-sm">
            {data.personal.email && <p className="break-all">{data.personal.email}</p>}
            {data.personal.phone && <p>{data.personal.phone}</p>}
            {data.personal.location && <p>{data.personal.location}</p>}
            {data.personal.linkedin && <p className="break-all"><a href={data.personal.linkedin.startsWith("www.") ? `https://${data.personal.linkedin}` : data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline font-medium">{data.personal.linkedin}</a></p>}
            {data.personal.website && <p className="break-all"><a href={data.personal.website.startsWith("www.") ? `https://${data.personal.website}` : data.personal.website} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline font-medium">{data.personal.website}</a></p>}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && data.skills[0] !== "" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">SKILLS</h2>
            <div className="space-y-2 text-sm">
              {data.skills
                .filter((s) => s)
                .map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>{skill}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 min-w-0">
        {/* Summary */}
        {data.summary.text && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3 text-blue-700">PROFILE</h2>
            <p className="text-sm leading-relaxed break-words">{data.summary.text}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">EXPERIENCE</h2>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4 pl-4 border-l-2 border-blue-300">
                <h3 className="font-bold text-base text-blue-900">{exp.position}</h3>
                <p className="text-sm font-semibold text-gray-700">
                  {exp.company}
                  {exp.location && ` • ${exp.location}`}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {exp.startDate} - {exp.endDate}
                </p>
                {exp.description && (
                  <ul className="list-disc list-outside ml-4 text-sm leading-relaxed">
                    {exp.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, idx) => (
                        <li key={idx} className="break-words pl-1">{line}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">EDUCATION</h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3 pl-4 border-l-2 border-blue-300">
                <h3 className="font-bold text-base text-blue-900">{edu.school}</h3>
                <p className="text-sm text-gray-700">
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </p>
                {edu.location && <p className="text-xs text-gray-500">{edu.location}</p>}
                {edu.graduationDate && <p className="text-xs text-gray-500">{edu.graduationDate}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">PROJECTS</h2>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3 pl-4 border-l-2 border-blue-300">
                <h3 className="font-bold text-base text-blue-900">{project.name}</h3>
                {project.description && (
                  <ul className="list-disc list-outside ml-4 text-sm leading-relaxed mb-1">
                    {project.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, idx) => (
                        <li key={idx} className="break-words pl-1">{line}</li>
                      ))}
                  </ul>
                )}
                {project.technologies && <p className="text-xs text-gray-600 mb-1 break-words">Tech: {project.technologies}</p>}
                {project.link && (
                  <p className="text-xs text-blue-600 break-all">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModernTemplate
