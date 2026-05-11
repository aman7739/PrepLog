import React, { useEffect, useState } from 'react';
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
  const [unreadCounts, setUnreadCounts] = useState({}); // NEW: State for unread math
  const { user } = useAuth();

  useEffect(() => {
    const fetchConvosAndUnread = async () => {
      // 1. Fetch conversations
      const { data: convoData, error } = await supabase
        .from('conversations')
        .select(`
          *,
          user1:profiles!conversations_user1_id_fkey ( id, username, avatar_url ),
          user2:profiles!conversations_user2_id_fkey ( id, username, avatar_url )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (!error && convoData) setConvos(convoData);

      // 2. Fetch unread counts from messages table
      const { data: unreadData } = await supabase
        .from('messages')
        .select('conversation_id')
        .eq('is_read', false)
        .neq('sender_id', user.id); // Only count messages sent by the OTHER person

      if (unreadData) {
        const counts = {};
        unreadData.forEach(msg => {
          counts[msg.conversation_id] = (counts[msg.conversation_id] || 0) + 1;
        });
        setUnreadCounts(counts);
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

      // NEW: Listen for new messages to increment the unread badge
      const msgChannel = supabase
        .channel('sidebar_unread')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        }, (payload) => {
          // If the message is NOT from us, and we are NOT currently in that chat
          if (payload.new.sender_id !== user.id && payload.new.conversation_id !== activeConvoId) {
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
  }, [user, activeConvoId]);

  // When clicking a chat, clear the unread badge locally instantly
  const handleSelect = (id, username) => {
    setUnreadCounts(prev => ({ ...prev, [id]: 0 }));
    onSelectConvo(id, username);
  };

  return (
    <div className="w-full bg-[#0f172a] border-r border-[#1e2d45] h-full flex flex-col">
      <div className="p-4 border-b border-[#1e2d45]">
        <h2 className="text-xl font-bold text-white tracking-tight">Messages</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {convos.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm italic text-center">No active chats yet.</p>
        ) : (
          convos.map((convo) => {
            const otherUser = convo.user1_id === user.id ? convo.user2 : convo.user1;
            
            // Replaced the hardcoded placeholder with our real state!
            const unreadCount = unreadCounts[convo.id] || 0; 

            return (
              <div 
                key={convo.id}
                onClick={() => handleSelect(convo.id, otherUser?.username)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-b border-[#1e2d45]/30 ${
                  activeConvoId === convo.id ? 'bg-[#1e2d45] border-l-4 border-l-[#00d4ff]' : 'hover:bg-[#1e2d45]/40'
                }`}
              >
                {/* Left: Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                  {otherUser?.username?.[0].toUpperCase()}
                </div>
                
                {/* Middle & Right: Layout Container */}
                <div className="flex-1 min-w-0 flex justify-between">
                  
                  {/* Name and Message */}
                  <div className="min-w-0 pr-2 flex flex-col justify-center">
                    <h4 className="text-white font-medium truncate text-[15px]">@{otherUser?.username}</h4>
                    <p className={`text-[13px] truncate mt-0.5 ${unreadCount > 0 ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                      {convo.last_message || "Start the conversation..."}
                    </p>
                  </div>
                  
                  {/* Right: Timestamp and Unread Badge */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5 pt-0.5">
                    <span className={`text-[11px] ${unreadCount > 0 ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                      {formatMessageTime(convo.last_message_at)}
                    </span>
                    
                    {unreadCount > 0 && (
                      <div className="bg-[#10b981] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

