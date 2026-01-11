import axiosInstance from "./axiosInstance"

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register/", userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login/", credentials)
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access)
      localStorage.setItem("refresh_token", response.data.refresh)
    }
    return response.data
  },

  // Logout user
  logout: async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    try {
      await axiosInstance.post("/auth/logout/", { refresh: refreshToken })
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await axiosInstance.get("/auth/user/")
    return response.data
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axiosInstance.patch("/auth/user/", userData)
    return response.data
  },
}
