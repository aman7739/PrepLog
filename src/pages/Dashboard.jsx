import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { seedDefaultRoadmaps } from '../data/seedRoadmaps'
import { useRoadmaps } from '../hooks/useRoadmaps'
import { useStats } from '../hooks/useStats'
import StatsBar from '../components/dashboard/StatsBar'
import MyRoadmaps from '../components/dashboard/MyRoadmaps'
import Heatmap from '../components/dashboard/Heatmap'
import TodayPlan from '../components/dashboard/TodayPlan'
import CommunityStats from '../components/CommunityStats'
import SuggestedConnections from '../components/SuggestedConnections'

function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  // 🔒 SECURITY LAYER 1: Email Whitelist for Admin Button
  // Add any other emails here that should see the Admin button
  const ALLOWED_ADMIN_EMAILS = ['aman985284@gmail.com']; 
  const isUserAdmin = ALLOWED_ADMIN_EMAILS.includes(user?.email);

  const [seeding, setSeeding] = useState(false)
  const [seedDone, setSeedDone] = useState(false)

  const { roadmaps, loading: roadmapsLoading } = useRoadmaps()
  const { heatmapCounts, streak, topicsDone, tasksDone, tasks } = useStats()

  const dayOnRoadmap = useMemo(() => {
    const earliest = roadmaps
      .map(r => r.started_at ? new Date(r.started_at) : null)
      .filter(Boolean)
      .sort((a, b) => a - b)[0]
    return earliest
      ? Math.floor((Date.now() - earliest) / 86400000) + 1
      : 1
  }, [roadmaps])

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase
        .from('roadmap_templates')
        .select('id')
        .eq('is_default', true)
        .limit(1)
      if (data && data.length > 0) setSeedDone(true)
    }
    if (profile?.role === 'admin') check()
  }, [profile])

  const handleSeed = async () => {
    setSeeding(true)
    await seedDefaultRoadmaps()
    setSeeding(false)
    setSeedDone(true)
  }

  const userName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'Coder'

  const userInitial = (user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-[#0a0e1a]">

      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-[#0a0e1a]/95 backdrop-blur border-b border-[#1e2d45] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Prep<span className="text-[#00d4ff]">Log</span>
          </h1>
          <div className="flex items-center gap-3">
            {/* Platforms Link */}
            <button
              onClick={() => navigate('/platforms')}
              className="hidden sm:flex items-center gap-1.5 border border-[#1e2d45] text-gray-400 px-3 py-2 rounded-lg text-sm hover:border-[#00d4ff]/40 hover:text-[#00d4ff] transition-all"
            >
              🔗 Platforms
            </button>

            {/* Tasks Link */}
            <button
              onClick={() => navigate('/tasks')}
              className="hidden sm:flex items-center gap-1.5 border border-[#1e2d45] text-gray-400 px-3 py-2 rounded-lg text-sm hover:border-[#00d4ff]/40 hover:text-[#00d4ff] transition-all"
            >
              📝 Tasks
            </button>

            {/* Notes Link */}
            <button
              onClick={() => navigate('/notes')}
              className="hidden sm:flex items-center gap-1.5 border border-[#1e2d45] text-gray-400 px-3 py-2 rounded-lg text-sm hover:border-[#00d4ff]/40 hover:text-[#00d4ff] transition-all"
            >
              💡 Notes
            </button>

            {/* Browse Link */}
            <button
              onClick={() => navigate('/browse')}
              className="hidden sm:flex items-center gap-1.5 border border-[#1e2d45] text-gray-400 px-3 py-2 rounded-lg text-sm hover:border-[#00d4ff]/40 hover:text-[#00d4ff] transition-all"
            >
              🌍 Browse
            </button>

            {/* Leaderboard Link */}
            <button
              onClick={() => navigate('/leaderboard')}
              className="hidden sm:flex items-center gap-1.5 border border-[#1e2d45] text-gray-400 px-3 py-2 rounded-lg text-sm hover:border-[#00d4ff]/40 hover:text-[#00d4ff] transition-all"
            >
              🏆 Leaderboard
            </button>

            {/* Activity Link */}
            <button
              onClick={() => navigate('/activity')}
              className="hidden sm:flex items-center gap-1.5 border border-[#1e2d45] text-gray-400 px-3 py-2 rounded-lg text-sm hover:border-[#00d4ff]/40 hover:text-[#00d4ff] transition-all"
            >
              📰 Activity
            </button>

            {/* Chat Link - DAY 11 Addition */}
            <button
              onClick={() => navigate('/chat')}
              className="hidden sm:flex items-center gap-1.5 border border-[#1e2d45] text-gray-400 px-3 py-2 rounded-lg text-sm hover:border-[#00d4ff]/40 hover:text-[#00d4ff] transition-all"
            >
              💬 Chat
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-[#111827] border border-[#1e2d45] rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-xs text-[#00d4ff] font-bold">
                {userInitial}
              </div>
              <span className="text-gray-400 text-sm">{userName}</span>
            </div>
            
            {/* 🔒 SECURITY LAYER 1: Button only shows for whitelisted emails */}
            {isUserAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 text-xs px-3 py-1.5 rounded-full font-bold border border-yellow-500/30 hover:bg-yellow-500/20 transition-all cursor-pointer"
              >
                ⚡ ADMIN PANEL
              </button>
            )}
            
            <button
              onClick={signOut}
              className="border border-[#1e2d45] text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-red-500/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome Banner */}
        <div className="relative mb-8 bg-gradient-to-r from-[#0d1f3c] to-[#0d1526] border border-[#1e2d45] rounded-2xl p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #00d4ff 0%, transparent 60%)' }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[#00d4ff] text-xs font-bold tracking-widest uppercase mb-1">
                Day {dayOnRoadmap} · PrepLog
              </p>
              <h2 className="text-white text-2xl font-black mb-1">
                Welcome back, {userName}! 👋
              </h2>
              <p className="text-gray-400 text-sm">
                {streak > 0
                  ? `🔥 ${streak}-day streak! Keep the momentum going.`
                  : 'Complete a task today to start your streak!'}
              </p>
            </div>
            <button
              onClick={() => navigate('/roadmap-builder')}
              className="px-6 py-3 bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] rounded-lg font-bold text-white hover:opacity-90 transition"
            >
              ✏️ Create Roadmap
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar
          dayOnRoadmap={dayOnRoadmap}
          streak={streak}
          topicsDone={topicsDone}
          tasksDone={tasksDone}
        />

        {/* 🚀 DAY 12 - COMMUNITY STATS */}
        <div className="mb-8">
          <CommunityStats />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">My Roadmaps</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/platforms')}
                  className="text-gray-500 text-sm hover:text-[#00d4ff] transition-colors sm:hidden"
                >
                  🔗 Platforms
                </button>
                <button
                  onClick={() => navigate('/select-roadmap')}
                  className="text-[#00d4ff] text-sm hover:underline"
                >
                  + Add Roadmap
                </button>
              </div>
            </div>
            <MyRoadmaps roadmaps={roadmaps} loading={roadmapsLoading} />
          </div>

          {/* Right Column: Today's Plan + Suggested Connections */}
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-lg mb-4">Today's Plan</h2>
              <TodayPlan roadmaps={roadmaps} tasks={tasks} />
            </div>

            {/* 🚀 DAY 12 - SUGGESTED CONNECTIONS */}
            <SuggestedConnections />
          </div>
        </div>

        {/* Heatmap */}
        <Heatmap counts={heatmapCounts} />

        {/* Admin Seed */}
        {profile?.role === 'admin' && !seedDone && (
          <div className="mt-6 bg-[#0d1526] border border-yellow-500/30 rounded-2xl p-6">
            <h3 className="text-yellow-400 font-bold mb-2">🌱 Admin — Seed Default Roadmaps</h3>
            <p className="text-gray-400 text-sm mb-4">Seed the 10 default roadmaps into the database.</p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              {seeding ? '⏳ Seeding...' : '🚀 Seed Default Roadmaps'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard