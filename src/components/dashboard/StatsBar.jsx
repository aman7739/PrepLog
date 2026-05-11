function StatsBar({ dayOnRoadmap, streak, topicsDone, tasksDone }) {
  const stats = [
    {
      label: 'Day on Roadmap',
      value: dayOnRoadmap,
      icon: '📅',
      color: 'text-[#00d4ff]',
      bg: 'bg-[#00d4ff]/5',
      border: 'border-[#00d4ff]/20',
    },
    {
      label: 'Current Streak',
      value: streak > 0 ? `${streak} 🔥` : '0',
      icon: '⚡',
      color: 'text-amber-400',
      bg: 'bg-amber-400/5',
      border: 'border-amber-400/20',
    },
    {
      label: 'Topics Done',
      value: topicsDone,
      icon: '🧠',
      color: 'text-purple-400',
      bg: 'bg-purple-400/5',
      border: 'border-purple-400/20',
    },
    {
      label: 'Tasks Done',
      value: tasksDone,
      icon: '✅',
      color: 'text-green-400',
      bg: 'bg-green-400/5',
      border: 'border-green-400/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`${s.bg} border ${s.border} rounded-2xl p-5 text-center transition-all hover:scale-[1.02]`}
        >
          <div className="text-2xl mb-2">{s.icon}</div>
          <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
          <div className="text-gray-500 text-xs">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsBar