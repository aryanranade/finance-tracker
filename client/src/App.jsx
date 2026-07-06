import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import AnimatedPage from './components/ui/AnimatedPage'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetsPage from './pages/BudgetsPage'
import InsightsPage from './pages/InsightsPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="aurora-bg" />
      <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppLayout({ children }) {
  const location = useLocation()
  return (
    <div className="flex min-h-screen">
      <div className="aurora-bg" />
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <AnimatedPage key={location.pathname} className="p-6 md:p-8">
          {children}
        </AnimatedPage>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Toaster
            position="top-right"
            theme="dark"
            richColors
            toastOptions={{
              style: {
                background: 'rgba(26, 26, 62, 0.95)',
                border: '1px solid #3d3d7e',
                backdropFilter: 'blur(12px)',
                color: '#f1f5f9',
              },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute><LoginPage /></PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute><RegisterPage /></PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <AppLayout><DashboardPage /></AppLayout>
              </PrivateRoute>
            } />
            <Route path="/transactions" element={
              <PrivateRoute>
                <AppLayout><TransactionsPage /></AppLayout>
              </PrivateRoute>
            } />
            <Route path="/budgets" element={
              <PrivateRoute>
                <AppLayout><BudgetsPage /></AppLayout>
              </PrivateRoute>
            } />
            <Route path="/insights" element={
              <PrivateRoute>
                <AppLayout><InsightsPage /></AppLayout>
              </PrivateRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
