import { useState, useMemo } from 'react'

function getLast90Days() {
  const days = []
  const today = new Date()
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    days.push(`${y}-${m}-${day}`)
  }
  return days
}

function getDaysForMonth(year, monthIndex) {
  const days = []
  const date = new Date(year, monthIndex, 1)
  while (date.getMonth() === monthIndex) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    days.push(`${y}-${m}-${d}`)
    date.setDate(date.getDate() + 1)
  }
  return days
}

function heatColor(count) {
  if (!count || count === 0) return 'var(--bg-input)'
  if (count === 1) return '#fed7aa'
  if (count === 2) return '#fb923c'
  if (count <= 4) return '#f97316'
  return '#ea580c'
}

function Heatmap({ counts = {} }) {
  const [filterMode, setFilterMode] = useState('90days')

  const days = useMemo(() => {
    if (filterMode === '90days') {
      return getLast90Days()
    } else {
      const [y, m] = filterMode.split('-')
      return getDaysForMonth(parseInt(y), parseInt(m) - 1)
    }
  }, [filterMode])

  const monthOptions = useMemo(() => {
    const opts = []
    const today = new Date()
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' })
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      opts.push({ label, val })
    }
    return opts
  }, [])

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const weeks = []
  let week = []
  
  // Safe parsing for local date object to get Day of Week without timezone shift
  const [firstY, firstM, firstD] = days[0].split('-')
  const firstDayOfWeek = new Date(parseInt(firstY), parseInt(firstM) - 1, parseInt(firstD)).getDay()
  
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

  // Calculate stats based on the currently selected timeframe
  let totalActivity = 0
  let activeDays = 0
  days.forEach(d => {
    if (counts[d]) {
      totalActivity += counts[d]
      activeDays++
    }
  })

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const monthLabels = {}
  weeks.forEach((week, wi) => {
    week.forEach(day => {
      if (day && day.slice(8) === '01') {
        const [y, m, d] = day.split('-')
        const month = new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleString('default', { month: 'short' })
        monthLabels[wi] = month
      }
    })
  })

  // If we are showing a single month, we should probably label the start of the month anyway
  if (filterMode !== '90days' && !monthLabels[0]) {
      const [y, m, d] = days[0].split('-')
      monthLabels[0] = new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleString('default', { month: 'short' })
  }

  return (
    <div className="bg-brand-dark border border-theme-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-theme-text font-bold text-sm">Activity Heatmap</h3>
          <select 
            value={filterMode} 
            onChange={e => setFilterMode(e.target.value)}
            className="mt-1 bg-transparent text-theme-text text-xs border border-theme-border rounded px-2 py-1 focus:outline-none focus:border-brand-primary cursor-pointer hover:border-theme-textSec transition-colors"
          >
            <option className="dark:bg-[#111111] dark:text-gray-100 bg-white text-gray-900" value="90days">Last 90 days</option>
            <optgroup label="By Month" className="dark:bg-[#111111] dark:text-gray-400 bg-white text-gray-500 font-bold">
              {monthOptions.map(o => (
                <option className="dark:bg-[#111111] dark:text-gray-100 bg-white text-gray-900" key={o.val} value={o.val}>{o.label}</option>
              ))}
            </optgroup>
          </select>
        </div>
        <div className="flex gap-5 text-xs text-theme-textSec">
          <span><span className="text-theme-text font-bold">{totalActivity}</span> total activities</span>
          <span><span className="text-theme-text font-bold">{activeDays}</span> active days</span>
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
                      className="w-3 h-3 rounded-sm border border-theme-border/50 transition-transform hover:scale-125 cursor-default shadow-sm"
                      style={{
                        background: day ? heatColor(counts[day]) : 'transparent',
                        outline: day === todayStr ? '1.5px solid var(--brand-primary)' : 'none',
                        outlineOffset: '1px',
                        borderColor: !day || (counts[day] || 0) === 0 ? 'var(--border-color)' : 'transparent',
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
        {['var(--bg-input)', '#fed7aa', '#fb923c', '#f97316', '#ea580c'].map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm border border-theme-border/50 shadow-sm" style={{ background: c }} />
        ))}
        <span className="text-gray-600 text-[10px]">More</span>
      </div>
    </div>
  )
}

export default Heatmap