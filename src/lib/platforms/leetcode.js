export const fetchLeetcodeStats = async (username) => {
  try {
    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/${username}/solved`
    )
    
    if (response.status === 429) {
      return { error: 'API Rate Limited (429). Try again later.' }
    }
    if (!response.ok) {
      return { error: 'Failed to fetch LeetCode stats.' }
    }
    
    const data = await response.json()
    if (!data) return { error: 'No data returned' }
    
    // If API returns an error message in JSON
    if (data.errors) {
      return { error: 'LeetCode user not found or private.' }
    }

    return {
      totalSolved: data.solvedProblem || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
    }
  } catch (err) {
    console.error('LeetCode fetch error:', err)
    return { error: 'Network error connecting to proxy.' }
  }
}