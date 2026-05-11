function getLast90Days() {
  const days = []
  const today = new Date()
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function heatColor(count) {
  if (!count || count === 0) return '#1a2235'
  if (count === 1) return '#0e4a6e'
  if (count === 2) return '#0a7abf'
  if (count <= 4) return '#00b4d8'
  return '#00d4ff'
}

function Heatmap({ counts = {} }) {
  const days = getLast90Days()
  const today = new Date().toISOString().slice(0, 10)

  const weeks = []
  let week = []
  const firstDayOfWeek = new Date(days[0]).getDay()
  for (let i = 0; i < firstDayOfWeek; i++) week.push(null)

  days.forEach(d => {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  })
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  const totalActivity = Object.values(counts).reduce((a, b) => a + b, 0)
  const activeDays = Object.keys(counts).filter(k => counts[k] > 0).length
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const monthLabels = {}
  weeks.forEach((week, wi) => {
    week.forEach(day => {
      if (day && day.slice(8) === '01') {
        const month = new Date(day).toLocaleString('default', { month: 'short' })
        monthLabels[wi] = month
      }
    })
  })

  return (
    <div className="bg-[#0d1526] border border-[#1e2d45] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold text-sm">Activity Heatmap</h3>
          <p className="text-gray-500 text-xs mt-0.5">Last 90 days</p>
        </div>
        <div className="flex gap-5 text-xs text-gray-500">
          <span><span className="text-white font-bold">{totalActivity}</span> total activities</span>
          <span><span className="text-white font-bold">{activeDays}</span> active days</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          <div className="flex flex-col justify-around pt-5 pr-2 gap-1">
            {[0, 2, 4, 6].map(i => (
              <div key={i} className="text-[10px] text-gray-600 h-3 flex items-center">
                {DAY_LABELS[i].slice(0, 1)}
              </div>
            ))}
          </div>

          <div>
            <div className="flex gap-1 mb-1 h-4">
              {weeks.map((_, wi) => (
                <div key={wi} className="w-3 text-[10px] text-gray-600 whitespace-nowrap overflow-visible">
                  {monthLabels[wi] || ''}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={day ? `${day}: ${counts[day] || 0} activities` : ''}
                      className="w-3 h-3 rounded-sm transition-transform hover:scale-125 cursor-default"
                      style={{
                        background: day ? heatColor(counts[day]) : 'transparent',
                        outline: day === today ? '1.5px solid #00d4ff' : 'none',
                        outlineOffset: '1px',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 justify-end">
        <span className="text-gray-600 text-[10px]">Less</span>
        {['#1a2235', '#0e4a6e', '#0a7abf', '#00b4d8', '#00d4ff'].map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-gray-600 text-[10px]">More</span>
      </div>
    </div>
  )
}

export default Heatmap