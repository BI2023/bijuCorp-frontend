import axios from "axios"

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
  if (!url.endsWith("/api") && !url.endsWith("/api/")) {
    url = `${url}/api`
  }
  return url
}

const API_BASE_URL = getBaseUrl()
console.log("Axios initialized with Base URL:", API_BASE_URL)

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthRequest = originalRequest.url.includes("/login") || originalRequest.url.includes("/register");
      if (isAuthRequest) {
        return Promise.reject(error);
      }
      originalRequest._retry = true


      try {
        const refreshToken = localStorage.getItem("refresh_token")
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem("access_token", access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        const djangoLoginUrl = import.meta.env.VITE_DJANGO_LOGIN_URL || "/login"
        window.location.href = djangoLoginUrl
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
