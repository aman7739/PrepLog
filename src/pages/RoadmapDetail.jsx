import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoadmapDetail } from '../hooks/useRoadmapDetail'
import RoadmapCommunity from '../components/RoadmapCommunity' // ✅ Imported here

function RoadmapDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { template, phases, phaseTopics, progress, loading, toggleTopic, getPhaseProgress } = useRoadmapDetail(id)
  const [expandedPhase, setExpandedPhase] = useState(null)

  // Calculate overall progress
  const overallProgress = phases.length === 0 ? 0 : Math.round(
    (phases.reduce((sum, phase) => sum + getPhaseProgress(phase.id), 0) / phases.length)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a]">
        <div className="sticky top-0 z-10 bg-[#0a0e1a]/95 backdrop-blur border-b border-[#1e2d45] px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              ← Dashboard
            </button>
            <h1 className="text-xl font-black text-white">
              Prep<span className="text-[#00d4ff]">Log</span>
            </h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4 animate-pulse h-24" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#0a0e1a]">
        <div className="sticky top-0 z-10 bg-[#0a0e1a]/95 backdrop-blur border-b border-[#1e2d45] px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              ← Dashboard
            </button>
            <h1 className="text-xl font-black text-white">
              Prep<span className="text-[#00d4ff]">Log</span>
            </h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-[#0d1526] border border-[#1e2d45]/50 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">❌</div>
            <h3 className="text-white font-bold mb-2">Roadmap not found</h3>
            <p className="text-gray-500 text-sm mb-4">This roadmap doesn't exist</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#00d4ff] hover:underline text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-[#0a0e1a]/95 backdrop-blur border-b border-[#1e2d45] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            ← Dashboard
          </button>
          <h1 className="text-xl font-black text-white">
            Prep<span className="text-[#00d4ff]">Log</span>
            <span className="text-gray-500 font-normal text-base ml-2">/ Roadmap</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{template.icon || '📘'}</span>
            <div>
              <h2 className="text-white text-3xl font-black">{template.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{template.description}</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Overall Progress</span>
              <span className="text-[#00d4ff] font-bold">{overallProgress}%</span>
            </div>
            <div className="h-2.5 bg-[#111827] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-3">
          {phases.length === 0 ? (
            <div className="bg-[#0d1526] border border-[#1e2d45]/50 rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">No phases available</p>
            </div>
          ) : (
            phases.map(phase => {
              const isExpanded = expandedPhase === phase.id
              const topics = phaseTopics[phase.id] || []
              const phaseProgress = getPhaseProgress(phase.id)

              return (
                <div
                  key={phase.id}
                  className="bg-[#0d1526] border border-[#1e2d45] rounded-xl overflow-hidden"
                >
                  {/* Phase Header */}
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#111827] transition-all"
                  >
                    <div className="flex-1 text-left">
                      <h3 className="text-white font-bold mb-2">{phase.name}</h3>
                      {phase.description && (
                        <p className="text-gray-500 text-xs mb-2">{phase.description}</p>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-[#111827] rounded-full overflow-hidden max-w-xs">
                          <div
                            className="h-full bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D]"
                            style={{ width: `${phaseProgress}%` }}
                          />
                        </div>
                        <span className="text-gray-500 text-xs whitespace-nowrap">{phaseProgress}%</span>
                      </div>
                    </div>
                    <span className="text-gray-500 ml-4">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </button>

                  {/* Topics List */}
                  {isExpanded && (
                    <div className="border-t border-[#1e2d45] bg-[#111827]">
                      {topics.length === 0 ? (
                        <div className="px-6 py-4 text-gray-600 text-sm">
                          No topics in this phase
                        </div>
                      ) : (
                        <div className="divide-y divide-[#1e2d45]">
                          {topics.map(topic => (
                            <div
                              key={topic.id}
                              className="px-6 py-3 flex items-center gap-3 hover:bg-[#0d1526] transition-all"
                            >
                              <button
                                onClick={() => toggleTopic(topic.id, !progress[topic.id])}
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  progress[topic.id]
                                    ? 'bg-green-400/20 border-green-400 text-green-400'
                                    : 'border-[#1e2d45] hover:border-[#00d4ff]/40'
                                }`}
                              >
                                {progress[topic.id] && '✓'}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm ${
                                    progress[topic.id]
                                      ? 'text-gray-500 line-through'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  {topic.topic}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* ✅ Community Section Added Here! */}
        <RoadmapCommunity templateId={id} />

      </div>
    </div>
  )
}

export default RoadmapDetail