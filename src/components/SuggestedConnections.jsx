import React from 'react';
import { Link } from 'react-router-dom';
import { useSuggestions } from '../hooks/useSuggestions';
import FollowButton from './FollowButton'; // Reusing your D10 component!

const SuggestedConnections = () => {
  const { suggestions, loading, refreshSuggestions } = useSuggestions();

  if (loading) {
    return (
      <div className="bg-brand-dark border border-theme-border rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-brand-black rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-brand-black rounded-full shrink-0"></div>
              <div className="flex-1">
                <div className="h-3 bg-brand-black rounded w-24 mb-2"></div>
                <div className="h-2 bg-brand-black rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no suggestions, we return null to hide the widget, 
  // keeping the dashboard clean.
  if (!suggestions || suggestions.length === 0) {
    return null; 
  }

  return (
    <div className="bg-brand-dark border border-theme-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-theme-text font-bold text-lg">🤝 Suggested Connections</h3>
        <button 
          onClick={refreshSuggestions}
          className="text-xs text-brand-primary hover:text-theme-text transition-colors"
        >
          Refresh
        </button>
      </div>

      <p className="text-xs text-theme-textSec mb-4">
        Developers taking the same roadmaps as you:
      </p>

      <div className="space-y-3">
        {suggestions.map(peer => (
          <div key={peer.id} className="flex items-center justify-between gap-3 bg-brand-black p-3 rounded-lg border border-theme-border hover:border-brand-primary/30 transition-all">
            
            <Link to={`/profile/${peer.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-theme-text font-bold text-sm overflow-hidden shrink-0">
                {peer.avatar_url ? (
                  <img src={peer.avatar_url} alt={peer.username} className="w-full h-full object-cover" />
                ) : (
                  peer.username?.charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-theme-text text-sm font-semibold truncate group-hover:text-brand-primary transition-colors">
                  {peer.full_name || 'Developer'}
                </h4>
                <p className="text-theme-textSec text-xs truncate">@{peer.username}</p>
              </div>
            </Link>

            {/* Reusing your FollowButton. Note: Verify the prop name your FollowButton uses (e.g., targetUserId or userId) */}
            <div className="shrink-0">
              <FollowButton targetUserId={peer.id} />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedConnections;

