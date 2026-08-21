import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlatforms } from '../hooks/usePlatforms'

const PLATFORMS = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    icon: '🟨',
    color: 'text-yellow-400',
    border: 'border-yellow-400/30',
    bg: 'bg-yellow-400/5',
    placeholder: 'your-leetcode-username',
    url: 'https://leetcode.com',
    profileUrl: (u) => `https://leetcode.com/u/${u}`
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    color: 'text-brand-primary',
    border: 'border-theme-border',
    bg: 'bg-brand-black',
    placeholder: 'your-github-username',
    url: 'https://github.com',
    profileUrl: (u) => `https://github.com/${u}`
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    icon: '🔵',
    color: 'text-blue-400',
    border: 'border-blue-400/30',
    bg: 'bg-blue-400/5',
    placeholder: 'your-cf-handle',
    url: 'https://codeforces.com',
    profileUrl: (u) => `https://codeforces.com/profile/${u}`
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    icon: '👨‍🍳',
    color: 'text-amber-600',
    border: 'border-amber-600/30',
    bg: 'bg-amber-600/5',
    placeholder: 'your-codechef-username',
    url: 'https://www.codechef.com',
    profileUrl: (u) => `https://www.codechef.com/users/${u}`
  },
  {
    id: 'gfg',
    name: 'GeeksForGeeks',
    icon: '🟢',
    color: 'text-green-400',
    border: 'border-green-400/30',
    bg: 'bg-green-400/5',
    placeholder: 'your-gfg-username',
    url: 'https://www.geeksforgeeks.org',
    profileUrl: (u) => `https://www.geeksforgeeks.org/user/${u}`
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    icon: '💚',
    color: 'text-emerald-400',
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/5',
    placeholder: 'your-hackerrank-username',
    url: 'https://www.hackerrank.com',
    profileUrl: (u) => `https://www.hackerrank.com/profile/${u}`
  },
]

