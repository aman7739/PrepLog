function BadgeDisplay({ badges }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-gray-400 text-sm">No badges yet</div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <div
          key={badge.badge_type}
          className="bg-[#0f1729] border border-[#1e2d45] rounded-lg px-3 py-2 flex items-center gap-2 text-sm hover:border-[#00d4ff]/40 transition-all"
          title={`Earned on ${new Date(badge.earned_at).toLocaleDateString()}`}
        >
          <span className="text-lg">{getBadgeEmoji(badge.badge_type)}</span>
          <span className="font-medium">{getBadgeName(badge.badge_type)}</span>
        </div>
      ))}
    </div>
  )
}

// Helper functions
function getBadgeEmoji(badgeType) {
  const emojis = {
    first_roadmap: '🎯',
    ten_topics: '📚',
    fifty_topics: '🌟',
    hundred_topics: '💎',
    week_streak: '🔥',
    month_streak: '⚡',
    first_fork: '🍴',
    community_star: '⭐'
  }
  return emojis[badgeType] || '🏅'
}

function getBadgeName(badgeType) {
  const names = {
    first_roadmap: 'First Roadmap',
    ten_topics: '10 Topics',
    fifty_topics: '50 Topics',
    hundred_topics: '100 Topics',
    week_streak: '7 Day Streak',
    month_streak: '30 Day Streak',
    first_fork: 'First Fork',
    community_star: 'Community Star'
  }
  return names[badgeType] || badgeType.replace('_', ' ')
}

export default BadgeDisplay

