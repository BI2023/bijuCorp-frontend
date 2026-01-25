"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { WalletProvider } from "./context/WalletContext"
import ProtectedRoute from "./routes/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/dashboard/Dashboard"
import ResumeBuilder from "./pages/dashboard/ResumeBuilder"
import MyResumes from "./pages/dashboard/MyResumes"
import Wallet from "./pages/dashboard/Wallet"
import Transactions from "./pages/dashboard/Transactions"
import StudyDocs from "./pages/StudyDocs"
import Projects from "./pages/Projects"
import { ROUTES } from "./utils/constants"

function App() {
  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.STUDY_DOCS} element={<StudyDocs />} />
            <Route path={ROUTES.PROJECTS} element={<Projects />} />

            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.RESUME_BUILDER}
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.MY_RESUMES}
              element={
                <ProtectedRoute>
                  <MyResumes />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.WALLET}
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TRANSACTIONS}
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </WalletProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
