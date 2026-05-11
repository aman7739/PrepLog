import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTemplates } from '../hooks/useTemplates'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'dsa', label: 'DSA', icon: '🧠' },
  { id: 'webdev', label: 'Web Dev', icon: '🌐' },
  { id: 'ai', label: 'AI / ML', icon: '🤖' },
  { id: 'cloud', label: 'Cloud', icon: '☁️' },
  { id: 'devops', label: 'DevOps', icon: '⚙️' },
  { id: 'language', label: 'Language', icon: '💻' },
  { id: 'placement', label: 'Placement', icon: '🎯' },
]

const DIFFICULTY_COLOR = {
  beginner: 'text-green-400 bg-green-400/10',
  intermediate: 'text-yellow-400 bg-yellow-400/10',
  advanced: 'text-red-400 bg-red-400/10',
}

function SelectRoadmap() {
  const { user } = useAuth()
  const { templates, loading } = useTemplates()
  const navigate = useNavigate()

  const [selected, setSelected] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  // Agar already roadmaps hain toh dashboard pe redirect karo
  useEffect(() => {
    const checkExisting = async () => {
      if (!user) return
      try {
        const { data } = await supabase
          .from('user_roadmaps')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
        if (data && data.length > 0) {
          navigate('/dashboard')
        }
      } catch (err) {
        console.log('Check error:', err)
      }
    }
    checkExisting()
  }, [user])

  const filtered = templates.filter(t => {
    const matchCat = activeCategory === 'all' || t.category === activeCategory
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (selected.length === 0) return
    setSaving(true)

    try {
      // Pehle existing roadmaps fetch karo
      const { data: existing } = await supabase
        .from('user_roadmaps')
        .select('template_id')
        .eq('user_id', user.id)

      const existingIds = existing ? existing.map(r => r.template_id) : []

      // Sirf naye roadmaps insert karo
      const newRoadmaps = selected.filter(id => !existingIds.includes(id))

      if (newRoadmaps.length > 0) {
        const inserts = newRoadmaps.map(template_id => ({
          user_id: user.id,
          template_id,
          hours_per_day: 3,
        }))

        const { error } = await supabase
          .from('user_roadmaps')
          .insert(inserts)

        if (error) {
          console.log('Insert error:', error.message)
          setSaving(false)
          return
        }
      }
    } catch (err) {
      console.log('Save error:', err)
    }

    setSaving(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-6">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-2">
          Choose Your <span className="text-[#00d4ff]">Roadmaps</span>
        </h1>
        <p className="text-gray-400">Select one or more roadmaps to start tracking your progress</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="🔍 Search roadmaps..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-[#1e2d45] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#00d4ff] transition-all"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-[#00d4ff] text-black'
                : 'bg-[#111827] border border-[#1e2d45] text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff]'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading roadmaps...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-24">
          {filtered.map(t => {
            const isSelected = selected.includes(t.id)
            return (
              <div
                key={t.id}
                onClick={() => toggleSelect(t.id)}
                className={`cursor-pointer rounded-xl p-5 border transition-all ${
                  isSelected
                    ? 'bg-[#00d4ff]/10 border-[#00d4ff]'
                    : 'bg-[#111827] border-[#1e2d45] hover:border-[#00d4ff]/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{t.icon}</span>
                  {isSelected && (
                    <span className="text-[#00d4ff] text-xl">✓</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{t.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{t.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${DIFFICULTY_COLOR[t.difficulty]}`}>
                    {t.difficulty}
                  </span>
                  <span className="text-gray-500 text-xs">{t.duration_weeks} weeks</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom Save Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1e2d45] px-6 py-4 flex items-center justify-between">
          <span className="text-white font-semibold">
            {selected.length} roadmap{selected.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#00d4ff] hover:bg-[#00b4d8] disabled:opacity-50 text-black font-bold px-8 py-3 rounded-xl transition-all"
          >
            {saving ? 'Saving...' : 'Start Learning →'}
          </button>
        </div>
      )}

    </div>
  )
}

export default SelectRoadmap