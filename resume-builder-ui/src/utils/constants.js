export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register/",
    LOGIN: "/auth/login/",
    LOGOUT: "/auth/logout/",
    USER: "/auth/user/",
  },
  WALLET: {
    BALANCE: "/wallet/balance/",
    ADD_MONEY: "/wallet/add-money/",
    TRANSACTIONS: "/wallet/transactions/",
  },
  RESUME: {
    LIST: "/resumes/",
    TEMPLATES: "/resumes/templates/",
  },
}

export const RESUME_TEMPLATES = {
  CLASSIC: "classic",
  MODERN: "modern",
  MINIMAL: "minimal",
  PROFESSIONAL: "professional",
}

export const PDF_GENERATION_COST = 10 // Cost in credits

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  RESUME_BUILDER: "/dashboard/resume-builder",
  MY_RESUMES: "/dashboard/my-resumes",
  WALLET: "/dashboard/wallet",
  TRANSACTIONS: "/dashboard/transactions",
  STUDY_DOCS: "/study-docs",
  PROJECTS: "/projects",
}
