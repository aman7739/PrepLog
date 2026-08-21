import { Link } from 'react-router-dom'
import { useActivityFeed } from '../hooks/useActivityFeed'

function ActivityFeed() {
  const { activities, loading } = useActivityFeed()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-theme-text text-xl">Loading activity feed...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black text-theme-text">
      {/* Header */}
      <div className="bg-brand-dark border-b border-theme-border p-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/dashboard" className="text-brand-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mt-4 bg-brand-primary bg-clip-text text-transparent">
            📰 Activity Feed
          </h1>
          <p className="text-theme-textSec mt-2">See what you and people you follow are up to</p>
        </div>
      </div>

      {/* Activity List */}
      <div className="max-w-4xl mx-auto p-6">
        {activities.length === 0 ? (
          <div className="bg-brand-dark border border-theme-border rounded-lg p-12 text-center">
            <p className="text-theme-textSec text-lg mb-4">No activity yet</p>
            <p className="text-theme-textSec text-sm">
              Follow other users to see their activity here, or start completing topics to create your own activity!
            </p>
            <Link
              to="/leaderboard"
              className="mt-6 inline-block px-6 py-3 bg-brand-primary rounded-lg font-medium hover:opacity-90 transition-all"
            >
              Browse Leaderboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-brand-dark border border-theme-border rounded-lg p-4 hover:border-brand-primary/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {activity.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        to={`/profile/${activity.profiles?.id}`}
                        className="font-bold text-theme-text hover:text-brand-primary transition-colors"
                      >
                        {activity.profiles?.full_name || 'Anonymous'}
                      </Link>
                      <span className="text-theme-textSec">·</span>
                      <span className="text-sm text-theme-textSec">{formatTime(activity.created_at)}</span>
                    </div>
                    <p className="text-theme-textSec">
                      {getActivityIcon(activity.action_type)} {activity.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper functions
function getActivityIcon(actionType) {
  const icons = {
    follow: '👤',
    complete_topic: '✅',
    start_roadmap: '🚀',
    fork_roadmap: '🍴',
    earn_badge: '🏆',
    comment: '💬',
    rate: '⭐'
  }
  return icons[actionType] || '📌'
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export default ActivityFeed

