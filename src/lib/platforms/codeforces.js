export const fetchCodeforcesStats = async (username) => {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`
    )

    if (!response.ok) return null

    const data = await response.json()

    if (data.status !== 'OK') return null

    const user = data.result[0]

    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'unrated',
      maxRank: user.maxRank || 'unrated',
      contribution: user.contribution || 0,
    }
  } catch (err) {
    console.error('Codeforces fetch error:', err)
    return null
  }
}