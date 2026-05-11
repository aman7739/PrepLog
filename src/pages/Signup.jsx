import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('') // ✅ Added username state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          username: username.toLowerCase().trim() // ✅ Send username to Supabase!
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
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

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4">
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-white text-2xl font-bold mb-3">Check your email!</h2>
          <p className="text-gray-400">
            We sent a confirmation link to <span className="text-[#00d4ff]">{email}</span>
          </p>
          <p className="text-gray-500 text-sm mt-3">
            Click the link to activate your account
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 border border-[#1e2d45] text-white px-6 py-3 rounded-xl hover:border-[#00d4ff] transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4">
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white">
            Prep<span className="text-[#00d4ff]">Log</span>
          </h1>
          <p className="text-gray-400 mt-2">Create your free account</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          className="w-full border border-[#1e2d45] text-white py-3 rounded-xl font-semibold hover:border-[#00d4ff] transition-all flex items-center justify-center gap-3 mb-6"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google Logo" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#1e2d45]"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-[#1e2d45]"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aman Kumar"
              required
              className="w-full bg-[#1a2235] border border-[#1e2d45] text-white rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>

          {/* ✅ NEW: Username Field */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())} // Prevents typing spaces
              placeholder="aman_codes"
              required
              minLength={3}
              maxLength={20}
              className="w-full bg-[#1a2235] border border-[#1e2d45] text-white rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>

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
              minLength={6}
              className="w-full bg-[#1a2235] border border-[#1e2d45] text-white rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#00d4ff] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00d4ff] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup

