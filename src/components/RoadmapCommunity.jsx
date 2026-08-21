import toast from 'react-hot-toast';
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function RoadmapCommunity({ templateId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [userRating, setUserRating] = useState(0)

  useEffect(() => {
    if (templateId) {
      fetchComments()
      fetchUserRating()
    }
  }, [templateId, user])

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('roadmap_comments')
      .select(`
        id, content, created_at,
        profiles:user_id ( full_name )
      `)
      .eq('template_id', templateId)
      .order('created_at', { ascending: false })
    
    if (error) console.error("Error fetching comments:", error)
    if (data) setComments(data)
  }

  const fetchUserRating = async () => {
    if (!user) return
    const { data } = await supabase
      .from('roadmap_ratings')
      .select('rating')
      .eq('user_id', user.id)
      .eq('template_id', templateId)
      .maybeSingle()
      
    if (data) setUserRating(data.rating)
  }

  const handleRate = async (stars) => {
    if (!user) return toast.error('Please login to rate roadmaps')
    
    try {
      const { error } = await supabase
        .from('roadmap_ratings')
        .upsert({ 
          user_id: user.id, 
          template_id: templateId, 
          rating: stars 
        }, { onConflict: 'user_id, template_id' })

      if (error) throw error
      setUserRating(stars)
    } catch (error) {
      console.error('Error rating:', error)
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to comment')
    if (!newComment.trim()) return

    try {
      const { error } = await supabase
        .from('roadmap_comments')
        .insert({
          user_id: user.id,
          template_id: templateId,
          content: newComment.trim()
        })

      if (error) throw error
      
      toast.success('Comment posted! 💬')
      setNewComment('')
      fetchComments() 
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Error posting comment! Check console.')
    }
  }

  return (
    <div className="mt-12 border-t border-theme-border pt-8">
      <h3 className="text-2xl font-bold text-theme-text mb-6">Community Discussion</h3>

      {/* ⭐ Rating Section */}
      <div className="bg-brand-dark p-6 rounded-xl border border-theme-border mb-8 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-theme-text">Rate this Roadmap</h4>
          <p className="text-sm text-theme-textSec">Help others know if this is a good learning path!</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              className={`text-3xl transition hover:scale-110 ${
                star <= userRating ? 'text-yellow-400' : 'text-gray-600'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* 💬 Add Comment Section */}
      <form onSubmit={submitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts, tips, or questions about this roadmap..."
          className="w-full bg-brand-dark border border-theme-border rounded-lg p-4 text-theme-text focus:border-[#FF6B9D] focus:outline-none resize-none h-24 mb-3"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-brand-primary rounded-lg font-bold text-theme-text hover:opacity-90 transition"
        >
          Post Comment
        </button>
      </form>

      {/* 📝 Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-theme-textSec text-center py-4">No comments yet. Be the first to start the discussion!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-brand-dark p-4 rounded-lg border border-theme-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-brand-primary">
                  {comment.profiles?.full_name || 'Anonymous'}
                </span>
                <span className="text-xs text-theme-textSec">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-theme-textSec">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}