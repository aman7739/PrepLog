function TodayPlan({ roadmaps, tasks }) {
  const today = new Date().toISOString().slice(0, 10)

  const todayTasks = tasks.filter(t => t.date === today)
  const doneTasks = todayTasks.filter(t => t.done)

  const suggestions = roadmaps.slice(0, 3).map(r => {
    const template = r.template || {}
    const daysSince = r.started_at
      ? Math.floor((Date.now() - new Date(r.started_at)) / 86400000) + 1
      : 1
    return {
      icon: template.icon || '📘',
      title: template.title || 'Roadmap',
      hint: `Day ${daysSince} — ${r.hours_per_day}h planned today`,
      category: template.category || '',
    }
  })

  return (
    <div className="bg-[#0d1526] border border-[#1e2d45] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-sm">Today's Plan</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        {todayTasks.length > 0 && (
          <span className="text-xs text-gray-500">
            <span className="text-green-400 font-bold">{doneTasks.length}</span>/{todayTasks.length} done
          </span>
        )}
      </div>

      {todayTasks.length > 0 && (
        <div className="mb-4 space-y-2">
          {todayTasks.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${
                t.done
                  ? 'bg-green-400/20 border-green-400/40 text-green-400'
                  : 'border-[#1e2d45]'
              }`}>
                {t.done ? '✓' : ''}
              </div>
              <span className={`text-sm ${t.done ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                {t.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-gray-600 text-xs uppercase tracking-wider font-bold mb-2">
            {todayTasks.length > 0 ? 'Active Roadmaps' : 'Suggested Focus'}
          </p>
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#111827] border border-[#1e2d45]">
              <span className="text-lg">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-xs font-semibold truncate">{s.title}</p>
                <p className="text-gray-600 text-[10px]">{s.hint}</p>
              </div>
              <span className="text-[10px] text-gray-600 capitalize">{s.category}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-600 text-sm">No active roadmaps</p>
          <p className="text-gray-700 text-xs mt-1">Add a roadmap to get a study plan</p>
        </div>
      )}

      <p className="text-gray-700 text-[10px] text-center mt-4">
        Task tracking coming in D6 ⚡
      </p>
    </div>
  )
}

export default TodayPlan