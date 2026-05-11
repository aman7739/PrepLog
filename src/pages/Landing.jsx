import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-white mb-4">
          Prep<span className="text-[#00d4ff]">Log</span>
        </h1>
        <p className="text-xl text-gray-400 mb-2">
          Your Coding Prep. Tracked. All in One Place.
        </p>
        <p className="text-sm text-gray-500">
          LeetCode • GeeksForGeeks • CodeChef • Codeforces • GitHub • HackerRank
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        {[
          { icon: '📊', title: 'All Platforms', desc: 'Connect LeetCode, GFG, CodeChef, Codeforces, GitHub in one place' },
          { icon: '🔥', title: 'Streak Tracker', desc: 'Never lose your streak — daily activity heatmap like GitHub' },
          { icon: '🗺️', title: 'Roadmap Progress', desc: 'Phase-wise prep roadmap — track what is done and what is next' },
          { icon: '📝', title: 'Daily Tasks', desc: 'Add what you studied today — DSA, ML, Project, Cloud' },
          { icon: '💡', title: 'Daily Notes', desc: 'Save what you learned and what confused you every day' },
          { icon: '🎯', title: 'What is Next', desc: 'Always know what to study next — no confusion, no wasted time' },
        ].map((f, i) => (
          <div key={i} className="bg-[#111827] border border-[#1e2d45] rounded-xl p-6 hover:border-[#00d4ff] transition-all">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-white font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/signup')}
          className="bg-[#00d4ff] text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all text-lg"
        >
          Get Started Free
        </button>
        <button
          onClick={() => navigate('/login')}
          className="border border-[#1e2d45] text-white font-bold px-8 py-3 rounded-xl hover:border-[#00d4ff] transition-all text-lg"
        >
          Login
        </button>
      </div>

      <p className="text-gray-600 text-sm mt-8">
        Free forever • No credit card • Made for Indian students
      </p>
    </div>
  )
}

export default Landing