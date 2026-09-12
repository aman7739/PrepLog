import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useEffect, useState, lazy, Suspense } from 'react'
import { supabase } from './lib/supabase'

// Static imports — first pages users see (instant load)
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'

// Lazy imports — only loaded when user navigates there (saves DB connections)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'))
const SelectRoadmap = lazy(() => import('./pages/SelectRoadmap'))
const Platforms = lazy(() => import('./pages/Platforms'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Notes = lazy(() => import('./pages/Notes'))
const RoadmapDetail = lazy(() => import('./pages/RoadmapDetail'))
const RoadmapBuilder = lazy(() => import('./pages/RoadmapBuilder'))
const BrowseRoadmaps = lazy(() => import('./pages/BrowseRoadmaps'))
const Profile = lazy(() => import('./pages/Profile'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const ActivityFeed = lazy(() => import('./pages/ActivityFeed'))
const ChatMessenger = lazy(() => import('./pages/ChatMessenger'))

// Loading fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-screen bg-brand-black flex items-center justify-center">
    <div className="text-theme-textSec text-sm">Loading...</div>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-brand-black" />
  return user ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-brand-black" />
  return !user ? children : <Navigate to="/dashboard" />
}

const DashboardRoute = () => {
  const { user, loading } = useAuth()
  const [checking, setChecking] = useState(true)
  const [hasRoadmap, setHasRoadmap] = useState(null)

  useEffect(() => {
    const check = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('user_roadmaps')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
        if (error) {
          console.log('Connection error:', error.message)
          setHasRoadmap(true)
        } else {
          setHasRoadmap(data && data.length > 0)
        }
      } catch (err) {
        console.log('Fetch error:', err)
        setHasRoadmap(true)
      }
      setChecking(false)
    }
    if (user) check()
    else setChecking(false)
  }, [user])

  if (loading || checking) return <div className="min-h-screen bg-brand-black" />
  if (!user) return <Navigate to="/login" />
  
  // if (hasRoadmap === false) return <Navigate to="/select-roadmap" />

  return <Dashboard />
}

import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333'
          }
        }}
      />
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/update-password" element={<UpdatePassword />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/select-roadmap" element={<ProtectedRoute><SelectRoadmap /></ProtectedRoute>} />
          <Route path="/platforms" element={<ProtectedRoute><Platforms /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/roadmap/:id" element={<ProtectedRoute><RoadmapDetail /></ProtectedRoute>} />
          <Route path="/roadmap-builder" element={<ProtectedRoute><RoadmapBuilder /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowseRoadmaps /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><ActivityFeed /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatMessenger /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
      </Suspense>
    </>
  )
}

export default App
