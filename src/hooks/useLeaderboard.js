import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useLeaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      // ✅ FIX: Removed 'email' and added 'username'
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, username, topics_completed, streak, followers_count')
        .order('topics_completed', { ascending: false })
        .limit(50)

      if (profileError) {
        console.error('Supabase error fetching profiles:', profileError.message)
        throw profileError
      }

      // Get badges for each user
      const { data: allBadges } = await supabase
        .from('user_badges')
        .select('user_id, badge_type')

      // COMBINE DATA 
      const leaderboardData = (profiles || []).map((profile, index) => {
        const userBadges = allBadges?.filter(b => b.user_id === profile.id) || []
        return {
          ...profile,
          rank: index + 1,
          badges: userBadges
        }
      })

      setLeaders(leaderboardData)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      setLeaders([]) 
    } finally {
      setLoading(false)
    }
  }

  return { leaders, loading, refetch: fetchLeaderboard }
}