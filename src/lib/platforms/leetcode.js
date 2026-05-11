export const fetchLeetcodeStats = async (username) => {
  try {
    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/${username}/solved`
    )
    if (!response.ok) return null
    const data = await response.json()
    if (!data) return null
    return {
      totalSolved: data.solvedProblem || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
    }
  } catch (err) {
    console.error('LeetCode fetch error:', err)
    return null
  }
}