const ProfessionalTemplate = ({ data }) => {
  return (
    <div className="p-8 text-gray-900 font-sans bg-white max-w-[850px] mx-auto">
      {/* Header - Name on left, contact on right */}
      <div className="flex items-start justify-between border-b-2 border-black pb-2 mb-6">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight leading-tight">
            {data.personal.fullName || "BHUPENDRAKUMAR SINGH"}
          </h1>
          {data.personal.title && (
            <p className="text-sm font-semibold uppercase tracking-widest mt-1">{data.personal.title}</p>
          )}
        </div>
        <div className="text-right text-xs leading-relaxed">
          {data.personal.email && <div className="break-all">{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.location && <div>{data.personal.location}</div>}
          {data.personal.linkedin && <div className="break-all"><a href={data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.personal.linkedin}</a></div>}
          {data.personal.website && <div className="break-all"><a href={data.personal.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.personal.website}</a></div>}
        </div>
      </div>

      {/* Personal Summary */}
      {data.summary.text && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase mb-2 bg-gray-200 px-2 py-1">PERSONAL SUMMARY</h2>
          <p className="text-xs leading-relaxed text-justify break-words">{data.summary.text}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && data.skills[0] !== "" && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase mb-2 bg-gray-200 px-2 py-1">SKILLS</h2>
          <div className="space-y-1.5">
            {data.skills
              .filter((s) => s)
              .map((skill, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <span className="mt-0.5">●</span>
                  <span>{skill}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase mb-2 bg-gray-200 px-2 py-1">EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-bold text-sm">
                  {exp.position}, {exp.company}
                  {exp.location && <span className="font-normal text-gray-600"> • {exp.location}</span>}
                </h3>
                <p className="text-xs whitespace-nowrap ml-4">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              {exp.description && (
                <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                  {exp.description
                    .split("\n")
                    .filter((line) => line.trim())
                    .map((line, idx) => (
                      <li key={idx} className="text-xs leading-relaxed break-words pl-1">{line.trim()}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase mb-2 bg-gray-200 px-2 py-1">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-bold text-sm">
                {edu.degree}
                {edu.field && `, ${edu.field}`}
              </h3>
              <div className="flex justify-between items-center text-xs">
                <span>{edu.school}{edu.location && `, ${edu.location}`}</span>
                <span className="text-gray-600">{edu.startDate && `${edu.startDate} - `}{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications (if available in skills or projects) */}
      {data.projects.length > 0 && (
        <>
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase mb-2 bg-gray-200 px-2 py-1">PROJECTS</h2>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-sm">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                      Link
                    </a>
                  )}
                </div>
                {project.technologies && (
                  <p className="text-xs mb-1 break-words">
                    <span className="font-semibold">Tech Stack:</span> {project.technologies}
                  </p>
                )}
                {project.description && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                    {project.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, idx) => (
                        <li key={idx} className="text-xs leading-relaxed break-words pl-1">{line.trim()}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ProfessionalTemplate
