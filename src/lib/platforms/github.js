export const fetchGithubStats = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) return null

    const data = await response.json()

    return {
      public_repos: data.public_repos || 0,
      followers: data.followers || 0,
      following: data.following || 0,
      name: data.name || username,
      bio: data.bio || '',
      avatar_url: data.avatar_url || '',
    }
  } catch (err) {
    console.error('GitHub fetch error:', err)
    return null
  }
}