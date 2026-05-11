import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4">
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8 w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white">
            Prep<span className="text-[#00d4ff]">Log</span>
          </h1>
          <p className="text-gray-400 mt-2">Welcome back!</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          className="w-full border border-[#1e2d45] text-white py-3 rounded-xl font-semibold hover:border-[#00d4ff] transition-all flex items-center justify-center gap-3 mb-6"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#1e2d45]"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-[#1e2d45]"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-[#1a2235] border border-[#1e2d45] text-white rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#1a2235] border border-[#1e2d45] text-white rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#00d4ff] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#00d4ff] hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login