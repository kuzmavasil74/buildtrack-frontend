import { Suspense, lazy } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './App.css'

// Every page is its own chunk, so the first screen only downloads what it needs.
const Main = lazy(() => import('./pages/Main.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Records = lazy(() => import('./pages/Records.jsx'))
const Crews = lazy(() => import('./pages/Crews.jsx'))
const Sites = lazy(() => import('./pages/Sites.jsx'))
const Payroll = lazy(() => import('./pages/Payroll.jsx'))
const Receipts = lazy(() => import('./pages/Receipts.jsx'))
const Team = lazy(() => import('./pages/Team.jsx'))
const Admin = lazy(() => import('./pages/Admin.jsx'))
const Invite = lazy(() => import('./pages/Invite.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))

const protectedPage = (Page, access = {}) => (
  <ProtectedRoute {...access}>
    <Page />
  </ProtectedRoute>
)
const OWNER = { ownerOnly: true }

const PageLoading = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-500 text-sm">{t('common.loading')}</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/home" element={protectedPage(Home)} />
          <Route path="/dashboard" element={protectedPage(Dashboard)} />
          <Route path="/records" element={protectedPage(Records)} />
          <Route path="/crews" element={protectedPage(Crews, OWNER)} />
          <Route path="/sites" element={protectedPage(Sites, OWNER)} />
          <Route path="/payroll" element={protectedPage(Payroll, OWNER)} />
          <Route path="/receipts" element={protectedPage(Receipts)} />
          <Route path="/team" element={protectedPage(Team, OWNER)} />
          <Route path="/admin" element={protectedPage(Admin, { adminOnly: true })} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
