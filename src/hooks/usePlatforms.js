import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { fetchLeetcodeStats } from '../lib/platforms/leetcode'
import { fetchGithubStats } from '../lib/platforms/github'
import { fetchCodeforcesStats } from '../lib/platforms/codeforces'

export const usePlatforms = () => {
  const { user } = useAuth()
  const [platforms, setPlatforms] = useState([])
  const [statsMap, setStatsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(null)

  const fetchPlatforms = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: pData } = await supabase
        .from('platforms')
        .select('id, platform, username, connected_at, last_synced')
        .eq('user_id', user.id)

      setPlatforms(pData || [])

      const { data: sData } = await supabase
        .from('platform_stats')
        .select('platform, stats, fetched_at')
        .eq('user_id', user.id)

      const map = {}
      sData?.forEach(row => {
        map[row.platform] = row.stats
      })
      setStatsMap(map)
    } catch (err) {
      console.error('usePlatforms fetch error:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPlatforms()
  }, [user])

  const savePlatform = async (platformId, username) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('platforms')
        .upsert({
          user_id: user.id,
          platform: platformId,
          username,
          connected_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,platform'
        })

      if (error) console.error('savePlatform error:', error.message)
      await fetchPlatforms()
      await syncPlatform(platformId, username)
    } catch (err) {
      console.error('savePlatform error:', err)
    }
  }

  const syncPlatform = async (platformId, username) => {
    if (!user || !username) return
    setSyncing(platformId)
    try {
      let stats = null

      if (platformId === 'leetcode') {
        stats = await fetchLeetcodeStats(username)
      } else if (platformId === 'github') {
        stats = await fetchGithubStats(username)
      } else if (platformId === 'codeforces') {
        stats = await fetchCodeforcesStats(username)
      } else if (platformId === 'codechef') {
        const { data, error } = await supabase.functions.invoke('sync-codechef', {
          body: { username }
        })
        if (error) throw error
        if (data && data.success) {
          stats = { rating: data.rating }
        } else {
          console.error("CodeChef Scraper Error:", data?.error)
        }
      } 
      // 🚀 GEEKSFORGEEKS EDGE FUNCTION SYNC
      else if (platformId === 'gfg') {
        try {
          const cleanUsername = username.replace('@', '').trim();
          const { data, error } = await supabase.functions.invoke('sync-gfg', {
            body: { username: cleanUsername }
          });

          if (error) throw error;
          if (data?.error) throw new Error(data.error);

          stats = data; // Captures codingScore, totalSolved, rank, etc.
        } catch (err) {
          console.error("❌ GFG Sync Error:", err.message);
          stats = { codingScore: 0, totalSolved: 0, error: "Sync failed" };
        }
      } 
      // 🚀 HACKERRANK EDGE FUNCTION SYNC
      else if (platformId === 'hackerrank') {
        try {
          const cleanUsername = username.replace('@', '').trim();
          const { data, error } = await supabase.functions.invoke('sync-hackerrank', {
            body: { username: cleanUsername }
          });

          if (error) throw error;
          if (data?.error) throw new Error(data.error);

          stats = data; 
        } catch (err) {
          console.error("❌ HackerRank Sync Error:", err.message);
          stats = { total_score: 0, badges: [], error: "Sync failed" };
        }
      } else {
        stats = { connected: true, note: 'Auto-sync coming soon' }
      }

      if (stats) {
        await supabase
          .from('platform_stats')
          .upsert({
            user_id: user.id,
            platform: platformId,
            stats,
            fetched_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,platform'
          })

        await supabase
          .from('platforms')
          .update({ last_synced: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('platform', platformId)

        setStatsMap(prev => ({ ...prev, [platformId]: stats }))
      }
    } catch (err) {
      console.error('syncPlatform error:', err)
    }
    setSyncing(null)
  }

  const deletePlatform = async (platformId) => {
    if (!user) return
    try {
      await supabase
        .from('platforms')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platformId)

      await supabase
        .from('platform_stats')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platformId)

      await fetchPlatforms()
    } catch (err) {
      console.error('deletePlatform error:', err)
    }
  }

  return { platforms, statsMap, loading, savePlatform, syncPlatform, syncing, deletePlatform }
}
