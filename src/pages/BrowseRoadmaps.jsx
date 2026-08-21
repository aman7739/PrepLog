import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useUserSearch } from '../hooks/useUserSearch';
import UserSearchCard from '../components/UserSearchCard';

function BrowseRoadmaps() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('roadmaps'); // 'roadmaps' or 'users'
  
  // Roadmap States
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Developer Search Hook
  const { users, loading: usersLoading, searchUsers } = useUserSearch();

  const categories = ['All', 'DSA', 'Web Development', 'Mobile', 'Cloud', 'DevOps', 'Database', 'Machine Learning', 'System Design', 'Other'];

  // Fetch Roadmaps
  useEffect(() => {
    if (activeTab === 'roadmaps') {
      fetchRoadmaps();
    }
  }, [filter, categoryFilter, activeTab]);

  // Debounced Developer Search
  useEffect(() => {
    if (activeTab === 'users') {
      const delayDebounceFn = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, activeTab]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('roadmap_templates')
        .select(`
          *,
          profiles:created_by (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .eq('is_draft', false);

      if (categoryFilter !== 'All') query = query.eq('category', categoryFilter);

      if (filter === 'trending') query = query.order('likes', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setRoadmaps(data || []);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoadmaps = roadmaps.filter(roadmap =>
    roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    roadmap.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = async (templateId, isLiked) => {
    if (!user) {
      toast.error('Please login to like roadmaps');
      return;
    }

    try {
      // 1. Optimistic UI Update
      setRoadmaps(currentRoadmaps => 
        currentRoadmaps.map(rm => {
          if (rm.id === templateId) {
            return { 
              ...rm, 
              likes: isLiked ? Math.max(0, (rm.likes || 0) - 1) : (rm.likes || 0) + 1 
            };
          }
          return rm;
        })
      );

      // 2. Database Operations with error logging
      if (isLiked) {
        const { error: err1 } = await supabase
          .from('roadmap_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('template_id', templateId);
        if (err1) console.error("Unlike delete error:", err1);
        
        const { data: template } = await supabase
          .from('roadmap_templates')
          .select('likes')
          .eq('id', templateId)
          .single();

        const { error: err2 } = await supabase
          .from('roadmap_templates')
          .update({ likes: Math.max(0, (template?.likes || 0) - 1) })
          .eq('id', templateId);
        if (err2) console.error("Unlike update error:", err2);

      } else {
        const { error: err1 } = await supabase
          .from('roadmap_likes')
          .insert({ user_id: user.id, template_id: templateId });
        if (err1) console.error("Like insert error:", err1);
        
        const { data: template } = await supabase
          .from('roadmap_templates')
          .select('likes')
          .eq('id', templateId)
          .single();

        const { error: err2 } = await supabase
          .from('roadmap_templates')
          .update({ likes: (template?.likes || 0) + 1 })
          .eq('id', templateId);
        if (err2) console.error("Like update error:", err2);
      }
      
    } catch (error) {
      console.error('Error toggling like:', error);
      fetchRoadmaps();
    }
  };

  const handleFork = async (templateId) => {
    if (!user) {
      toast.error('Please login to fork roadmaps');
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('user_roadmaps')
        .select('id')
        .eq('user_id', user.id)
        .eq('template_id', templateId)
        .maybeSingle();

      if (existing) {
        toast.success('You already have this roadmap!');
        return;
      }

      await supabase
        .from('user_roadmaps')
        .insert({ user_id: user.id, template_id: templateId });

      const { data: template } = await supabase
        .from('roadmap_templates')
        .select('forks')
        .eq('id', templateId)
        .single();

      await supabase
        .from('roadmap_templates')
        .update({ forks: (template?.forks || 0) + 1 })
        .eq('id', templateId);

      toast.success('Roadmap added to your dashboard! 🎉');
      fetchRoadmaps();
    } catch (error) {
      console.error('Error forking roadmap:', error);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-theme-text">
      <div className="sticky top-0 z-10 bg-brand-black/95 backdrop-blur border-b border-theme-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-theme-text tracking-tight">
            Prep<span className="text-brand-primary">Log</span>
          </h1>
          <button onClick={() => navigate('/dashboard')} className="text-theme-textSec hover:text-theme-text transition">
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header & Search aligned together */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">🌍 Explore Community</h2>
            <p className="text-theme-textSec">Discover roadmaps and connect with fellow developers</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder={activeTab === 'roadmaps' ? "🔍 Search roadmaps..." : "🔍 Search developers by name or role..."}
              className="w-full bg-brand-dark border border-theme-border rounded-lg px-4 py-3 text-theme-text focus:border-brand-primary focus:outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs Toggle */}
        <div className="flex gap-6 mb-8 border-b border-theme-border">
          <button
            onClick={() => { setActiveTab('roadmaps'); setSearchQuery(''); }}
            className={`pb-3 text-lg font-bold transition-colors ${activeTab === 'roadmaps' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-theme-textSec hover:text-theme-textSec'}`}
          >
            🗺️ Roadmaps
          </button>
          <button
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`pb-3 text-lg font-bold transition-colors ${activeTab === 'users' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-theme-textSec hover:text-theme-textSec'}`}
          >
            💻 Developers
          </button>
        </div>

        {/* Conditional Content Rendering */}
        {activeTab === 'roadmaps' ? (
          <>
            {/* Roadmap Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all' ? 'bg-brand-primary text-theme-text' : 'bg-brand-dark text-theme-textSec hover:text-theme-text'}`}>All</button>
                <button onClick={() => setFilter('trending')} className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'trending' ? 'bg-brand-primary text-theme-text' : 'bg-brand-dark text-theme-textSec hover:text-theme-text'}`}>🔥 Trending</button>
                <button onClick={() => setFilter('recent')} className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'recent' ? 'bg-brand-primary text-theme-text' : 'bg-brand-dark text-theme-textSec hover:text-theme-text'}`}>🕒 Recent</button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${categoryFilter === cat ? 'bg-brand-primary text-theme-text' : 'bg-brand-dark text-theme-textSec hover:text-theme-text'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12"><div className="text-theme-textSec">Loading roadmaps...</div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoadmaps.map(roadmap => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} onLike={handleLike} onFork={handleFork} onView={() => navigate(`/roadmap/${roadmap.id}`)} />
                ))}
                
                {filteredRoadmaps.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-theme-textSec mb-4">No roadmaps found</p>
                    <button onClick={() => navigate('/roadmap-builder')} className="px-6 py-3 bg-brand-primary rounded-lg font-bold text-theme-text hover:opacity-90 transition">Create First Roadmap</button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {usersLoading ? (
              <div className="col-span-full text-center py-12 text-theme-textSec">Searching developers...</div>
            ) : users.length > 0 ? (
              users.map(user => (
                <UserSearchCard key={user.id} user={user} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-theme-textSec italic">
                {searchQuery ? `No developers matching "${searchQuery}" found.` : "Search for developers by name, role, or @username."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RoadmapCard({ roadmap, onLike, onFork, onView }) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)

  const likesCount = roadmap.likes || 0

  useEffect(() => {
    checkIfLiked()
  }, [roadmap.id, user])

  const checkIfLiked = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('roadmap_likes')
        .select('user_id') 
        .eq('user_id', user.id)
        .eq('template_id', roadmap.id)
        .maybeSingle() 

      if (error) console.error("Like check error:", error)
      setIsLiked(!!data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLike = async (e) => {
    e.stopPropagation()
    if (!user) return toast.error('Please login to like roadmaps')

    setIsLiked(!isLiked)
    await onLike(roadmap.id, isLiked)
  }

  const difficultyColors = {
    Beginner: 'bg-green-500/20 text-green-400',
    Intermediate: 'bg-yellow-500/20 text-yellow-400',
    Advanced: 'bg-red-500/20 text-red-400'
  }

  return (
    <div className="bg-brand-dark border border-theme-border rounded-xl p-6 hover:border-brand-primary/40 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-theme-text mb-1">{roadmap.icon} {roadmap.title}</h3>
          <p className="text-sm text-theme-textSec line-clamp-2">{roadmap.description || 'No description'}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[roadmap.difficulty] || 'bg-gray-500/20 text-theme-textSec'}`}>{roadmap.difficulty}</span>
        <span className="text-xs text-theme-textSec">{roadmap.category}</span>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-theme-textSec">
        <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-xs text-brand-primary">
          {roadmap.profiles?.full_name?.[0] || 'U'}
        </div>
        <span>by {roadmap.profiles?.full_name || 'Anonymous'}</span>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={handleLike} className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${isLiked ? 'bg-[#FF6B9D] text-theme-text' : 'bg-brand-black text-theme-textSec hover:text-theme-text'}`}>
          ❤️ {likesCount}
        </button>
        <button onClick={() => onFork(roadmap.id)} className="flex-1 px-4 py-2 bg-brand-black text-theme-textSec hover:text-theme-text rounded-lg font-medium transition">
          🍴 {roadmap.forks || 0}
        </button>
        <button onClick={onView} className="px-4 py-2 bg-brand-primary rounded-lg font-bold text-theme-text hover:opacity-90 transition">View</button>
      </div>
    </div>
  )
}

export default BrowseRoadmaps;

