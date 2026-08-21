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
import SuggestedConnections from '../components/SuggestedConnections'

function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  // 🔒 SECURITY LAYER 1: Email Whitelist for Admin Button
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
    <div className="min-h-screen bg-brand-black">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome Banner - Restyled */}
        <div className="relative mb-8 bg-brand-dark border border-theme-border rounded-2xl p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #f97316 0%, transparent 60%)' }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-1">
                Day {dayOnRoadmap} · PrepLog
              </p>
              <h2 className="text-theme-text text-2xl font-black mb-1">
                Welcome back, {userName}! 👋
              </h2>
              <p className="text-theme-textSec text-sm">
                {streak > 0
                  ? `🔥 ${streak}-day streak! Keep the momentum going.`
                  : 'Complete a task today to start your streak!'}
              </p>
            </div>
            <button
              onClick={() => navigate('/roadmap-builder')}
              className="px-6 py-3 bg-gradient-to-r from-brand-primary to-orange-600 rounded-lg font-bold text-theme-text hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20"
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-theme-text font-bold text-lg">My Roadmaps</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/platforms')}
                  className="text-theme-textSec text-sm hover:text-brand-primary transition-colors sm:hidden"
                >
                  🔗 Platforms
                </button>
                <button
                  onClick={() => navigate('/select-roadmap')}
                  className="text-brand-primary text-sm font-medium hover:underline"
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
              <h2 className="text-theme-text font-bold text-lg mb-4">Today's Plan</h2>
              <TodayPlan roadmaps={roadmaps} tasks={tasks} />
            </div>

            {/* 🚀 SUGGESTED CONNECTIONS */}
            <SuggestedConnections />
          </div>
        </div>

        {/* Heatmap */}
        <Heatmap counts={heatmapCounts} />

        {/* Admin Seed */}
        {profile?.role === 'admin' && !seedDone && (
          <div className="mt-6 bg-brand-dark border border-yellow-500/30 rounded-2xl p-6">
            <h3 className="text-yellow-400 font-bold mb-2">🌱 Admin — Seed Default Roadmaps</h3>
            <p className="text-theme-textSec text-sm mb-4">Seed the 10 default roadmaps into the database.</p>
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