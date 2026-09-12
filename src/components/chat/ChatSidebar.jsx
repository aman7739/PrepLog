import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

// Helper to format time like WhatsApp (Time if today, Date if older)
const formatMessageTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
};

const ChatSidebar = ({ onSelectConvo, activeConvoId }) => {
  const [convos, setConvos] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  // Use a ref so the realtime callback always has the latest activeConvoId
  // without causing the useEffect to re-run (and re-subscribe)
  const activeConvoIdRef = useRef(activeConvoId);
  useEffect(() => {
    activeConvoIdRef.current = activeConvoId;
  }, [activeConvoId]);

  useEffect(() => {
    const fetchConvosAndUnread = async () => {
      // 1. Fetch conversations
      const { data: convoData, error } = await supabase
        .from('conversations')
        .select(`
          id, user1_id, user2_id, last_message, last_message_at,
          user1:profiles!conversations_user1_id_fkey ( id, username, avatar_url ),
          user2:profiles!conversations_user2_id_fkey ( id, username, avatar_url )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (!error && convoData) {
        setConvos(convoData);

        // 2. Fetch unread counts — only for THIS user's conversations
        const convoIds = convoData.map(c => c.id);
        if (convoIds.length > 0) {
          const { data: unreadData } = await supabase
            .from('messages')
            .select('conversation_id')
            .in('conversation_id', convoIds)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          if (unreadData) {
            const counts = {};
            unreadData.forEach(msg => {
              counts[msg.conversation_id] = (counts[msg.conversation_id] || 0) + 1;
            });
            setUnreadCounts(counts);
          }
        }
      }
    };

    if (user) {
      fetchConvosAndUnread();

      // Listen for conversation updates (updates text and time)
      const convoChannel = supabase
        .channel('sidebar_updates')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        }, (payload) => {
          setConvos(current => {
            const updated = current.map(c => 
              c.id === payload.new.id ? { ...c, last_message: payload.new.last_message, last_message_at: payload.new.last_message_at } : c
            );
            return updated.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
          });
        })
        .subscribe();

      // Listen for new messages to increment the unread badge
      const msgChannel = supabase
        .channel('sidebar_unread')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        }, (payload) => {
          // Use ref so we always check the LATEST activeConvoId
          if (payload.new.sender_id !== user.id && payload.new.conversation_id !== activeConvoIdRef.current) {
            setUnreadCounts(prev => ({
              ...prev,
              [payload.new.conversation_id]: (prev[payload.new.conversation_id] || 0) + 1
            }));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(convoChannel);
        supabase.removeChannel(msgChannel);
      };
    }
  }, [user]); // Removed activeConvoId — using ref instead

  // Handle Search Query Effect
  useEffect(() => {
    const searchUsers = async () => {
      const cleanQuery = searchQuery.trim().replace(/^@/, '');
      if (!cleanQuery) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .neq('id', user.id)
        .or(`username.ilike.%${cleanQuery}%,full_name.ilike.%${cleanQuery}%`)
        .limit(10);
        
      if (!error && data) {
        setSearchResults(data);
      }
      setIsSearching(false);
    };
    
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, user?.id]);

  const handleSelect = (id, username, receiverId) => {
    setUnreadCounts(prev => ({ ...prev, [id]: 0 }));
    onSelectConvo(id, username, receiverId);
  };

  const handleStartNewChat = async (targetUserId, targetUsername) => {
    setSearchQuery(''); // Clear search to return to convo view
    
    // Check if we already have this conversation loaded in state
    const existing = convos.find(c => c.user1_id === targetUserId || c.user2_id === targetUserId);
    if (existing) {
      handleSelect(existing.id, targetUsername, targetUserId);
      return;
    }
    
    // Query DB just in case it's not loaded
    const { data: existingConvo } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(user1_id.eq.${user.id},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${user.id})`)
      .maybeSingle();
      
    if (existingConvo) {
      handleSelect(existingConvo.id, targetUsername, targetUserId);
      return;
    }
    
    // Create new conversation
    const { data: newConvo, error } = await supabase
      .from('conversations')
      .insert({ user1_id: user.id, user2_id: targetUserId })
      .select()
      .single();
      
    if (!error && newConvo) {
      handleSelect(newConvo.id, targetUsername, targetUserId);
    }
  };

  return (
    <div className="w-full bg-[#181818] border-r border-theme-border h-full flex flex-col">
      <div className="p-4 border-b border-theme-border">
        <h2 className="text-xl font-bold text-theme-text tracking-tight mb-4">Messages</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-[#242424] border border-theme-border text-theme-text px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-brand-primary transition-colors text-sm"
          />
          <svg className="w-4 h-4 absolute left-3 top-3 text-theme-textSec" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-theme-textSec hover:text-white">
              ✕
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {searchQuery ? (
          /* --- Search Results UI --- */
          isSearching ? (
             <div className="p-6 text-center text-sm text-theme-textSec">Searching...</div>
          ) : searchResults.length === 0 ? (
             <div className="p-6 text-center text-sm text-theme-textSec">No users found.</div>
          ) : (
            searchResults.map(result => (
              <button
                key={result.id}
                onClick={() => handleStartNewChat(result.id, result.username || result.full_name)}
                className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-theme-border/50 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-theme-text font-bold text-lg shadow-lg shrink-0">
                  {result.username?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-theme-text font-medium truncate text-[15px]">@{result.username}</h4>
                   {result.full_name && <p className="text-[12px] text-theme-textSec truncate">{result.full_name}</p>}
                </div>
              </button>
            ))
          )
        ) : (
          /* --- Normal Conversations List --- */
          convos.length === 0 ? (
            <p className="p-6 text-theme-textSec text-sm italic text-center">No active chats yet.</p>
          ) : (
            convos.map((convo) => {
              const otherUser = convo.user1_id === user.id ? convo.user2 : convo.user1;
              const unreadCount = unreadCounts[convo.id] || 0; 

            return (
              <div 
                key={convo.id}
                onClick={() => handleSelect(convo.id, otherUser?.username, otherUser?.id)}
                className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-theme-border/50 cursor-pointer ${
                  activeConvoId === convo.id ? 'bg-white/10 border-l-4 border-l-brand-primary' : 'border-l-4 border-l-transparent'
                }`}
              >
                {/* Left: Avatar */}
                <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-theme-text font-bold text-lg shadow-lg shrink-0">
                  {otherUser?.username?.[0].toUpperCase()}
                </div>
                
                {/* Middle & Right: Layout Container */}
                <div className="flex-1 min-w-0 flex justify-between ml-3">
                  
                  {/* Name and Message */}
                  <div className="min-w-0 pr-2 flex flex-col justify-center">
                    <h4 className="text-theme-text font-medium truncate text-[15px]">@{otherUser?.username}</h4>
                    <p className={`text-[13px] truncate mt-0.5 ${unreadCount > 0 ? 'text-theme-textSec font-medium' : 'text-theme-textSec'}`}>
                      {convo.last_message || "Start the conversation..."}
                    </p>
                  </div>
                  
                  {/* Right: Timestamp and Unread Badge */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5 pt-0.5">
                    <span className={`text-[11px] ${unreadCount > 0 ? 'text-green-500 font-medium' : 'text-theme-textSec'}`}>
                      {formatMessageTime(convo.last_message_at)}
                    </span>
                    
                    {unreadCount > 0 && (
                      <div className="bg-brand-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

