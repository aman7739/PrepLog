import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'

function Notes() {
  const navigate = useNavigate()
  const { notes, loading, addNote, deleteNote, updateNote, stats } = useNotes()
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editContent, setEditContent] = useState('')

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!newNoteContent.trim()) return
    await addNote(newNoteContent)
    setNewNoteContent('')
  }

  const handleEditNote = async (noteId) => {
    if (!editContent.trim()) return
    await updateNote(noteId, editContent)
    setEditingNoteId(null)
    setEditContent('')
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-[#0a0e1a]/95 backdrop-blur border-b border-[#1e2d45] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            ← Dashboard
          </button>
          <h1 className="text-xl font-black text-white">
            Prep<span className="text-[#00d4ff]">Log</span>
            <span className="text-gray-500 font-normal text-base ml-2">/ Notes</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-white text-2xl font-black mb-2">Daily Learning Notes</h2>
          <p className="text-gray-400 text-sm">Capture your insights and learnings.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-[#00d4ff] font-black text-2xl">{stats.total}</div>
            <div className="text-gray-600 text-xs mt-1">Total Notes</div>
          </div>
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-green-400 font-black text-2xl">{stats.today}</div>
            <div className="text-gray-600 text-xs mt-1">Today</div>
          </div>
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-cyan-400 font-black text-2xl">{stats.thisWeek}</div>
            <div className="text-gray-600 text-xs mt-1">This Week</div>
          </div>
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="mb-8">
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-2xl p-5">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">
              Write a New Note
            </label>
            <textarea
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              placeholder="What did you learn today? Share your insights..."
              rows={4}
              className="w-full bg-[#111827] border border-[#1e2d45] text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#00d4ff] placeholder-gray-600 transition-all resize-none"
            />
            <button
              type="submit"
              disabled={!newNoteContent.trim()}
              className="mt-3 bg-[#00d4ff] hover:bg-[#00b4d8] disabled:opacity-40 text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              Save Note
            </button>
          </div>
        </form>

        {/* Notes List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4 animate-pulse h-24" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-[#0d1526] border border-[#1e2d45]/50 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-white font-bold mb-2">No notes yet</h3>
            <p className="text-gray-500 text-sm">Start writing your first note!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div
                key={note.id}
                className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4"
              >
                {editingNoteId === note.id ? (
                  // Edit Mode
                  <div>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={4}
                      className="w-full bg-[#111827] border border-[#00d4ff]/40 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#00d4ff] resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNote(note.id)}
                        className="text-xs bg-[#00d4ff] text-black px-4 py-2 rounded-lg hover:bg-[#00b4d8] transition-all font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="text-xs border border-[#1e2d45] text-gray-400 px-4 py-2 rounded-lg hover:border-gray-500 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <p className="text-white whitespace-pre-wrap text-sm leading-relaxed mb-3">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs">
                        {new Date(note.created_at).toLocaleDateString('en-IN')}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingNoteId(note.id)
                            setEditContent(note.content)
                          }}
                          className="text-gray-500 hover:text-[#00d4ff] transition-colors text-xs"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notes


