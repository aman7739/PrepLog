import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { username } = await req.json()
    if (!username) throw new Error('Username is required')

    const profileUrl = `https://www.geeksforgeeks.org/user/${username}/`
    
    // Spoofing a real browser to prevent Cloudflare from dropping the connection
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      }
    })

    if (!response.ok) {
      throw new Error(`GFG blocked the request or profile not found (HTTP ${response.status})`)
    }

    const html = await response.text()
    
    let codingScore = 0;
    let totalSolved = 0;
    let rank = "N/A";

    // ⚡ Sniper Regex targeting the exact escaped JSON structure we discovered earlier
    const scoreMatch = html.match(/\\?"score\\?"\s*:\s*(\d+)/i) || html.match(/score_card_value[^>]*>[\s\S]*?(\d+)/i);
    if (scoreMatch) codingScore = parseInt(scoreMatch[1], 10);

    const solvedMatch = html.match(/\\?"total_problems_solved\\?"\s*:\s*(\d+)/i);
    if (solvedMatch) totalSolved = parseInt(solvedMatch[1], 10);

    const rankMatch = html.match(/\\?"institute_rank\\?"\s*:\s*\\?"([^"\\]*)\\?"/i);
    if (rankMatch && rankMatch[1].trim() !== "") rank = rankMatch[1];

    // Always return a valid response to prevent 502s
    return new Response(
      JSON.stringify({ codingScore, totalSolved, rank, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    // Failsafe catch to ensure Kong NEVER throws a 502
    return new Response(
      JSON.stringify({ error: error.message || "Unknown scrape error", success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 } 
    )
  }
})

