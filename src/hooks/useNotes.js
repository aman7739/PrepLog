import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useNotes = () => {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (err) {
      console.error('fetchNotes error:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotes()
  }, [user])

  const addNote = async (content) => {
    if (!user || !content.trim()) return
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          content: content.trim(),
          date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      setNotes(prev => [data[0], ...prev])
      return data[0]
    } catch (err) {
      console.error('addNote error:', err)
    }
  }

  const deleteNote = async (noteId) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id)

      if (error) throw error
      setNotes(prev => prev.filter(n => n.id !== noteId))
    } catch (err) {
      console.error('deleteNote error:', err)
    }
  }

  const updateNote = async (noteId, content) => {
    if (!user || !content.trim()) return
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ content: content.trim() })
        .eq('id', noteId)
        .eq('user_id', user.id)
        .select()

      if (error) throw error
      setNotes(prev =>
        prev.map(n => (n.id === noteId ? { ...n, content: content.trim() } : n))
      )
      return data[0]
    } catch (err) {
      console.error('updateNote error:', err)
    }
  }

  const getNotesByDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return notes.filter(n => {
      const noteDate = new Date(n.created_at).toISOString().split('T')[0]
      return noteDate === dateStr
    })
  }

  const getTodayNotes = () => {
    const today = new Date()
    return getNotesByDate(today)
  }

  const stats = {
    total: notes.length,
    today: getTodayNotes().length,
    thisWeek: notes.filter(n => {
      const noteDate = new Date(n.created_at)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return noteDate >= weekAgo
    }).length,
  }

  return {
    notes,
    loading,
    addNote,
    deleteNote,
    updateNote,
    getNotesByDate,
    getTodayNotes,
    stats,
  }
}

