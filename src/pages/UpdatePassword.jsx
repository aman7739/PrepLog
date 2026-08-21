import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase automatically parses the token from the URL and establishes a temporary session
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Recovery session active');
      }
    });
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // This securely updates the password for the user tied to the magic link
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMessage('Password updated successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login') // Or wherever your login route is
      }, 2500)
    }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="bg-[#111827] border border-theme-border rounded-2xl p-8 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-theme-text">
            Reset <span className="text-brand-primary">Password</span>
          </h2>
          <p className="text-theme-textSec mt-2">Enter your new password below.</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-xl text-sm">
              {message}
            </div>
          )}

          <div>
            <label className="text-theme-textSec text-sm mb-2 block">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-[#1a2235] border border-theme-border text-theme-text rounded-xl px-4 py-3 outline-none focus:border-brand-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

      </div>
    </div>
  )
}
