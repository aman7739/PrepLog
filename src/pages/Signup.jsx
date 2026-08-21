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
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="bg-theme-card border border-theme-border rounded-2xl p-8 w-full max-w-md text-center shadow-lg">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-theme-text text-2xl font-bold mb-3">Check your email!</h2>
          <p className="text-theme-textSec">
            We sent a confirmation link to <span className="text-brand-primary">{email}</span>
          </p>
          <p className="text-theme-textSec text-sm mt-3">
            Click the link to activate your account
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 border border-theme-border text-theme-text px-6 py-3 rounded-xl hover:border-brand-primary transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="bg-theme-card border border-theme-border rounded-2xl p-8 w-full max-w-md shadow-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-theme-text">
            Prep<span className="text-brand-primary">Log</span>
          </h1>
          <p className="text-theme-textSec mt-2">Create your free account</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          className="w-full border border-theme-border bg-theme-card text-theme-text py-3 rounded-xl font-semibold hover:border-brand-primary transition-all flex items-center justify-center gap-3 mb-6 shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google Logo" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#1e2d45]"></div>
          <span className="text-theme-textSec text-sm">or</span>
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
            <label className="text-theme-textSec text-sm mb-2 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aman Kumar"
              required
              className="w-full bg-theme-input border border-theme-border text-theme-text rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>

          {/* ✅ NEW: Username Field */}
          <div>
            <label className="text-theme-textSec text-sm mb-2 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())} // Prevents typing spaces
              placeholder="aman_codes"
              required
              minLength={3}
              maxLength={20}
              className="w-full bg-theme-input border border-theme-border text-theme-text rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>

          <div>
            <label className="text-theme-textSec text-sm mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-theme-input border border-theme-border text-theme-text rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>

          <div>
            <label className="text-theme-textSec text-sm mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-theme-input border border-theme-border text-theme-text rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-2 shadow-md"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-theme-textSec text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup

