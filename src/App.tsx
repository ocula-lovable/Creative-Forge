import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import { NotificationProvider } from './context/NotificationContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import VideoGenerator from './pages/VideoGenerator'
import ImageGenerator from './pages/ImageGenerator'
import AvatarStudio from './pages/AvatarStudio'
import AdGenerator from './pages/AdGenerator'
import ContentGenerator from './pages/ContentGenerator'
import VideoEditor from './pages/VideoEditor'
import Assets from './pages/Assets'
import Templates from './pages/Templates'
import History from './pages/History'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Pricing from './pages/Pricing'
import Documentation from './pages/Documentation'
import Support from './pages/Support'
import NotFound from './pages/NotFound'

// Layout
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Notifications from './components/common/Notifications'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/support" element={<Support />} />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/videos/generator" element={<VideoGenerator />} />
                      <Route path="/images/generator" element={<ImageGenerator />} />
                      <Route path="/avatars/studio" element={<AvatarStudio />} />
                      <Route path="/ads/generator" element={<AdGenerator />} />
                      <Route path="/content/generator" element={<ContentGenerator />} />
                      <Route path="/videos/editor" element={<VideoEditor />} />
                      <Route path="/assets" element={<Assets />} />
                      <Route path="/templates" element={<Templates />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/billing" element={<Billing />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedLayout>
                }
              />
            </Routes>

            <Notifications />
          </NotificationProvider>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  )
}

function ProtectedLayout({ children }:  { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default App