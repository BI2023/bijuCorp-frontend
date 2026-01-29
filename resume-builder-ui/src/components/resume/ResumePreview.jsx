"use client"

import ClassicTemplate from "./templates/Classic"
import ModernTemplate from "./templates/Modern"
import MinimalTemplate from "./templates/Minimal"
import ProfessionalTemplate from "./templates/Professional"
import ExecutiveTemplate from "./templates/Executive"
import TechTemplate from "./templates/Tech"

const ResumePreview = ({ resumeData, template = "classic" }) => {
  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    executive: ExecutiveTemplate,
    tech: TechTemplate,
  }

  const TemplateComponent = templates[template] || ClassicTemplate

  return (
    <div className="h-full bg-muted p-6 overflow-y-auto">
      <div className="max-w-[800px] mx-auto bg-white shadow-lg">
        <TemplateComponent data={resumeData} />
      </div>
    </div>
  )
}

export default ResumePreview
