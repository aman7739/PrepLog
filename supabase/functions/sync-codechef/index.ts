import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS preflight request (Crucial for browser calls)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Get the username from the frontend request
    const { username } = await req.json()
    if (!username) throw new Error("Username is required")

    // 3. Fetch the public HTML from CodeChef
    const res = await fetch(`https://www.codechef.com/users/${username}`)
    const html = await res.text()

    // 4. Scrape the rating using Regex
    const ratingMatch = html.match(/rating-number[^>]*>(\d+)</)
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0

    // 5. Send it back to the frontend
    return new Response(
      JSON.stringify({ rating, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    )
  }
})

