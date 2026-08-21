import toast from 'react-hot-toast';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useRoadmapBuilder from '../hooks/useRoadmapBuilder'

function RoadmapBuilder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { saveRoadmap, loading } = useRoadmapBuilder()
  
  // Roadmap metadata
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('DSA')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [isPublic, setIsPublic] = useState(false)
  
  // Phases (4 phases)
  const [phases, setPhases] = useState([
    { name: '', description: '', duration_weeks: 4, topics: [{ topic: '', resource_url: '', youtube_url: '', cert_url: '' }, { topic: '', resource_url: '', youtube_url: '', cert_url: '' }, { topic: '', resource_url: '', youtube_url: '', cert_url: '' }] },
    { name: '', description: '', duration_weeks: 4, topics: [{ topic: '', resource_url: '', youtube_url: '', cert_url: '' }, { topic: '', resource_url: '', youtube_url: '', cert_url: '' }, { topic: '', resource_url: '', youtube_url: '', cert_url: '' }] },
    { name: '', description: '', duration_weeks: 4, topics: [{ topic: '', resource_url: '', youtube_url: '', cert_url: '' }, { topic: '', resource_url: '', youtube_url: '', cert_url: '' }, { topic: '', resource_url: '', youtube_url: '', cert_url: '' }] },
    { name: '', description: '', duration_weeks: 4, topics: [{ topic: '', resource_url: '', youtube_url: '', cert_url: '' }, { topic: '', resource_url: '', youtube_url: '', cert_url: '' }, { topic: '', resource_url: '', youtube_url: '', cert_url: '' }] }
  ])
  
  const [currentPhase, setCurrentPhase] = useState(0)

  const categories = ['DSA', 'Web Development', 'Mobile', 'Cloud', 'DevOps', 'Database', 'Machine Learning', 'System Design', 'Other']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  // Update phase data
  const updatePhase = (field, value) => {
    const newPhases = [...phases]
    newPhases[currentPhase][field] = value
    setPhases(newPhases)
  }

  // Update topic data
  const updateTopic = (topicIndex, field, value) => {
    const newPhases = [...phases]
    newPhases[currentPhase].topics[topicIndex][field] = value
    setPhases(newPhases)
  }

  // Save roadmap
  const handleSave = async (isDraft) => {
    if (!title.trim()) {
      toast.error('Please enter a roadmap title')
      return
    }

    // Validate phases
    for (let i = 0; i < phases.length; i++) {
      if (!phases[i].name.trim()) {
        toast.error(`Please fill Phase ${i + 1} name`)
        return
      }
      // Check topics
      for (let j = 0; j < phases[i].topics.length; j++) {
        if (!phases[i].topics[j].topic.trim()) {
          toast.error(`Please fill Topic ${j + 1} in Phase ${i + 1}`)
          return
        }
      }
    }

    const roadmapData = {
      title,
      description,
      category,
      difficulty,
      is_public: isPublic,
      is_draft: isDraft,
      phases
    }

    const success = await saveRoadmap(roadmapData)
    if (success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-brand-black text-theme-text p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-brand-primary bg-clip-text text-transparent mb-2">
            ✏️ Create Custom Roadmap
          </h1>
          <p className="text-theme-textSec">Build your personalized learning path</p>
        </div>

        {/* Roadmap Info */}
        <div className="bg-brand-dark border border-theme-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-brand-primary mb-4">📋 Roadmap Details</h2>
          
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm text-theme-textSec mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Full Stack JavaScript Mastery"
              className="w-full bg-brand-black border border-theme-border rounded-lg px-4 py-2 text-theme-text focus:border-brand-primary focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm text-theme-textSec mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will learners achieve with this roadmap?"
              rows="3"
              className="w-full bg-brand-black border border-theme-border rounded-lg px-4 py-2 text-theme-text focus:border-brand-primary focus:outline-none resize-none"
            />
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-theme-textSec mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-brand-black border border-theme-border rounded-lg px-4 py-2 text-theme-text focus:border-brand-primary focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-theme-textSec mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-brand-black border border-theme-border rounded-lg px-4 py-2 text-theme-text focus:border-brand-primary focus:outline-none"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Public/Private */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 accent-[#00d4ff]"
            />
            <label htmlFor="isPublic" className="text-theme-textSec">
              🌍 Make this roadmap public (others can view and fork)
            </label>
          </div>
        </div>

        {/* Phase Builder */}
        <div className="bg-brand-dark border border-theme-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-brand-primary mb-4">📂 Build Phases (4 Total)</h2>
          
          {/* Phase Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {phases.map((phase, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPhase(idx)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  currentPhase === idx
                    ? 'bg-brand-primary text-theme-text'
                    : 'bg-brand-black text-theme-textSec hover:text-theme-text'
                }`}
              >
                Phase {idx + 1}
              </button>
            ))}
          </div>

          {/* Current Phase Form */}
          <div>
            <div className="mb-4">
              <label className="block text-sm text-theme-textSec mb-2">Phase Name *</label>
              <input
                type="text"
                value={phases[currentPhase].name}
                onChange={(e) => updatePhase('name', e.target.value)}
                placeholder={`e.g., ${currentPhase === 0 ? 'Fundamentals' : currentPhase === 1 ? 'Intermediate Concepts' : currentPhase === 2 ? 'Advanced Topics' : 'Projects & Practice'}`}
                className="w-full bg-brand-black border border-theme-border rounded-lg px-4 py-2 text-theme-text focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-theme-textSec mb-2">Phase Description</label>
              <textarea
                value={phases[currentPhase].description}
                onChange={(e) => updatePhase('description', e.target.value)}
                placeholder="What will be covered in this phase?"
                rows="2"
                className="w-full bg-brand-black border border-theme-border rounded-lg px-4 py-2 text-theme-text focus:border-brand-primary focus:outline-none resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-theme-textSec mb-2">Duration (weeks)</label>
              <input
                type="number"
                min="1"
                max="52"
                value={phases[currentPhase].duration_weeks}
                onChange={(e) => updatePhase('duration_weeks', parseInt(e.target.value))}
                className="w-full bg-brand-black border border-theme-border rounded-lg px-4 py-2 text-theme-text focus:border-brand-primary focus:outline-none"
              />
            </div>

            {/* Topics */}
            <h3 className="text-lg font-bold text-[#FF6B9D] mb-3">📝 Topics (3 per phase)</h3>
            {phases[currentPhase].topics.map((topic, topicIdx) => (
              <div key={topicIdx} className="bg-brand-black border border-theme-border rounded-lg p-4 mb-4">
                <h4 className="text-theme-text font-medium mb-3">Topic {topicIdx + 1}</h4>
                
                <div className="mb-3">
                  <label className="block text-sm text-theme-textSec mb-1">Topic Name *</label>
                  <input
                    type="text"
                    value={topic.topic}
                    onChange={(e) => updateTopic(topicIdx, 'topic', e.target.value)}
                    placeholder="e.g., React Hooks Deep Dive"
                    className="w-full bg-brand-dark border border-theme-border rounded px-3 py-2 text-theme-text text-sm focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="url"
                    value={topic.resource_url}
                    onChange={(e) => updateTopic(topicIdx, 'resource_url', e.target.value)}
                    placeholder="📖 Resource URL (optional)"
                    className="w-full bg-brand-dark border border-theme-border rounded px-3 py-2 text-theme-text text-sm focus:border-brand-primary focus:outline-none"
                  />
                  <input
                    type="url"
                    value={topic.youtube_url}
                    onChange={(e) => updateTopic(topicIdx, 'youtube_url', e.target.value)}
                    placeholder="🎥 YouTube URL (optional)"
                    className="w-full bg-brand-dark border border-theme-border rounded px-3 py-2 text-theme-text text-sm focus:border-brand-primary focus:outline-none"
                  />
                  <input
                    type="url"
                    value={topic.cert_url}
                    onChange={(e) => updateTopic(topicIdx, 'cert_url', e.target.value)}
                    placeholder="🎓 Certificate URL (optional)"
                    className="w-full bg-brand-dark border border-theme-border rounded px-3 py-2 text-theme-text text-sm focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-brand-dark border border-theme-border rounded-lg text-theme-textSec hover:text-theme-text hover:border-brand-primary transition"
          >
            ← Cancel
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-6 py-3 bg-brand-dark border border-theme-border rounded-lg text-theme-textSec hover:text-theme-text hover:border-[#FF6B9D] transition disabled:opacity-50"
          >
            💾 Save as Draft
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-brand-primary rounded-lg font-bold text-theme-text hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? '⏳ Saving...' : '🚀 Publish Roadmap'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default RoadmapBuilder


