import { useNavigate } from 'react-router-dom'

const DIFFICULTY_COLORS = {
  beginner: 'text-green-400 bg-green-400/10',
  intermediate: 'text-yellow-400 bg-yellow-400/10',
  advanced: 'text-red-400 bg-red-400/10',
}

function RoadmapCard({ roadmap }) {
  const navigate = useNavigate()

  const daysSince = roadmap.started_at
    ? Math.floor((Date.now() - new Date(roadmap.started_at)) / 86400000) + 1
    : 1

  const template = roadmap.template || {}
  const totalWeeks = template.duration_weeks || 8
  const totalDays = totalWeeks * 7
  const pct = Math.min(Math.round((daysSince / totalDays) * 100), 100)

  return (
    <div className="bg-[#0d1526] border border-[#1e2d45] rounded-2xl p-5 hover:border-[#00d4ff]/40 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{template.icon || '📘'}</span>
          <div>
            <h3 className="text-white font-bold text-sm leading-tight">{template.title || 'Roadmap'}</h3>
            <span className="text-gray-500 text-xs capitalize">{template.category || ''}</span>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-bold ${DIFFICULTY_COLORS[template.difficulty] || 'text-gray-400 bg-gray-400/10'}`}>
          {template.difficulty || '—'}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between mb-1.5">
          <span className="text-gray-500 text-xs">Day {daysSince} of {totalDays}</span>
          <span className="text-gray-500 text-xs">{pct}%</span>
        </div>
        <div className="h-1.5 bg-[#1a2235] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct >= 80
                ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                : 'linear-gradient(90deg, #00d4ff, #0090b8)',
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-xs">{roadmap.hours_per_day}h/day · {totalWeeks} weeks</span>
        <button
          onClick={() => navigate(`/roadmap/${roadmap.template_id}`)}
          className="text-xs text-gray-500 hover:text-[#00d4ff] transition-colors group-hover:text-[#00d4ff]/60"
        >
          Open →
        </button>
      </div>
    </div>
  )
}

function MyRoadmaps({ roadmaps, loading }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#0d1526] border border-[#1e2d45] rounded-2xl p-5 animate-pulse">
            <div className="h-4 bg-[#1e2d45] rounded w-3/4 mb-3" />
            <div className="h-2 bg-[#1e2d45] rounded w-full mb-2" />
            <div className="h-2 bg-[#1e2d45] rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (roadmaps.length === 0) {
    return (
      <div className="bg-[#0d1526] border border-dashed border-[#1e2d45] rounded-2xl p-10 text-center">
        <p className="text-4xl mb-3">🗺️</p>
        <p className="text-white font-bold mb-1">No roadmaps yet</p>
        <p className="text-gray-500 text-sm mb-4">Pick a roadmap to start your prep journey</p>
        <button
          onClick={() => navigate('/select-roadmap')}
          className="bg-[#00d4ff] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#00b4d8] transition-all"
        >
          Choose Roadmap
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {roadmaps.map(r => (
        <RoadmapCard key={r.id} roadmap={r} />
      ))}
    </div>
  )
}

export default MyRoadmaps



