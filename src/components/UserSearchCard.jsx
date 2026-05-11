import React from 'react';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user }) => {
  return (
    <Link 
      to={`/profile/${user.id}`} 
      className="bg-[#1e2d45] border border-[#1e2d45] hover:border-[#00d4ff]/50 p-4 rounded-xl flex items-center gap-4 transition-all group"
    >
      {/* Avatar with Initials fallback */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          user.username?.charAt(0).toUpperCase()
        )}
      </div>

      {/* User Identity and Role */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate group-hover:text-[#00d4ff] transition-colors">
          {user.full_name || 'Developer'}
        </h3>
        <p className="text-gray-400 text-sm truncate">@{user.username}</p>
        <p className="text-[#00d4ff] text-xs mt-1 font-medium">{user.role || 'Contributor'}</p>
      </div>

      {/* Topics Completed Stat */}
      <div className="text-right shrink-0">
        <div className="text-white font-bold text-sm">{user.topics_completed || 0}</div>
        <div className="text-gray-500 text-[10px] uppercase tracking-wider">Topics</div>
      </div>
    </Link>
  );
};

export default UserSearchCard;

