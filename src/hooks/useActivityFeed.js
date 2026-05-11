import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useActivityFeed() {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchActivityFeed()
    }
  }, [user])

  const fetchActivityFeed = async () => {
    try {
      // Get list of users the current user follows
      const { data: followingData } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id)

      const followingIds = followingData?.map(f => f.following_id) || []

      // Include own user ID to see own activity
      const userIds = [...followingIds, user.id]

      if (userIds.length === 0) {
        setActivities([])
        setLoading(false)
        return
      }

      // Fetch activity from followed users + self
      const { data } = await supabase
        .from('activity_feed')
        .select(`
          id,
          action_type,
          content,
          metadata,
          created_at,
          profiles:user_id (
            id,
            full_name
          )
        `)
        .in('user_id', userIds)
        .order('created_at', { ascending: false })
        .limit(50)

      setActivities(data || [])
    } catch (error) {
      console.error('Error fetching activity feed:', error)
    } finally {
      setLoading(false)
    }
  }

  const createActivity = async (actionType, content, metadata = null) => {
    try {
      await supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          action_type: actionType,
          content: content,
          metadata: metadata
        })

      // Refresh feed
      await fetchActivityFeed()
    } catch (error) {
      console.error('Error creating activity:', error)
    }
  }

  return { activities, loading, createActivity, refetch: fetchActivityFeed }
}

