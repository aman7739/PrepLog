import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import FollowButton from '../components/FollowButton'

function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  
  const userId = id || currentUser?.id

  const [profile, setProfile] = useState(null)
  const [roadmaps, setRoadmaps] = useState([])
  const [stats, setStats] = useState({ topics: 0, tasks: 0, streak: 0 })
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('Overview')
  
  // Edit & Settings Modes
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)
  
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    education: '',
    age: '',
    experience: '',
    qualifications: ''
  })

  const isOwnProfile = currentUser?.id === userId

  useEffect(() => {
    if (userId) {
      fetchProfile()
      fetchRoadmaps()
      fetchStats()
      fetchBadges()
    }
  }, [userId])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      setProfile(data)
      setEditForm({
        full_name: data.full_name || '',
        bio: data.bio || '',
        education: data.education || '',
        age: data.age || '',
        experience: data.experience || '',
        qualifications: data.qualifications || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoadmaps = async () => {
    try {
      const { data } = await supabase
        .from('user_roadmaps')
        .select(`
          id,
          roadmap_templates (
            id, title, icon, difficulty, category
          )
        `)
        .eq('user_id', userId)
      setRoadmaps(data || [])
    } catch (error) {
      console.error('Error fetching roadmaps:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const { count: topicsCount } = await supabase
        .from('roadmap_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('done', true)

      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('done', true)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('streak')
        .eq('id', userId)
        .single()

      setStats({
        topics: topicsCount || 0,
        tasks: tasksCount || 0,
        streak: profileData?.streak || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchBadges = async () => {
    try {
      const { data } = await supabase
        .from('user_badges')
        .select('badge_type, earned_at')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
      setBadges(data || [])
    } catch (error) {
      console.error('Error fetching badges:', error)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', userId)
      
      if (error) throw error
      setProfile({ ...profile, ...editForm })
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event) => {
    try {
      setUploadingAvatar(true)
      const file = event.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      setProfile({ ...profile, avatar_url: publicUrl })
      toast.success('Avatar updated!')
    } catch (error) {
      toast.error('Error uploading avatar')
      console.error(error)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleStartChat = async () => {
    if (!currentUser) return;
    try {
      const { data: existingConvo, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${currentUser.id})`)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingConvo) {
        navigate('/chat');
        return;
      }

      const { data: newConvo, error: insertError } = await supabase
        .from('conversations')
        .insert({ user1_id: currentUser.id, user2_id: userId })
        .select('id')
        .single();

      if (insertError) throw insertError;
      navigate('/chat');
    } catch (err) {
      console.error('Error starting chat:', err);
      toast.error('Could not start chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-theme-text text-xl">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-theme-text text-xl">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-brand-dark border border-theme-border rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-theme-text mb-4">Settings</h3>
              <div className="space-y-2">
                <button onClick={() => { setShowSettings(false); navigate('/update-password'); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-brand-muted text-theme-text transition-colors">
                  Change Password
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowSettings(false)} className="px-6 py-2 bg-brand-muted text-theme-text font-bold rounded-xl hover:opacity-80 transition-opacity">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-brand-dark rounded-2xl p-8 mb-6 relative border border-theme-border">
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-24 h-24 rounded-full object-cover border-2 border-brand-primary/20" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-brand-muted flex items-center justify-center text-3xl font-bold text-theme-text border-2 border-brand-primary/20">
                  {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {isOwnProfile && (
                <div 
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </div>

            {/* User Info */}
            <div className="flex-1 mt-2 md:mt-0">
              <h1 className="text-2xl font-bold text-theme-text mb-2">{profile.full_name}</h1>
              
              <div className="inline-block border border-brand-primary text-brand-primary px-4 py-1 rounded-full text-xs font-semibold mb-4">
                Student
              </div>

              {profile.bio && (
                <p className="text-theme-textSec text-sm mb-4 max-w-2xl">{profile.bio}</p>
              )}

              <div className="flex items-center gap-2 text-theme-textSec text-sm font-medium">
                <span>{profile.followers_count || 0} Followers</span>
                <span>·</span>
                <span>{profile.following_count || 0} Following</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 absolute top-8 right-8">
              {isOwnProfile ? (
                <>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-brand-primary text-black font-semibold px-6 py-2 rounded-xl text-sm transition-all hover:opacity-90"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                  <button onClick={() => setShowSettings(true)} className="p-2 border border-theme-border rounded-xl text-theme-textSec hover:text-theme-text hover:bg-brand-muted transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <FollowButton userId={userId} userName={profile.full_name} />
                  <button 
                    onClick={handleStartChat}
                    className="bg-brand-primary text-black px-5 py-2 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all text-sm"
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-8 mt-10 border-b border-theme-border">
            {['Overview', 'Coding Score', 'Posts', 'Mentions', 'Bookmarks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab ? 'text-brand-primary' : 'text-theme-textSec hover:text-theme-text'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand-primary"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'Overview' && (
            isEditing ? (
              <div className="bg-brand-dark border border-theme-border rounded-2xl p-8">
                <h2 className="text-xl font-bold text-theme-text mb-6">Edit Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-theme-textSec text-xs font-bold mb-2 uppercase">Full Name</label>
                    <input type="text" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} className="w-full bg-brand-black border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-brand-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-theme-textSec text-xs font-bold mb-2 uppercase">Age</label>
                    <input type="text" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} className="w-full bg-brand-black border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-brand-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-theme-textSec text-xs font-bold mb-2 uppercase">Education</label>
                    <input type="text" value={editForm.education} onChange={e => setEditForm({...editForm, education: e.target.value})} className="w-full bg-brand-black border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-brand-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-theme-textSec text-xs font-bold mb-2 uppercase">Qualifications</label>
                    <input type="text" value={editForm.qualifications} onChange={e => setEditForm({...editForm, qualifications: e.target.value})} className="w-full bg-brand-black border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-brand-primary outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-theme-textSec text-xs font-bold mb-2 uppercase">About Me / Bio</label>
                    <textarea rows="3" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full bg-brand-black border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-brand-primary outline-none resize-none"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-theme-textSec text-xs font-bold mb-2 uppercase">Experience</label>
                    <textarea rows="3" value={editForm.experience} onChange={e => setEditForm({...editForm, experience: e.target.value})} className="w-full bg-brand-black border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-brand-primary outline-none resize-none"></textarea>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-xl font-bold text-theme-text hover:bg-brand-muted transition-colors">Cancel</button>
                  <button onClick={handleSaveProfile} disabled={saving} className="bg-brand-primary text-black px-8 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity">{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Basic Information Card */}
                <div className="bg-brand-dark border border-theme-border rounded-2xl p-6 relative">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-theme-text font-bold text-sm">Basic Information</h3>
                    {isOwnProfile && (
                      <button onClick={() => setIsEditing(true)} className="text-theme-textSec hover:text-brand-primary transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                    )}
                  </div>
                  <div className="space-y-4 text-sm text-theme-textSec">
                    <p><span className="text-theme-text font-medium">Name:</span> {profile.full_name}</p>
                    <p><span className="text-theme-text font-medium">Education:</span> {profile.education || '-'}</p>
                    <p><span className="text-theme-text font-medium">Age:</span> {profile.age || '-'}</p>
                  </div>
                </div>

                {/* About Me / Bio Card */}
                <div className="bg-brand-dark border border-theme-border rounded-2xl p-6">
                  <h3 className="text-theme-text font-bold text-sm mb-6">About Me / Bio</h3>
                  <p className="text-theme-textSec text-sm whitespace-pre-wrap leading-relaxed">{profile.bio || '-'}</p>
                </div>

                {/* Experience Card */}
                <div className="bg-brand-dark border border-theme-border rounded-2xl p-6">
                  <h3 className="text-theme-text font-bold text-sm mb-6">Experience</h3>
                  <p className="text-theme-textSec text-sm whitespace-pre-wrap leading-relaxed">{profile.experience || '-'}</p>
                </div>

                {/* Qualifications Card */}
                <div className="bg-brand-dark border border-theme-border rounded-2xl p-6">
                  <h3 className="text-theme-text font-bold text-sm mb-6">Qualifications</h3>
                  <p className="text-theme-textSec text-sm whitespace-pre-wrap leading-relaxed">{profile.qualifications || '-'}</p>
                </div>

              </div>
            )
          )}

          {activeTab === 'Coding Score' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-brand-dark border border-theme-border rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-brand-primary mb-2">{stats.topics}</div>
                  <div className="text-theme-textSec text-sm font-medium">Topics Completed</div>
                </div>
                <div className="bg-brand-dark border border-theme-border rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-theme-text mb-2">{stats.tasks}</div>
                  <div className="text-theme-textSec text-sm font-medium">Tasks Completed</div>
                </div>
                <div className="bg-brand-dark border border-theme-border rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-brand-primary mb-2">{stats.streak} ⚡</div>
                  <div className="text-theme-textSec text-sm font-medium">Day Streak</div>
                </div>
              </div>

              {badges.length > 0 && (
                <div className="bg-brand-dark border border-theme-border rounded-2xl p-6">
                  <h3 className="text-theme-text font-bold text-sm mb-4">🎖️ Earned Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.badge_type}
                        className="bg-brand-muted border border-theme-border rounded-xl px-4 py-2 text-sm text-theme-text flex items-center gap-2 font-medium"
                      >
                        <span className="text-lg">{getBadgeEmoji(badge.badge_type)}</span>
                        {getBadgeName(badge.badge_type)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(activeTab === 'Posts' || activeTab === 'Mentions' || activeTab === 'Bookmarks') && (
            <div className="bg-brand-dark border border-theme-border rounded-2xl p-12 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-theme-text font-bold text-lg mb-2">Coming Soon</h3>
              <p className="text-theme-textSec text-sm">This section is currently under development.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function getBadgeEmoji(badgeType) {
  const emojis = {
    first_roadmap: '🗺️',
    ten_topics: '🎯',
    fifty_topics: '🔥',
    hundred_topics: '👑',
    week_streak: '⚡',
    month_streak: '🌟',
    first_fork: '🌿',
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
  return names[badgeType] || badgeType
}

export default Profile