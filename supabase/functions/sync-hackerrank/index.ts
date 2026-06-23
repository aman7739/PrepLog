import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle Browser Preflight requests (Bypassing CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Parse the username from the frontend request
    const { username } = await req.json()

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }

    // 3. 🚀 Fetch BOTH endpoints at the exact same time!
    const [profileRes, badgesRes] = await Promise.all([
      fetch(`https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`, { headers }),
      fetch(`https://www.hackerrank.com/rest/hackers/${username}/badges`, { headers })
    ])

    if (!profileRes.ok) throw new Error(`HackerRank profile returned: ${profileRes.status}`)
    if (!badgesRes.ok) throw new Error(`HackerRank badges returned: ${badgesRes.status}`)

    const profileData = await profileRes.json()
    const badgesData = await badgesRes.json()

    // 🧹 Clean up the data for PrepLog
    const profile = profileData.model || {}
    const badges = badgesData.models || []

    // 4. Return the combined, clean data to PrepLog
    return new Response(JSON.stringify({
      username: profile.username,
      name: profile.name,
      badges: badges.map((b: any) => ({ name: b.badge_name, stars: b.stars })),
      total_score: profile.score || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

