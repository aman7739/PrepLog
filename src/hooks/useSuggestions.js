import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useSuggestions = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);

      // 1. Get the roadmaps the current user is enrolled in
      const { data: myRoadmaps } = await supabase
        .from('user_roadmaps')
        .select('template_id')
        .eq('user_id', user.id);

      if (!myRoadmaps || myRoadmaps.length === 0) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      const myTemplateIds = myRoadmaps.map(rm => rm.template_id);

      // 2. Get users who are already followed by the current user
      const { data: following } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);
        
      const followingIds = following ? following.map(f => f.following_id) : [];
      // Add current user to exclusion list
      const excludeIds = [...followingIds, user.id]; 

      // 3. Find other users enrolled in the SAME roadmaps, excluding people already followed
      const { data: sharedUsers, error } = await supabase
        .from('user_roadmaps')
        .select(`
          user_id,
          profiles:user_id (id, username, full_name, avatar_url, role, topics_completed)
        `)
        .in('template_id', myTemplateIds)
        .not('user_id', 'in', `(${excludeIds.join(',')})`)
        .limit(10); // Get a pool of users

      if (error) throw error;

      // Filter out duplicates (since a user might share multiple roadmaps)
      const uniqueUsersMap = new Map();
      sharedUsers?.forEach(record => {
        if (record.profiles && !uniqueUsersMap.has(record.profiles.id)) {
          uniqueUsersMap.set(record.profiles.id, record.profiles);
        }
      });

      // Grab up to 3 random suggestions from the pool
      const uniqueUsers = Array.from(uniqueUsersMap.values());
      const shuffled = uniqueUsers.sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 3));

    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, refreshSuggestions: fetchSuggestions };
};

