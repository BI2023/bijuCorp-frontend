"use client"

const ClassicTemplate = ({ data }) => {
  return (
    <div className="p-12 text-gray-900 font-serif">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold mb-2">{data.personal.fullName || "Your Name"}</h1>
        {data.personal.title && <p className="text-xl text-gray-700 mb-2">{data.personal.title}</p>}
        <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
          {data.personal.email && <span className="break-all">{data.personal.email}</span>}
          {data.personal.phone && <span>•</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>•</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
        {(data.personal.linkedin || data.personal.website) && (
          <div className="flex items-center justify-center gap-3 text-sm mt-1">
            {data.personal.linkedin && <span className="break-all">{data.personal.linkedin}</span>}
            {data.personal.website && <span>•</span>}
            {data.personal.website && <span className="break-all">{data.personal.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary.text && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-800">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed break-words">{data.summary.text}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-800">EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-bold text-base">{exp.position}</h3>
                  <p className="text-sm italic">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
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
          <h2 className="text-xl font-bold mb-3 text-gray-800">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base">{edu.school}</h3>
                  <p className="text-sm">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                  {edu.location && <p className="text-sm italic">{edu.location}</p>}
                </div>
                {edu.graduationDate && <p className="text-sm text-gray-600">{edu.graduationDate}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && data.skills[0] !== "" && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-800">SKILLS</h2>
          <p className="text-sm break-words">{data.skills.filter((s) => s).join(" • ")}</p>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-gray-800">PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-base">{project.name}</h3>
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
              {project.technologies && (
                <p className="text-sm italic text-gray-600 break-words">Technologies: {project.technologies}</p>
              )}
              {project.link && (
                <p className="text-sm text-blue-600 break-all">
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

export default ClassicTemplate
