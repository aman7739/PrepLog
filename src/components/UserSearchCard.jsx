import React from 'react';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user }) => {
  return (
    <Link 
      to={`/profile/${user.id}`} 
      className="bg-[#1e2d45] border border-theme-border hover:border-brand-primary/50 p-4 rounded-xl flex items-center gap-4 transition-all group"
    >
      {/* Avatar with Initials fallback */}
      <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-theme-text font-bold text-lg overflow-hidden shrink-0">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          user.username?.charAt(0).toUpperCase()
        )}
      </div>

      {/* User Identity and Role */}
      <div className="flex-1 min-w-0">
        <h3 className="text-theme-text font-semibold truncate group-hover:text-brand-primary transition-colors">
          {user.full_name || 'Developer'}
        </h3>
        <p className="text-theme-textSec text-sm truncate">@{user.username}</p>
        <p className="text-brand-primary text-xs mt-1 font-medium">{user.role || 'Contributor'}</p>
      </div>

      {/* Topics Completed Stat */}
      <div className="text-right shrink-0">
        <div className="text-theme-text font-bold text-sm">{user.topics_completed || 0}</div>
        <div className="text-theme-textSec text-[10px] uppercase tracking-wider">Topics</div>
      </div>
    </Link>
  );
};

export default UserSearchCard;

