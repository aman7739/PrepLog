import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'

function Tasks() {
  const navigate = useNavigate()
  const { tasks, loading, addTask, toggleTask, deleteTask, stats } = useTasks()
  const [newTaskText, setNewTaskText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('general')

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    await addTask(newTaskText, selectedCategory)
    setNewTaskText('')
    setSelectedCategory('general')
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
            <span className="text-gray-500 font-normal text-base ml-2">/ Tasks</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-white text-2xl font-black mb-2">Daily Tasks</h2>
          <p className="text-gray-400 text-sm">Track your daily coding goals.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-[#00d4ff] font-black text-2xl">{stats.total}</div>
            <div className="text-gray-600 text-xs mt-1">Total</div>
          </div>
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-green-400 font-black text-2xl">{stats.done}</div>
            <div className="text-gray-600 text-xs mt-1">Done</div>
          </div>
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-yellow-400 font-black text-2xl">{stats.pending}</div>
            <div className="text-gray-600 text-xs mt-1">Pending</div>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-8">
          <div className="bg-[#0d1526] border border-[#1e2d45] rounded-2xl p-5">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">
              Add New Task
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="E.g., Solve 5 LeetCode problems..."
                className="flex-1 bg-[#111827] border border-[#1e2d45] text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#00d4ff] placeholder-gray-600 transition-all"
              />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-[#111827] border border-[#1e2d45] text-white text-sm px-3 py-3 rounded-xl focus:outline-none focus:border-[#00d4ff] transition-all"
              >
                <option value="general">General</option>
                <option value="leetcode">LeetCode</option>
                <option value="dsa">DSA</option>
                <option value="project">Project</option>
              </select>
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className="bg-[#00d4ff] hover:bg-[#00b4d8] disabled:opacity-40 text-black font-bold px-6 py-3 rounded-xl transition-all whitespace-nowrap"
              >
                Add Task
              </button>
            </div>
          </div>
        </form>

        {/* Tasks List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#0d1526] border border-[#1e2d45] rounded-xl p-4 animate-pulse h-20" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-[#0d1526] border border-[#1e2d45]/50 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-white font-bold mb-2">No tasks yet</h3>
            <p className="text-gray-500 text-sm">Create a task to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`bg-[#0d1526] border rounded-xl p-4 flex items-start gap-3 transition-all ${
                  task.done
                    ? 'border-green-400/20 opacity-60'
                    : 'border-[#1e2d45]'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id, !task.done)}
                  className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-1 transition-all ${
                    task.done
                      ? 'bg-green-400/20 border-green-400 text-green-400'
                      : 'border-[#1e2d45] hover:border-[#00d4ff]/40'
                  }`}
                >
                  {task.done && '✓'}
                </button>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold ${
                      task.done
                        ? 'text-gray-500 line-through'
                        : 'text-white'
                    }`}
                  >
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20">
                      {task.category}
                    </span>
                    <span className="text-gray-600 text-xs">
                      {new Date(task.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tasks


