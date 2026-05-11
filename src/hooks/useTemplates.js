import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useTemplates = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('roadmap_templates')
        .select('*')
        .eq('is_default', true)
        .order('category')

      if (!error) setTemplates(data)
      setLoading(false)
    }

    fetchTemplates()
  }, [])

  return { templates, loading }
}