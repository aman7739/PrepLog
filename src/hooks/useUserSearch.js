import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useUserSearch = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }
    
    setLoading(true);
    // Searching profiles by username, full name, or role [cite: 89, 490]
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, role, topics_completed')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%,role.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error("Search error:", error.message);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  return { users, loading, searchUsers };
};


