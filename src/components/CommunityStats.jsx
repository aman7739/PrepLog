import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Adjust path to '../../lib/supabase' if inside dashboard folder

const CommunityStats = () => {
  const [stats, setStats] = useState({ users: 0, roadmaps: 0, enrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityStats();
  }, []);

  const fetchCommunityStats = async () => {
    try {
      // Fetch total users (count)
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch public roadmaps (count)
      const { count: roadmapsCount } = await supabase
        .from('roadmap_templates')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true);

      // Fetch total roadmap enrollments/forks (count)
      const { count: enrollmentsCount } = await supabase
        .from('user_roadmaps')
        .select('*', { count: 'exact', head: true });

      setStats({
        users: usersCount || 0,
        roadmaps: roadmapsCount || 0,
        enrollments: enrollmentsCount || 0
      });
    } catch (error) {
      console.error("Error fetching community stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-brand-dark border border-theme-border rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-brand-black rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="h-12 bg-brand-black rounded"></div>
          <div className="h-12 bg-brand-black rounded"></div>
          <div className="h-12 bg-brand-black rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark border border-theme-border rounded-xl p-6">
      <h3 className="text-lg font-bold text-theme-text mb-6 flex items-center gap-2">
        📊 PrepLog Network Pulse
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat Box 1 */}
        <div className="bg-brand-black p-4 rounded-lg border border-theme-border flex flex-col items-center justify-center text-center hover:border-brand-primary/30 transition-colors">
          <span className="text-3xl font-black text-brand-primary">{stats.users}</span>
          <span className="text-xs text-theme-textSec mt-1 uppercase tracking-widest font-medium">Developers</span>
        </div>

        {/* Stat Box 2 */}
        <div className="bg-brand-black p-4 rounded-lg border border-theme-border flex flex-col items-center justify-center text-center hover:border-[#FF6B9D]/30 transition-colors">
          <span className="text-3xl font-black text-[#FF6B9D]">{stats.roadmaps}</span>
          <span className="text-xs text-theme-textSec mt-1 uppercase tracking-widest font-medium">Public Roadmaps</span>
        </div>

        {/* Stat Box 3 */}
        <div className="bg-brand-black p-4 rounded-lg border border-theme-border flex flex-col items-center justify-center text-center hover:border-purple-500/30 transition-colors">
          <span className="text-3xl font-black text-purple-400">{stats.enrollments}</span>
          <span className="text-xs text-theme-textSec mt-1 uppercase tracking-widest font-medium">Enrollments</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;

