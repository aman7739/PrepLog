import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Custom fetch with retry logic for transient failures
const fetchWithRetry = async (url, options = {}) => {
  const maxRetries = 2
  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: options.signal || AbortSignal.timeout(15000), // 15s timeout
      })

      // Don't retry on client errors (4xx), only on server errors (5xx)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response
      }

      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
    }

    // Wait before retrying (exponential backoff: 1s, 2s)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }

  throw lastError
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: fetchWithRetry,
  },
  realtime: {
    params: {
      eventsPerSecond: 5, // Rate limit realtime events
    },
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})