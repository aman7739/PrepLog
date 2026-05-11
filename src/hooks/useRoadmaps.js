import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useRoadmaps = () => {
  const { user } = useAuth()
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRoadmaps = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_roadmaps')
        .select(`
          id,
          template_id,
          started_at,
          target_end_date,
          hours_per_day,
          is_active,
          template:roadmap_templates(
            id, title, icon, category, difficulty, duration_weeks, description
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('started_at', { ascending: true })

      if (error) console.error('useRoadmaps error:', error.message)
      setRoadmaps(data || [])
    } catch (err) {
      console.error('useRoadmaps fetch error:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRoadmaps()
  }, [user])

  return { roadmaps, loading, refetch: fetchRoadmaps }
}