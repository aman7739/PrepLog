import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function useRoadmapBuilder() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const saveRoadmap = async (roadmapData) => {
    if (!user) return false

    setLoading(true)
    try {
      // Step 1: Insert roadmap template
      const { data: template, error: templateError } = await supabase
        .from('roadmap_templates')
        .insert({
          title: roadmapData.title,
          description: roadmapData.description,
          category: roadmapData.category,
          difficulty: roadmapData.difficulty,
          is_public: roadmapData.is_public,
          is_default: false,
          is_draft: roadmapData.is_draft,
          created_by: user.id,
          icon: '🎯' // Default icon
        })
        .select()
        .single()

      if (templateError) throw templateError

      // Step 2: Insert phases
      for (let i = 0; i < roadmapData.phases.length; i++) {
        const phase = roadmapData.phases[i]
        
        const { data: phaseData, error: phaseError } = await supabase
          .from('template_phases')
          .insert({
            template_id: template.id,
            phase_number: i + 1,
            name: phase.name,
            description: phase.description,
            duration_weeks: phase.duration_weeks,
            order_num: i + 1
          })
          .select()
          .single()

        if (phaseError) throw phaseError

        // Step 3: Insert topics for this phase
        for (let j = 0; j < phase.topics.length; j++) {
          const topic = phase.topics[j]
          
          const { error: topicError } = await supabase
            .from('template_topics')
            .insert({
              phase_id: phaseData.id,
              topic: topic.topic,
              resource_url: topic.resource_url || null,
              youtube_url: topic.youtube_url || null,
              cert_url: topic.cert_url || null,
              order_num: j + 1
            })

          if (topicError) throw topicError
        }
      }

      // Step 4: Add to user's roadmaps (if not draft)
      if (!roadmapData.is_draft) {
        const { error: userRoadmapError } = await supabase
          .from('user_roadmaps')
          .insert({
            user_id: user.id,
            template_id: template.id
          })

        if (userRoadmapError) throw userRoadmapError
      }

      console.log('✅ Roadmap saved successfully!')
      return true

    } catch (error) {
      console.error('❌ Error saving roadmap:', error)
      alert('Failed to save roadmap. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { saveRoadmap, loading }
}

export default useRoadmapBuilder


