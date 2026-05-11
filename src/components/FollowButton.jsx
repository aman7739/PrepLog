import { useFollow } from '../hooks/useFollow'
import { useAuth } from '../context/AuthContext'

function FollowButton({ userId, userName }) {
  const { user } = useAuth()
  const { isFollowing, followersCount, followingCount, toggleFollow, loading } = useFollow(userId)

  // Don't show follow button on own profile
  if (!user || user.id === userId) {
    return (
      <div className="flex gap-4 text-sm text-gray-400">
        <span><span className="font-bold text-white">{followersCount}</span> Followers</span>
        <span><span className="font-bold text-white">{followingCount}</span> Following</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          isFollowing
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] text-white hover:opacity-90'
        } disabled:opacity-50`}
      >
        {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
      </button>
      <div className="flex gap-4 text-sm text-gray-400">
        <span><span className="font-bold text-white">{followersCount}</span> Followers</span>
        <span><span className="font-bold text-white">{followingCount}</span> Following</span>
      </div>
    </div>
  )
}

export default FollowButton
