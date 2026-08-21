import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Magic Link States
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetStatus, setResetStatus] = useState(null)
  const [resetMessage, setResetMessage] = useState('')

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

  // Magic Link Reset Function
  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setResetMessage('Sending link...')
    
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/update-password`, 
    })

    if (error) {
      setResetStatus('error')
      setResetMessage(error.message)
    } else {
      setResetStatus('success')
      setResetMessage('Magic link sent! Check your inbox.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="bg-theme-card border border-theme-border rounded-2xl p-8 w-full max-w-md relative shadow-lg">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-theme-text">
            Prep<span className="text-brand-primary">Log</span>
          </h1>
          <p className="text-theme-textSec mt-2">Welcome back!</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          className="w-full border border-theme-border bg-theme-card text-theme-text py-3 rounded-xl font-semibold hover:border-brand-primary transition-all flex items-center justify-center gap-3 mb-6 shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#1e2d45]"></div>
          <span className="text-theme-textSec text-sm">or</span>
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
              className="w-full bg-theme-input border border-theme-border text-theme-text rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
            {/* Moved below the input and right-aligned */}
            <div className="flex justify-end mt-2">
              <button 
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-sm text-theme-textSec hover:text-brand-primary transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-2 shadow-md"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-theme-textSec text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-primary hover:underline font-medium">
            Sign up free
          </Link>
        </p>

      </div>

      {/* Magic Link Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-theme-card border border-theme-border p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-theme-text mb-2">Reset Password</h3>
            <p className="text-sm text-theme-textSec mb-6">
              Enter your email and we'll send you a secure magic link to reset your password.
            </p>
            
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-theme-input border border-theme-border text-theme-text rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all mb-4"
              />
              
              {resetMessage && (
                <p className={`text-sm mb-4 ${resetStatus === 'error' ? 'text-red-500' : 'text-brand-primary'}`}>
                  {resetMessage}
                </p>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetModalOpen(false)
                    setResetMessage('')
                    setResetEmail('')
                  }}
                  className="flex-1 py-3 rounded-xl border border-theme-border text-theme-textSec hover:bg-[#1a2235] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-primary text-white font-bold hover:opacity-90 transition-all shadow-md"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
