"use client"

import { useState } from "react"
import Input from "../common/Input"
import Button from "../common/Button"
import DatePicker from "../common/DatePicker"
import PhoneInput from "../common/PhoneInput"

const ResumeForm = ({ resumeData, onUpdate }) => {
  const [activeSection, setActiveSection] = useState("personal")

  const handleChange = (section, field, value) => {
    onUpdate({
      ...resumeData,
      [section]: {
        ...resumeData[section],
        [field]: value,
      },
    })
  }

  const handleArrayChange = (section, index, field, value) => {
    const newArray = [...resumeData[section]]
    newArray[index] = { ...newArray[index], [field]: value }
    onUpdate({ ...resumeData, [section]: newArray })
  }

  const addArrayItem = (section, template) => {
    onUpdate({
      ...resumeData,
      [section]: [...resumeData[section], template],
    })
  }

  const removeArrayItem = (section, index) => {
    const newArray = resumeData[section].filter((_, i) => i !== index)
    onUpdate({ ...resumeData, [section]: newArray })
  }

  const sections = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "summary", label: "Summary", icon: "📝" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "🚀" },
  ]

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Section Tabs */}
      <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Personal Info */}
        {activeSection === "personal" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Personal Information</h2>
            <Input
              label="Full Name"
              value={resumeData.personal.fullName}
              onChange={(e) => handleChange("personal", "fullName", e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Professional Title"
              value={resumeData.personal.title || ""}
              onChange={(e) => handleChange("personal", "title", e.target.value)}
              placeholder="Software Engineer"
            />
            <Input
              label="Email"
              type="email"
              value={resumeData.personal.email}
              onChange={(e) => handleChange("personal", "email", e.target.value)}
              placeholder="john@example.com"
            />
            <PhoneInput
              label="Phone"
              value={resumeData.personal.phone}
              onChange={(e) => handleChange("personal", "phone", e.target.value)}
              placeholder="123-456-7890"
            />
            <Input
              label="Location"
              value={resumeData.personal.location}
              onChange={(e) => handleChange("personal", "location", e.target.value)}
              placeholder="San Francisco, CA"
            />
            <Input
              label="LinkedIn"
              value={resumeData.personal.linkedin}
              onChange={(e) => handleChange("personal", "linkedin", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
            <Input
              label="Website"
              value={resumeData.personal.website}
              onChange={(e) => handleChange("personal", "website", e.target.value)}
              placeholder="johndoe.com"
            />
          </div>
        )}

        {/* Summary */}
        {activeSection === "summary" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Professional Summary</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Summary</label>
              <textarea
                value={resumeData.summary.text}
                onChange={(e) => handleChange("summary", "text", e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Write a brief summary of your professional background..."
              />
            </div>
          </div>
        )}

        {/* Experience */}
        {activeSection === "experience" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Work Experience</h2>
              <Button
                size="sm"
                onClick={() =>
                  addArrayItem("experience", {
                    company: "",
                    position: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
              >
                Add Experience
              </Button>
            </div>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Experience {index + 1}</h3>
                  <Button variant="destructive" size="sm" onClick={() => removeArrayItem("experience", index)}>
                    Remove
                  </Button>
                </div>
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                  placeholder="Company Name"
                />
                <Input
                  label="Position"
                  value={exp.position}
                  onChange={(e) => handleArrayChange("experience", index, "position", e.target.value)}
                  placeholder="Job Title"
                />
                <Input
                  label="Location"
                  value={exp.location}
                  onChange={(e) => handleArrayChange("experience", index, "location", e.target.value)}
                  placeholder="City, State"
                />
                <div className="grid grid-cols-2 gap-3">
                  <DatePicker
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(e) => handleArrayChange("experience", index, "startDate", e.target.value)}
                    placeholder="Select start date"
                  />
                  <DatePicker
                    label="End Date"
                    value={exp.endDate}
                    onChange={(e) => handleArrayChange("experience", index, "endDate", e.target.value)}
                    placeholder="Select end date"
                    showCurrentOption={true}
                    currentLabel="Currently Working"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                    <span className="text-xs text-muted-foreground ml-2">
                      (Use bullet points: start each line with •)
                    </span>
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="• Developed and maintained web applications&#10;• Collaborated with cross-functional teams&#10;• Improved system performance by 40%"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {activeSection === "education" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Education</h2>
              <Button
                size="sm"
                onClick={() =>
                  addArrayItem("education", {
                    school: "",
                    degree: "",
                    field: "",
                    location: "",
                    startDate: "",
                    graduationDate: "",
                  })
                }
              >
                Add Education
              </Button>
            </div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Education {index + 1}</h3>
                  <Button variant="destructive" size="sm" onClick={() => removeArrayItem("education", index)}>
                    Remove
                  </Button>
                </div>
                <Input
                  label="School"
                  value={edu.school}
                  onChange={(e) => handleArrayChange("education", index, "school", e.target.value)}
                  placeholder="University Name"
                />
                <Input
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)}
                  placeholder="Bachelor of Science"
                />
                <Input
                  label="Field of Study"
                  value={edu.field}
                  onChange={(e) => handleArrayChange("education", index, "field", e.target.value)}
                  placeholder="Computer Science"
                />
                <Input
                  label="Location"
                  value={edu.location}
                  onChange={(e) => handleArrayChange("education", index, "location", e.target.value)}
                  placeholder="City, State"
                />
                <div className="grid grid-cols-2 gap-3">
                  <DatePicker
                    label="Start Date"
                    value={edu.startDate || ""}
                    onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)}
                    placeholder="Select start date"
                  />
                  <DatePicker
                    label="Graduation Date"
                    value={edu.graduationDate}
                    onChange={(e) => handleArrayChange("education", index, "graduationDate", e.target.value)}
                    placeholder="Select graduation date"
                    showCurrentOption={true}
                    currentLabel="Currently Studying"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeSection === "skills" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Skills</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Skills (comma separated)</label>
              <textarea
                value={resumeData.skills.join(", ")}
                onChange={(e) =>
                  onUpdate({
                    ...resumeData,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="JavaScript, React, Node.js, Python, SQL..."
              />
            </div>
          </div>
        )}

        {/* Projects */}
        {activeSection === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Projects</h2>
              <Button
                size="sm"
                onClick={() =>
                  addArrayItem("projects", {
                    name: "",
                    description: "",
                    technologies: "",
                    link: "",
                  })
                }
              >
                Add Project
              </Button>
            </div>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Project {index + 1}</h3>
                  <Button variant="destructive" size="sm" onClick={() => removeArrayItem("projects", index)}>
                    Remove
                  </Button>
                </div>
                <Input
                  label="Project Name"
                  value={project.name}
                  onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)}
                  placeholder="My Awesome Project"
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                    <span className="text-xs text-muted-foreground ml-2">
                      (Use bullet points: start each line with •)
                    </span>
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="• Built a full-stack web application&#10;• Implemented user authentication&#10;• Deployed on AWS"
                  />
                </div>
                <Input
                  label="Technologies"
                  value={project.technologies}
                  onChange={(e) => handleArrayChange("projects", index, "technologies", e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                />
                <Input
                  label="Link"
                  value={project.link}
                  onChange={(e) => handleArrayChange("projects", index, "link", e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeForm
