import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useBadges() {
  const { user } = useAuth()
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBadges()
    }
  }, [user])

  const fetchBadges = async () => {
    try {
      const { data } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

      setBadges(data || [])
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAndAwardBadges = async () => {
    try {
      // Get user stats
      const { count: topicsCount } = await supabase
        .from('roadmap_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('done', true)

      const { count: roadmapsCount } = await supabase
        .from('user_roadmaps')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const { count: forksCount } = await supabase
        .from('roadmap_templates')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('streak')
        .eq('id', user.id)
        .single()

      const streak = profile?.streak || 0

      // Badge conditions
      const badgeConditions = [
        { type: 'first_roadmap', condition: roadmapsCount >= 1 },
        { type: 'ten_topics', condition: topicsCount >= 10 },
        { type: 'fifty_topics', condition: topicsCount >= 50 },
        { type: 'hundred_topics', condition: topicsCount >= 100 },
        { type: 'week_streak', condition: streak >= 7 },
        { type: 'month_streak', condition: streak >= 30 },
        { type: 'first_fork', condition: forksCount >= 1 }
      ]

      // Award badges if conditions met
      for (const badge of badgeConditions) {
        if (badge.condition) {
          await awardBadge(badge.type)
        }
      }

      // Refresh badges
      await fetchBadges()
    } catch (error) {
      console.error('Error checking badges:', error)
    }
  }

  const awardBadge = async (badgeType) => {
    try {
      // Use upsert to avoid duplicates
      await supabase
        .from('user_badges')
        .upsert(
          { user_id: user.id, badge_type: badgeType },
          { onConflict: 'user_id,badge_type' }
        )
    } catch (error) {
      console.error('Error awarding badge:', error)
    }
  }

  return { badges, loading, checkAndAwardBadges, refetch: fetchBadges }
}
