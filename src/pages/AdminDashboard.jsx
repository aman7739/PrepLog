import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // --- NEW SECURITY STATES ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const ADMIN_SECRET = '2026'; // 🔒 Change this to your desired password!

  // --- DASHBOARD STATES ---
  const [activeTab, setActiveTab] = useState('overview'); 
  const [users, setUsers] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle Admin Password Submission
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_SECRET) {
      setIsAuthorized(true);
      setAuthError('');
      fetchAdminData(); // Only fetch data AFTER successful login
    } else {
      setAuthError('Incorrect Admin Password. Access Denied.');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (usersError) throw usersError;

      const { data: roadmapsData, error: roadmapsError } = await supabase
        .from('roadmap_templates')
        .select(`*, profiles:author_id (full_name, username)`)
        .order('created_at', { ascending: false });
      if (roadmapsError) throw roadmapsError;

      setUsers(usersData || []);
      setRoadmaps(roadmapsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoadmap = async (id) => {
    if (!window.confirm('Are you sure you want to delete this roadmap entirely?')) return;
    try {
      await supabase.from('roadmap_templates').delete().eq('id', id);
      setRoadmaps(roadmaps.filter(r => r.id !== id));
      alert('Roadmap deleted.');
    } catch (error) {
      console.error('Error deleting roadmap:', error);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center">Verifying session...</div>;
  }

  // 🔒 SECURITY LAYER: If not authorized, show the Password Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4">
        <div className="bg-[#0f1729] border border-[#1e2d45] rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-yellow-400 tracking-tight mb-2">⚡ Admin Access Required</h2>
            <p className="text-gray-400 text-sm">Please enter the master password to continue.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full bg-[#0a0e1a] border border-[#1e2d45] rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-all"
                autoFocus
              />
            </div>
            {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
            
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-3 bg-[#1e2d45] text-white rounded-lg font-bold hover:bg-[#2a3f5f] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition-all"
              >
                Unlock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 🔓 IF AUTHORIZED, SHOW THE DASHBOARD (Your existing code)
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Admin Navbar */}
      <div className="sticky top-0 z-10 bg-[#0d1526] border-b border-yellow-500/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-yellow-400">
            PrepLog <span className="text-white font-light text-lg">Admin Center</span>
          </h1>
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
            ← Exit to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-[#1e2d45]">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-bold transition-all ${activeTab === 'overview' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            📊 Platform Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-bold transition-all ${activeTab === 'users' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            👥 Manage Users ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab('roadmaps')}
            className={`pb-3 px-4 font-bold transition-all ${activeTab === 'roadmaps' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            🗺️ Manage Roadmaps ({roadmaps.length})
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f1729] p-6 rounded-xl border border-[#1e2d45]">
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Registered Users</h3>
              <p className="text-4xl font-black text-white">{users.length}</p>
            </div>
            <div className="bg-[#0f1729] p-6 rounded-xl border border-[#1e2d45]">
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Roadmaps Created</h3>
              <p className="text-4xl font-black text-[#00d4ff]">{roadmaps.length}</p>
            </div>
            <div className="bg-[#0f1729] p-6 rounded-xl border border-[#1e2d45]">
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Public Roadmaps</h3>
              <p className="text-4xl font-black text-[#FF6B9D]">{roadmaps.filter(r => r.is_public).length}</p>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-[#0f1729] rounded-xl border border-[#1e2d45] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1e2d45]/50 border-b border-[#1e2d45]">
                  <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Topics Done</th>
                  <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-[#1e2d45]/50 hover:bg-[#1e2d45]/20">
                    <td className="p-4">
                      <div className="font-bold text-white">{u.full_name || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">@{u.username}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-bold ${u.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-400'}`}>
                        {u.role?.toUpperCase() || 'USER'}
                      </span>
                    </td>
                    <td className="p-4 text-[#00d4ff] font-bold">{u.topics_completed || 0}</td>
                    <td className="p-4 text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ROADMAPS TAB */}
        {activeTab === 'roadmaps' && (
          <div className="bg-[#0f1729] rounded-xl border border-[#1e2d45] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1e2d45]/50 border-b border-[#1e2d45]">
                  <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Roadmap Title</th>
                  <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Author</th>
                  <th className="p-4 text-xs text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roadmaps.map(r => (
                  <tr key={r.id} className="border-b border-[#1e2d45]/50 hover:bg-[#1e2d45]/20">
                    <td className="p-4">
                      <div className="font-bold text-white">{r.icon} {r.title}</div>
                      <div className="text-sm text-gray-500">{r.category} • {r.difficulty}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {r.profiles?.full_name || 'System'}
                    </td>
                    <td className="p-4">
                      {r.is_public ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">PUBLIC</span>
                      ) : (
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded font-bold">PRIVATE</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => navigate(`/roadmap/${r.id}`)}
                        className="text-[#00d4ff] hover:underline text-sm mr-4"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => deleteRoadmap(r.id)}
                        className="text-red-400 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;