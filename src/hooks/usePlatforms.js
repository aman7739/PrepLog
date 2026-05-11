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
        .select('*')
        .eq('user_id', user.id)

      setPlatforms(pData || [])

      // Fetch cached stats
      const { data: sData } = await supabase
        .from('platform_stats')
        .select('*')
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
      // Upsert platform
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

      // Auto-sync after save
      await syncPlatform(platformId, username)
    } catch (err) {
      console.error('savePlatform error:', err)
    }
  }

  const callEdgeFunction = async (platformId, username) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(
        'https://zvfvmppiyoahjtqqrjrq.supabase.co/functions/v1/fetch-platform-stats',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            platform: platformId,
            username,
          }),
        }
      )

      if (!response.ok) {
        console.error('Edge Function response error:', response.status)
        return null
      }

      const data = await response.json()
      return data?.stats || null
    } catch (err) {
      console.error('Edge Function call error:', err)
      return null
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
      
      // 🚀 ACTUALLY FINAL: GeeksForGeeks via Edge Function with long timeout
      else if (platformId === 'gfg') {
        try {
          console.log("🟢 GFG: Starting sync for @" + username);
          console.log("⏳ GFG: This may take 30-90 seconds while the server boots up...");
          
          // Call the edge function (no JWT verification needed)
          const { data, error } = await supabase.functions.invoke('sync-gfg', {
            body: { username }
          })

          if (error) {
            console.error("❌ GFG Edge Function error:", error);
            stats = { score: 0 };
          } else if (data?.success) {
            console.log("✅ GFG: Success! Score = " + data.score);
            stats = { score: data.score || 0 };
          } else {
            console.warn("⚠️ GFG: Edge Function returned error:", data?.error);
            stats = { score: 0 };
          }
        } catch (err) {
          console.error("❌ GFG Sync Error:", err.message);
          stats = { score: 0 };
        }
      }

      else if (platformId === 'hackerrank') {
        stats = await callEdgeFunction(platformId, username)
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

      await fetchPl
      atforms()
    } catch (err) {
      console.error('deletePlatform error:', err)
    }
  }

  return { platforms, statsMap, loading, savePlatform, syncPlatform, syncing, deletePlatform }
}