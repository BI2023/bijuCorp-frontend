"use client"

const MinimalTemplate = ({ data }) => {
  return (
    <div className="p-12 text-gray-900 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-light mb-3 tracking-wide">{data.personal.fullName || "YOUR NAME"}</h1>
        {data.personal.title && (
          <p className="text-xl text-gray-600 mb-4 tracking-wider uppercase">{data.personal.title}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
          {data.personal.email && <span className="break-all">{data.personal.email}</span>}
          {data.personal.phone && (
            <>
              <span className="text-gray-400">|</span>
              <span>{data.personal.phone}</span>
            </>
          )}
          {data.personal.location && (
            <>
              <span className="text-gray-400">|</span>
              <span>{data.personal.location}</span>
            </>
          )}
          {data.personal.linkedin && (
            <>
              <span className="text-gray-400">|</span>
              <span className="break-all"><a href={data.personal.linkedin.startsWith("www.") ? `https://${data.personal.linkedin}` : data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.personal.linkedin}</a></span>
            </>
          )}
          {data.personal.website && (
            <>
              <span className="text-gray-400">|</span>
              <span className="break-all"><a href={data.personal.website.startsWith("www.") ? `https://${data.personal.website}` : data.personal.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.personal.website}</a></span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary.text && (
        <div className="mb-8">
          <div className="h-px bg-gray-300 mb-4"></div>
          <p className="text-sm leading-relaxed text-gray-700 break-words">{data.summary.text}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-gray-500 mb-4">EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-5">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-semibold text-base">{exp.position}</h3>
                <span className="text-xs text-gray-500">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {exp.company}
                {exp.location && ` • ${exp.location}`}
              </p>
              {exp.description && (
                <ul className="list-disc list-outside ml-4 text-sm leading-relaxed text-gray-700">
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
        <div className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-gray-500 mb-4">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-semibold text-base">{edu.school}</h3>
                {edu.graduationDate && <span className="text-xs text-gray-500">{edu.graduationDate}</span>}
              </div>
              <p className="text-sm text-gray-600">
                {edu.degree}
                {edu.field && ` in ${edu.field}`}
              </p>
              {edu.location && <p className="text-xs text-gray-500">{edu.location}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && data.skills[0] !== "" && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-gray-500 mb-4">SKILLS</h2>
          <p className="text-sm text-gray-700 break-words">{data.skills.filter((s) => s).join(" • ")}</p>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-gray-500 mb-4">PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-base">{project.name}</h3>
              {project.description && (
                <ul className="list-disc list-outside ml-4 text-sm leading-relaxed text-gray-700 mb-1">
                  {project.description
                    .split("\n")
                    .filter((line) => line.trim())
                    .map((line, idx) => (
                      <li key={idx} className="break-words pl-1">{line}</li>
                    ))}
                </ul>
              )}
              {project.technologies && <p className="text-xs text-gray-500 mb-1 break-words">{project.technologies}</p>}
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
  )
}

export default MinimalTemplate
