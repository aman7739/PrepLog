import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import FollowButton from '../components/FollowButton'

function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  
  const [profile, setProfile] = useState(null)
  const [roadmaps, setRoadmaps] = useState([])
  const [stats, setStats] = useState({ topics: 0, tasks: 0, streak: 0 })
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchRoadmaps()
    fetchStats()
    fetchBadges()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoadmaps = async () => {
    try {
      const { data } = await supabase
        .from('user_roadmaps')
        .select(`
          id,
          roadmap_templates (
            id, title, icon, difficulty, category
          )
        `)
        .eq('user_id', userId)
      setRoadmaps(data || [])
    } catch (error) {
      console.error('Error fetching roadmaps:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const { count: topicsCount } = await supabase
        .from('roadmap_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('done', true)

      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_completed', true)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('streak')
        .eq('id', userId)
        .single()

      setStats({
        topics: topicsCount || 0,
        tasks: tasksCount || 0,
        streak: profileData?.streak || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchBadges = async () => {
    try {
      const { data } = await supabase
        .from('user_badges')
        .select('badge_type, earned_at')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
      setBadges(data || [])
    } catch (error) {
      console.error('Error fetching badges:', error)
    }
  }

  // --- NEW: Handle starting a chat ---
  const handleStartChat = async () => {
    if (!currentUser) return;

    try {
      // 1. Check if a conversation already exists
      const { data: existingConvo, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${currentUser.id})`)
        .maybeSingle(); // CHANGED: This prevents the crash if 0 rows are found!

      if (fetchError) throw fetchError;

      if (existingConvo) {
        navigate('/chat');
        return;
      }

      // 2. If no conversation exists, create one!
      const { data: newConvo, error: insertError } = await supabase
        .from('conversations')
        .insert({
          user1_id: currentUser.id,
          user2_id: userId,
          last_message: 'Started a new conversation'
        })
        .select()
        .single();

      if (insertError) {
        console.error("Supabase Insert Error:", insertError);
        throw insertError;
      }

      // 3. Send them to the chat page
      navigate('/chat');

    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Could not start conversation. (Did you forget to run the SQL RLS policy?)");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-white text-xl">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="bg-[#0f1729] border-b border-[#1e2d45] p-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/dashboard" className="text-[#00d4ff] hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-6 mt-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] flex items-center justify-center text-4xl font-bold">
              {profile.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile.full_name || 'Anonymous User'}</h1>
              <p className="text-gray-400 mb-4">{profile.email}</p>
              
              {/* Action Buttons Container */}
              <div className="flex items-center gap-3">
                <FollowButton userId={userId} userName={profile.full_name} />
                
                {/* NEW: Message Button (Only shows if it's not your own profile) */}
                {currentUser && currentUser.id !== userId && (
                  <button 
                    onClick={handleStartChat}
                    className="bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] text-white px-5 py-2 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 text-sm"
                  >
                    <span className="text-lg">💬</span> Message
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0f1729] border border-[#1e2d45] rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#00d4ff]">{stats.topics}</div>
            <div className="text-gray-400 mt-2">Topics Completed</div>
          </div>
          <div className="bg-[#0f1729] border border-[#1e2d45] rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#FF6B9D]">{stats.tasks}</div>
            <div className="text-gray-400 mt-2">Tasks Completed</div>
          </div>
          <div className="bg-[#0f1729] border border-[#1e2d45] rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.streak} 🔥</div>
            <div className="text-gray-400 mt-2">Day Streak</div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">🏆 Badges</h2>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.badge_type}
                  className="bg-[#0f1729] border border-[#1e2d45] rounded-lg px-4 py-2 text-sm"
                >
                  {getBadgeEmoji(badge.badge_type)} {getBadgeName(badge.badge_type)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmaps */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📚 Active Roadmaps ({roadmaps.length})</h2>
          {roadmaps.length === 0 ? (
            <div className="bg-[#0f1729] border border-[#1e2d45] rounded-lg p-8 text-center text-gray-400">
              No active roadmaps yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-[#0f1729] border border-[#1e2d45] rounded-lg p-4 hover:border-[#00d4ff]/40 transition-all"
                >
                  <div className="text-3xl mb-2">{roadmap.roadmap_templates.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{roadmap.roadmap_templates.title}</h3>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-[#1e2d45] rounded">
                      {roadmap.roadmap_templates.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-[#1e2d45] rounded">
                      {roadmap.roadmap_templates.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getBadgeEmoji(badgeType) {
  const emojis = {
    first_roadmap: '🎯',
    ten_topics: '📚',
    fifty_topics: '🌟',
    hundred_topics: '💎',
    week_streak: '🔥',
    month_streak: '⚡',
    first_fork: '🍴',
    community_star: '⭐'
  }
  return emojis[badgeType] || '🏅'
}

function getBadgeName(badgeType) {
  const names = {
    first_roadmap: 'First Roadmap',
    ten_topics: '10 Topics',
    fifty_topics: '50 Topics',
    hundred_topics: '100 Topics',
    week_streak: '7 Day Streak',
    month_streak: '30 Day Streak',
    first_fork: 'First Fork',
    community_star: 'Community Star'
  }
  return names[badgeType] || badgeType
}

export default Profile