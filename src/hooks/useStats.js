import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useStats = () => {
  const { user } = useAuth()
  const [activity, setActivity] = useState([])
  const [progress, setProgress] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      setLoading(true)
      try {
        const [actRes, progRes, taskRes] = await Promise.all([
          supabase
            .from('activity')
            .select('date, count')
            .eq('user_id', user.id)
            .order('date', { ascending: false }),
          supabase
            .from('roadmap_progress')
            .select('done, created_at, topic') 
            .eq('user_id', user.id),
          supabase
            .from('tasks')
            .select('done, date, text, category')
            .eq('user_id', user.id),
        ])

        setActivity(actRes.data || [])
        setProgress(progRes.data || [])
        setTasks(taskRes.data || [])
      } catch (err) {
        console.error('useStats fetch error:', err)
      }
      setLoading(false)
    }
    fetchStats()
  }, [user])

  const heatmapCounts = useMemo(() => {
    const counts = {}
    if (activity.length > 0) {
      activity.forEach(row => {
        if (row.date && row.count > 0) {
          counts[row.date] = (counts[row.date] || 0) + row.count
        }
      })
    } else {
      progress.forEach(row => {
        if (row.done && row.created_at) { 
          const d = row.created_at.slice(0, 10) 
          counts[d] = (counts[d] || 0) + 1
        }
      })
      tasks.forEach(row => {
        if (row.done && row.date) {
          counts[row.date] = (counts[row.date] || 0) + 1
        }
      })
    }
    return counts
  }, [activity, progress, tasks])

  const streak = useMemo(() => {
    let count = 0
    const d = new Date()
    const todayKey = d.toISOString().slice(0, 10)
    if (!heatmapCounts[todayKey]) d.setDate(d.getDate() - 1)
    while (true) {
      const key = d.toISOString().slice(0, 10)
      if (heatmapCounts[key] > 0) {
        count++
        d.setDate(d.getDate() - 1)
      } else break
    }
    return count
  }, [heatmapCounts])

  // ✅ NEW: Automatically sync the calculated streak to the database
  useEffect(() => {
    const syncStreakToDatabase = async () => {
      // Wait until data is fully loaded before syncing, so we don't accidentally sync a 0!
      if (!user || loading || streak === undefined) return
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ streak: streak })
          .eq('id', user.id)
          
        if (error) throw error
      } catch (err) {
        console.error('Failed to sync streak to database:', err)
      }
    }

    syncStreakToDatabase()
  }, [streak, user, loading])

  const topicsDone = useMemo(() => progress.filter(p => p.done).length, [progress])
  const tasksDone = useMemo(() => tasks.filter(t => t.done).length, [tasks])

  return { heatmapCounts, streak, topicsDone, tasksDone, tasks, loading }
}

