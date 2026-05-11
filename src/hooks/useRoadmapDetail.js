import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useRoadmapDetail = (templateId) => {
  const { user } = useAuth()
  const [template, setTemplate] = useState(null)
  const [phases, setPhases] = useState([])
  const [phaseTopics, setPhaseTopics] = useState({})
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !templateId) return
    fetchRoadmapDetail()
  }, [user, templateId])

  const fetchRoadmapDetail = async () => {
    setLoading(true)
    try {
      // Fetch template
      const { data: templateData, error: templateError } = await supabase
        .from('roadmap_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (templateError) throw templateError
      setTemplate(templateData)

      // Fetch phases
      const { data: phasesData, error: phasesError } = await supabase
        .from('template_phases')
        .select('*')
        .eq('template_id', templateId)
        .order('order_num', { ascending: true })

      if (phasesError) throw phasesError
      setPhases(phasesData || [])

      // Fetch all topics for all phases
      const topicsByPhase = {}
      const allTopicIds = []

      for (const phase of phasesData || []) {
        const { data: topicsData, error: topicsError } = await supabase
          .from('template_topics')
          .select('*')
          .eq('phase_id', phase.id)
          .order('order_num', { ascending: true })

        if (topicsError) throw topicsError
        topicsByPhase[phase.id] = topicsData || []
        allTopicIds.push(...(topicsData?.map(t => t.id) || []))
      }
      setPhaseTopics(topicsByPhase)

      // Fetch user progress for all topics
      if (allTopicIds.length > 0 && user) {
        const { data: progressData, error: progressError } = await supabase
          .from('roadmap_progress')
          .select('topic, done') 
          .eq('user_id', user.id)
          .in('topic', allTopicIds)

        if (progressError) throw progressError

        const progressMap = {}
        progressData?.forEach(p => {
          progressMap[p.topic] = p.done 
        })
        setProgress(progressMap)
      }
    } catch (err) {
      console.error('fetchRoadmapDetail error:', err)
    }
    setLoading(false)
  }

  // Toggle topic completion (FOOLPROOF METHOD)
  const toggleTopic = async (topicId, isDone) => {
    if (!user) return

    // 1. Optimistically update UI instantly
    setProgress(prev => ({ ...prev, [topicId]: isDone }))

    try {
      // 2. Check if a record already exists
      const { data: existing, error: fetchError } = await supabase
        .from('roadmap_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('topic', topicId)
        .maybeSingle()

      if (fetchError) throw fetchError

      if (existing) {
        // 3a. If exists, UPDATE
        const { error: updateError } = await supabase
          .from('roadmap_progress')
          .update({ done: isDone })
          .eq('id', existing.id)

        if (updateError) throw updateError
      } else {
        // 3b. If doesn't exist, INSERT
        const { error: insertError } = await supabase
          .from('roadmap_progress')
          .insert({
            user_id: user.id,
            topic: topicId,
            done: isDone
          })

        if (insertError) throw insertError
      }

      // ✅ NEW: Post to Activity Feed if they checked the box!
      if (isDone) {
        await supabase.from('activity_feed').insert({
          user_id: user.id,
          action_type: 'complete_topic',
          content: 'Completed a new roadmap topic!'
        })
      }

    } catch (err) {
      console.error('Database sync failed:', err)
      // Revert UI if database fails
      setProgress(prev => ({ ...prev, [topicId]: !isDone }))
    }
  }

  // Calculate phase progress
  const getPhaseProgress = (phaseId) => {
    const topics = phaseTopics[phaseId] || []
    if (topics.length === 0) return 0
    const completedCount = topics.filter(t => progress[t.id]).length
    return Math.round((completedCount / topics.length) * 100)
  }

  return {
    template,
    phases,
    phaseTopics,
    progress,
    loading,
    toggleTopic,
    getPhaseProgress,
  }
}