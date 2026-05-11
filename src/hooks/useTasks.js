import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const useTasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (err) {
      console.error('fetchTasks error:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  const addTask = async (text, category = 'general') => {
    if (!user || !text.trim()) return
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          text: text.trim(),
          category,
          done: false,
          date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      setTasks(prev => [data[0], ...prev])
      return data[0]
    } catch (err) {
      console.error('addTask error:', err)
    }
  }

  const toggleTask = async (taskId, isDone) => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ done: isDone })
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()

      if (error) throw error
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, done: isDone } : t))
      )
      return data[0]
    } catch (err) {
      console.error('toggleTask error:', err)
    }
  }

  const deleteTask = async (taskId) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id)

      if (error) throw error
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('deleteTask error:', err)
    }
  }

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.done).length,
    pending: tasks.filter(t => !t.done).length,
  }

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    stats,
  }
}