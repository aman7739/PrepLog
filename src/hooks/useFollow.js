import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useFollow(targetUserId) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && targetUserId) {
      checkFollowStatus()
      fetchFollowCounts()
    }
  }, [user, targetUserId])

  const checkFollowStatus = async () => {
    try {
      const { data } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle()

      setIsFollowing(!!data)
    } catch (error) {
      console.error('Error checking follow status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFollowCounts = async () => {
    try {
      // Get followers count
      const { count: followers } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId)

      // Get following count
      const { count: following } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', targetUserId)

      setFollowersCount(followers || 0)
      setFollowingCount(following || 0)
    } catch (error) {
      console.error('Error fetching follow counts:', error)
    }
  }

  const toggleFollow = async () => {
    if (!user || !targetUserId) return

    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)

        setIsFollowing(false)
        setFollowersCount(prev => prev - 1)

        // Update profiles table
        await supabase.rpc('decrement_followers', { target_user_id: targetUserId })
        await supabase.rpc('decrement_following', { current_user_id: user.id })
      } else {
        // Follow
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId
          })

        setIsFollowing(true)
        setFollowersCount(prev => prev + 1)

        // Update profiles table
        await supabase.rpc('increment_followers', { target_user_id: targetUserId })
        await supabase.rpc('increment_following', { current_user_id: user.id })

        // Create activity feed entry
        const { data: targetUser } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', targetUserId)
          .single()

        await supabase
          .from('activity_feed')
          .insert({
            user_id: user.id,
            action_type: 'follow',
            content: `Started following ${targetUser?.full_name || 'a user'}`,
            metadata: { target_user_id: targetUserId }
          })
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      alert('Failed to update follow status')
    }
  }

  return {
    isFollowing,
    followersCount,
    followingCount,
    toggleFollow,
    loading
  }
}