function cleanUsername(raw) {
  return raw
    .trim()
    .replace(/https?:\/\/(www\.)?leetcode\.com\/u\//i, '')
    .replace(/https?:\/\/(www\.)?leetcode\.com\//i, '')
    .replace(/https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/https?:\/\/(www\.)?codeforces\.com\/profile\//i, '')
    .replace(/https?:\/\/(www\.)?codechef\.com\/users\//i, '')
    .replace(/https?:\/\/(www\.)?geeksforgeeks\.org\/profile\//i, '')
    .replace(/https?:\/\/(www\.)?geeksforgeeks\.org\/user\//i, '')
    .replace(/https?:\/\/(www\.)?geeksforgeeks\.org\//i, '')
    .replace(/https?:\/\/(www\.)?hackerrank\.com\/profile\//i, '')
    .replace(/https?:\/\/(www\.)?hackerrank\.com\//i, '')
    .replace(/\/+$/, '')
    .trim()
}

function PlatformCard({ platform, connected, stats, onSave, onSync, onDelete, syncing }) {
  const [username, setUsername] = useState(connected?.username || '')
  const [editing, setEditing] = useState(!connected)
  const [confirming, setConfirming] = useState(false)

  const handleSave = async () => {
    if (!username.trim()) return
    await onSave(platform.id, cleanUsername(username))
    setEditing(false)
  }

  const handleDisconnect = async () => {
    await onDelete(platform.id)
    setConfirming(false)
    setEditing(true)
    setUsername('')
  }

  return (
    <div className={`bg-brand-dark border ${connected ? platform.border : 'border-theme-border'} rounded-2xl p-5 transition-all`}>
      
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">{platform.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-sm ${connected ? platform.color : 'text-theme-text'}`}>
              {platform.name}
            </h3>
            {connected && !editing && (
              <p className="text-theme-textSec text-xs truncate">@{connected.username}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connected && (
            <span className="flex-shrink-0 text-[10px] bg-green-400/10 text-green-400 px-2 py-1 rounded-full font-bold border border-green-400/20">
              ✓
            </span>
          )}
          <a 
             href={connected && !editing ? platform.profileUrl(connected.username) : platform.url} 
             target="_blank" 
             rel="noopener noreferrer"
             title={`Visit ${platform.name}`}
             className="text-xs border border-theme-border text-theme-textSec px-2 py-1 rounded-md hover:border-brand-primary hover:text-brand-primary transition-all flex items-center gap-1 bg-brand-black shadow-sm"
          >
             Visit <span className="text-[10px]">↗</span>
          </a>
        </div>
      </div>

      {/* Edit / Disconnect buttons */}
      {connected && !editing && !confirming && (
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setEditing(true)}
            className="text-xs border border-theme-border text-theme-textSec px-3 py-1.5 rounded-lg hover:border-brand-primary/40 hover:text-brand-primary transition-all"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setConfirming(true)}
            className="text-xs border border-theme-border text-theme-textSec px-3 py-1.5 rounded-lg hover:border-red-500/40 hover:text-red-400 transition-all"
          >
            🔌 Disconnect
          </button>
        </div>
      )}

      {/* Disconnect confirmation */}
      {confirming && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-3">
          <p className="text-red-400 text-xs mb-2 font-semibold">
            Remove {platform.name}?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-400 text-theme-text text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              Yes, Remove
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="border border-theme-border text-theme-textSec text-xs px-3 py-1.5 rounded-lg hover:border-gray-500 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      {editing && !confirming && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder={platform.placeholder}
            className="flex-1 dark:bg-[#1F1F1F] bg-[#FAEDE5] border border-theme-border text-theme-text text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-brand-primary transition-all placeholder-gray-500"
          />
          <button
            onClick={handleSave}
            disabled={!username.trim()}
            className="bg-brand-primary hover:opacity-90 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
          >
            Save
          </button>
          {connected && (
            <button
              onClick={() => { setEditing(false); setUsername(connected.username) }}
              className="border border-theme-border text-theme-textSec px-3 py-2 rounded-xl text-sm hover:border-red-500/40 hover:text-red-400 transition-all"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Stats Block */}
      {connected && stats && !editing && !confirming && (
        <div className={`${platform.bg} rounded-xl p-3 mb-3`}>
          <PlatformStats platformId={platform.id} stats={stats} color={platform.color} />
        </div>
      )}

      {/* Sync row */}
      {connected && !editing && !confirming && (
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-[10px]">
            {connected.last_synced
              ? `Synced ${new Date(connected.last_synced).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
              : 'Never synced'}
          </span>
          <button
            onClick={() => onSync(platform.id, connected.username)}
            disabled={syncing === platform.id}
            className="text-xs text-brand-primary hover:underline disabled:opacity-40 transition-all"
          >
            {syncing === platform.id ? '⏳ Syncing...' : '🔄 Sync Stats'}
          </button>
        </div>
      )}

      {/* Not connected state */}
      {!connected && !editing && (
        <div className="text-gray-600 text-xs">Not connected</div>
      )}
    </div>
  )
}

function PlatformStats({ platformId, stats, color }) {
  if (!stats) return null

  if (platformId === 'leetcode') {
    return (
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className={`text-lg font-black ${color}`}>{stats.totalSolved || 0}</div>
          <div className="text-gray-600 text-[10px]">Total</div>
        </div>
        <div>
          <div className="text-lg font-black text-yellow-400">{stats.mediumSolved || 0}</div>
          <div className="text-gray-600 text-[10px]">Medium</div>
        </div>
        <div>
          <div className="text-lg font-black text-red-400">{stats.hardSolved || 0}</div>
          <div className="text-gray-600 text-[10px]">Hard</div>
        </div>
      </div>
    )
  }

  if (platformId === 'github') {
    return (
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className={`text-lg font-black ${color}`}>{stats.public_repos || 0}</div>
          <div className="text-gray-600 text-[10px]">Repos</div>
        </div>
        <div>
          <div className="text-lg font-black text-purple-400">{stats.followers || 0}</div>
          <div className="text-gray-600 text-[10px]">Followers</div>
        </div>
        <div>
          <div className="text-lg font-black text-brand-primary">{stats.following || 0}</div>
          <div className="text-gray-600 text-[10px]">Following</div>
        </div>
      </div>
    )
  }

  if (platformId === 'codeforces') {
    return (
      <div className="grid grid-cols-2 gap-2 text-center">
        <div>
          <div className={`text-lg font-black ${color}`}>{stats.rating || 0}</div>
          <div className="text-gray-600 text-[10px]">Rating</div>
        </div>
        <div>
          <div className="text-lg font-black text-purple-400 capitalize">{stats.rank || '—'}</div>
          <div className="text-gray-600 text-[10px]">Rank</div>
        </div>
      </div>
    )
  }

  if (platformId === 'codechef') {
    return (
      <div className="grid grid-cols-1 gap-2 text-center">
        <div>
          <div className={`text-lg font-black ${color}`}>{stats.rating || 0}</div>
          <div className="text-gray-600 text-[10px]">Rating</div>
        </div>
      </div>
    )
  }

  // 🚀 UPDATED: GFG UI Block
  if (platformId === 'gfg') {
    return (
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className={`text-lg font-black ${color}`}>{stats.codingScore || 0}</div>
          <div className="text-gray-600 text-[10px]">Score</div>
        </div>
        <div>
          <div className="text-lg font-black text-green-300">{stats.totalSolved || 0}</div>
          <div className="text-gray-600 text-[10px]">Solved</div>
        </div>
        <div>
          <div className="text-lg font-black text-theme-text capitalize">{stats.rank || '—'}</div>
          <div className="text-gray-600 text-[10px]">Rank</div>
        </div>
      </div>
    )
  }

  if (platformId === 'hackerrank') {
    const badgeCount = stats.badges?.length || 0;
    const topBadge = badgeCount > 0 ? stats.badges[0].name : 'No Badges';
    
    return (
      <div className="grid grid-cols-2 gap-2 text-center">
        <div>
          <div className={`text-lg font-black ${color}`}>
            {stats.total_score || 0}
          </div>
          <div className="text-gray-600 text-[10px]">
            Score
          </div>
        </div>
        <div>
          <div className={`text-lg font-black ${badgeCount > 0 ? 'text-yellow-400' : 'text-theme-textSec'}`}>
            {badgeCount} 🏆
          </div>
          <div className="text-gray-600 text-[10px] truncate" title={topBadge}>
            {badgeCount > 0 ? `${stats.badges[0].stars}★ ${topBadge}` : 'None'}
          </div>
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="text-center py-1">
      <div className={`text-sm font-bold ${color}`}>Connected ✓</div>
      <div className="text-gray-600 text-[10px]">Auto-sync coming soon</div>
    </div>
  )
}

function Platforms() {
  const navigate = useNavigate()
  const { platforms, statsMap, loading, savePlatform, syncPlatform, syncing, deletePlatform } = usePlatforms()

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-brand-black/95 backdrop-blur border-b border-theme-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-theme-textSec hover:text-theme-text transition-colors text-sm"
          >
            ← Dashboard
          </button>
          <h1 className="text-xl font-black text-theme-text">
            Prep<span className="text-brand-primary">Log</span>
            <span className="text-theme-textSec font-normal text-base ml-2">/ Platforms</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-theme-text text-2xl font-black mb-2">Connect Platforms</h2>
          <p className="text-theme-textSec text-sm">Link your coding profiles to track stats automatically.</p>
        </div>

        {/* Connected count */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl px-4 py-2">
            <span className="text-brand-primary font-bold">{platforms.length}</span>
            <span className="text-theme-textSec text-sm ml-1">/ {PLATFORMS.length} connected</span>
          </div>
          {platforms.length > 0 && (
            <div className="flex gap-1">
              {platforms.map(p => {
                const meta = PLATFORMS.find(x => x.id === p.platform)
                return meta ? (
                  <span key={p.id} title={meta.name} className="text-lg">{meta.icon}</span>
                ) : null
              })}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-brand-dark border border-theme-border rounded-2xl p-5 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORMS.map(platform => {
              const connected = platforms.find(p => p.platform === platform.id)
              const stats = statsMap[platform.id]
              return (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  connected={connected}
                  stats={stats}
                  onSave={savePlatform}
                  onSync={syncPlatform}
                  onDelete={deletePlatform}
                  syncing={syncing}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Platforms
