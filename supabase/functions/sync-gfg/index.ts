import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username } = await req.json()
    if (!username) throw new Error("Username is required")

    console.log(`[GFG] Fetching for username: ${username}`)

    // Fetch from the Render API with a LONG timeout
    // Deno's fetch doesn't have built-in timeout, so we use Promise.race
    const fetchPromise = fetch(`https://gfg-api-fefa.onrender.com/${username}`)
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout after 120 seconds")), 120000)
    )

    const res = await Promise.race([fetchPromise, timeoutPromise])

    if (!res.ok) {
      console.log(`[GFG] API returned status: ${res.status}`)
      throw new Error(`GFG API returned ${res.status}`)
    }

    const data = await res.json()
    console.log(`[GFG] Raw response:`, data)

    // Extract score from multiple possible formats
    let score = 0
    if (data?.overall_score) {
      score = parseInt(data.overall_score, 10)
    } else if (data?.codingScore) {
      score = parseInt(data.codingScore, 10)
    } else if (data?.score) {
      score = parseInt(data.score, 10)
    }

    console.log(`[GFG] Extracted score: ${score}`)

    return new Response(
      JSON.stringify({ score, success: true }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    )

  } catch (error) {
    console.error(`[GFG] Error:`, error.message)
    return new Response(
      JSON.stringify({ error: error.message, success: false, score: 0 }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200  // Return 200 so Supabase doesn't throw
      }
    )
  }
})