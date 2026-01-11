import axiosInstance from "./axiosInstance"

export const resumeAPI = {
  // Get all resumes
  getResumes: async () => {
    const response = await axiosInstance.get("/resumes/")
    return response.data
  },

  // Get single resume
  getResume: async (resumeId) => {
    const response = await axiosInstance.get(`/resumes/${resumeId}/`)
    return response.data
  },

  // Create new resume
  createResume: async (resumeData) => {
    const response = await axiosInstance.post("/resumes/", resumeData)
    return response.data
  },

  // Update resume
  updateResume: async (resumeId, resumeData) => {
    const response = await axiosInstance.put(`/resumes/${resumeId}/`, resumeData)
    return response.data
  },

  // Delete resume
  deleteResume: async (resumeId) => {
    const response = await axiosInstance.delete(`/resumes/${resumeId}/`)
    return response.data
  },

  // Generate PDF
  generatePDF: async (resumeId) => {
    const response = await axiosInstance.post(
      `/resumes/${resumeId}/generate-pdf/`,
      {},
      {
        responseType: "blob",
      },
    )
    return response.data
  },

  // Get templates
  getTemplates: async () => {
    const response = await axiosInstance.get("/resumes/templates/")
    return response.data
  },
}
