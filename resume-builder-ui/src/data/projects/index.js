// Auto-import all project files in the current directory
const projectFiles = import.meta.glob("./*.js", { eager: true })

export const PROJECTS_DATA = Object.entries(projectFiles)
    .filter(([path]) => !path.includes("index.js")) // Exclude self
    .map(([, module]) => module.default)
