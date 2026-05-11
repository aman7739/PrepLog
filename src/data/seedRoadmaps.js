import { supabase } from '../lib/supabase'
import { DEFAULT_ROADMAPS } from './defaultRoadmaps'

export const seedDefaultRoadmaps = async () => {
  // Pehle check karo — already seeded hai?
  const { data: existing } = await supabase
    .from('roadmap_templates')
    .select('id')
    .eq('is_default', true)
    .limit(1)

  if (existing && existing.length > 0) {
    console.log('Already seeded — skipping!')
    return { alreadySeeded: true }
  }

  console.log('Seeding default roadmaps...')

  for (const roadmap of DEFAULT_ROADMAPS) {
    const { data: template, error: tErr } = await supabase
      .from('roadmap_templates')
      .insert({
        title: roadmap.title,
        category: roadmap.category,
        icon: roadmap.icon,
        difficulty: roadmap.difficulty,
        duration_weeks: roadmap.duration_weeks,
        description: roadmap.description,
        tags: roadmap.tags,
        is_default: true,
        is_public: true,
        created_by: null,
      })
      .select()
      .single()

    if (tErr) {
      console.error(`Error inserting ${roadmap.title}:`, tErr.message)
      continue
    }

    for (const phase of roadmap.phases) {
      const { data: phaseData, error: pErr } = await supabase
        .from('template_phases')
        .insert({
          template_id: template.id,
          phase_number: phase.phase_number,
          name: phase.name,
          description: phase.description,
          duration_weeks: phase.duration_weeks,
          color: phase.color,
          order_num: phase.phase_number,
        })
        .select()
        .single()

      if (pErr) {
        console.error(`Error inserting phase ${phase.name}:`, pErr.message)
        continue
      }

      const topics = phase.topics.map((t, idx) => ({
        phase_id: phaseData.id,
        topic: t.topic,
        resource_url: t.resource_url || null,
        youtube_url: t.youtube_url || null,
        cert_url: t.cert_url || null,
        order_num: idx + 1,
      }))

      const { error: topicErr } = await supabase
        .from('template_topics')
        .insert(topics)

      if (topicErr) {
        console.error(`Error inserting topics for ${phase.name}:`, topicErr.message)
      }
    }

    console.log(`✅ Seeded: ${roadmap.title}`)
  }

  console.log('🎉 All roadmaps seeded!')
}