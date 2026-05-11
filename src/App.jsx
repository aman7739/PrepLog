import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import AdminDashboard from './pages/AdminDashboard'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import SelectRoadmap from './pages/SelectRoadmap'
import Platforms from './pages/Platforms'
import Tasks from './pages/Tasks'
import Notes from './pages/Notes'
import RoadmapDetail from './pages/RoadmapDetail'
import RoadmapBuilder from './pages/RoadmapBuilder'
import BrowseRoadmaps from './pages/BrowseRoadmaps'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import ActivityFeed from './pages/ActivityFeed'
// Day 11 Import
import ChatMessenger from './pages/ChatMessenger' 

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#0a0e1a]" />
  return user ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#0a0e1a]" />
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

  if (loading || checking) return <div className="min-h-screen bg-[#0a0e1a]" />
  if (!user) return <Navigate to="/login" />
  if (hasRoadmap === false) return <Navigate to="/select-roadmap" />
  return <Dashboard />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
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
      
      {/* Day 11 - Real-time Chat Route */}
      <Route path="/chat" element={<ProtectedRoute><ChatMessenger /></ProtectedRoute>} />

      {/* Day 13 - Admin Dashboard Route */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  )
}

export default App