import { Link } from 'react-router-dom'
import { useLeaderboard } from '../hooks/useLeaderboard'

function Leaderboard() {
  const { leaders, loading } = useLeaderboard()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="bg-[#0f1729] border-b border-[#1e2d45] p-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/dashboard" className="text-[#00d4ff] hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-400 mt-2">Top developers ranked by topics completed</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-6xl mx-auto p-6">
        {leaders.length === 0 ? (
          <div className="bg-[#0f1729] border border-[#1e2d45] rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No data available yet</p>
          </div>
        ) : (
          <div className="bg-[#0f1729] border border-[#1e2d45] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0a0e1a] border-b border-[#1e2d45]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Topics</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Streak</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Followers</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Badges</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader, index) => (
                  <tr
                    key={leader.id}
                    className={`border-b border-[#1e2d45] hover:bg-[#0a0e1a]/50 transition-all ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        <span className={`text-lg font-bold ${index < 3 ? 'text-yellow-400' : 'text-white'}`}>
                          #{leader.rank}
                        </span>
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] flex items-center justify-center text-lg font-bold">
                          {leader.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-white">{leader.full_name || 'Anonymous'}</div>
                          {/* ✅ NEW: Replaced Email with Username */}
                          <div className="text-sm text-[#00d4ff]">@{leader.username || 'unknown'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Topics */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-xl font-bold text-[#00d4ff]">{leader.topics_completed || 0}</div>
                    </td>

                    {/* Streak */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-lg font-bold text-yellow-400">{leader.streak || 0} 🔥</div>
                    </td>

                    {/* Followers */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-lg font-bold text-[#FF6B9D]">{leader.followers_count || 0}</div>
                    </td>

                    {/* Badges */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        {leader.badges?.slice(0, 3).map((badge) => (
                          <span key={badge.badge_type} className="text-lg" title={badge.badge_type}>
                            {getBadgeEmoji(badge.badge_type)}
                          </span>
                        ))}
                        {leader.badges?.length > 3 && (
                          <span className="text-xs text-gray-400">+{leader.badges.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/profile/${leader.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] rounded-lg text-sm font-medium text-black hover:opacity-90 transition-all inline-block"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function
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

export default Leaderboard

