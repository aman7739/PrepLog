import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-theme-text mb-4">
            Prep<span className="text-brand-primary">Log</span>
          </h1>
          <p className="text-xl text-theme-textSec mb-2">
            Your Coding Prep. Tracked. All in One Place.
          </p>
          <p className="text-sm text-theme-textSec">
            LeetCode • GeeksForGeeks • CodeChef • Codeforces • GitHub • HackerRank
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
          {[
            { icon: '🎯', title: 'All Platforms', desc: 'Connect LeetCode, GFG, CodeChef, Codeforces, GitHub in one place' },
            { icon: '🔥', title: 'Streak Tracker', desc: 'Never lose your streak - daily activity heatmap like GitHub' },
            { icon: '🗺️', title: 'Roadmap Progress', desc: 'Phase-wise prep roadmap - track what is done and what is next' },
            { icon: '✅', title: 'Daily Tasks', desc: 'Add what you studied today - DSA, ML, Project, Cloud' },
            { icon: '📝', title: 'Daily Notes', desc: 'Save what you learned and what confused you every day' },
            { icon: '🧭', title: 'What is Next', desc: 'Always know what to study next - no confusion, no wasted time' },
          ].map((f, i) => (
            <div key={i} className="bg-[#111827] border border-theme-border rounded-xl p-6 hover:border-brand-primary transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-theme-text font-bold mb-2">{f.title}</h3>
              <p className="text-theme-textSec text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/signup')}
            className="bg-brand-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all text-lg"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-theme-border text-theme-text font-bold px-8 py-3 rounded-xl hover:border-brand-primary transition-all text-lg"
          >
            Login
          </button>
        </div>

        <p className="text-gray-600 text-sm mt-8 mb-24">
          Free forever • No credit card • Made for Indian students
        </p>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Landing