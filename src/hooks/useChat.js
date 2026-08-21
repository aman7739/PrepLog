import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 
import { useAuth } from '../context/AuthContext'; 

export const useChat = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); 
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedBy, setBlockedBy] = useState(null);
  const [conversation, setConversation] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId || !user) return;

    // --- Mark unread messages as read ---
    const markAsRead = async () => {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id) // Only mark messages from the OTHER person as read
        .eq('is_read', false);
    };

    const initChat = async () => {
      setLoading(true);

      // 1. Fetch conversation details first
      const { data: convo, error: convoError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
        
      if (convoError) {
        setLoading(false);
        return;
      }
      
      setConversation(convo);
      setIsBlocked(!!convo.blocked_by);
      setBlockedBy(convo.blocked_by);

      const isUser1 = convo.user1_id === user.id;
      const clearedAt = isUser1 ? convo.user1_cleared_at : convo.user2_cleared_at;

      // 2. Fetch existing messages filtered by clearedAt
      let query = supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (clearedAt) {
        query = query.gt('created_at', clearedAt);
      }

      const { data: messagesData, error: msgError } = await query;
      if (!msgError) setMessages(messagesData);
      
      // 3. Mark unread messages as read
      await markAsRead();

      setLoading(false);
    };

    initChat();

    // Real-time Subscriptions 
    const channel = supabase
      .channel(`chat_${conversationId}`) 
      // Listen for NEW Messages
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        if (payload.new.sender_id !== user.id) {
           markAsRead();
        }
      })
      // Listen for MESSAGE UPDATES (read receipts)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages((prev) => prev.map(msg => msg.id === payload.new.id ? payload.new : msg));
      })
      // Listen for CONVERSATION UPDATES (blocking)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `id=eq.${conversationId}`
      }, (payload) => {
        setIsBlocked(!!payload.new.blocked_by);
        setBlockedBy(payload.new.blocked_by);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]); 

  // --- ACTIONS ---

  const sendMessage = async (content) => {
    if (!content.trim() || isBlocked) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
      message_type: 'text'
    });

    if (error) console.error("Error sending message:", error.message);
  };

  const sendMedia = async (file) => {
    if (!file || isBlocked) return;
    
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${conversationId}/${fileName}`; 

      const { error: uploadError } = await supabase.storage.from('chat-media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('chat-media').getPublicUrl(filePath);

      const isImage = file.type.startsWith('image/');
      const messageType = isImage ? 'image' : 'document';

      const { error: dbError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: isImage ? '📷 Image' : `📄 ${file.name}`,
        message_type: messageType,
        media_url: publicUrl
      });

      if (dbError) throw dbError;

    } catch (error) {
      console.error("Error uploading media:", error.message);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearChat = async () => {
    if (!conversation) return;
    const isUser1 = conversation.user1_id === user.id;
    const columnToUpdate = isUser1 ? 'user1_cleared_at' : 'user2_cleared_at';
    
    // Optimistic UI update
    setMessages([]);
    
    await supabase
      .from('conversations')
      .update({ [columnToUpdate]: new Date().toISOString() })
      .eq('id', conversationId);
  };

  const toggleBlockUser = async () => {
    if (!conversation) return;
    
    if (isBlocked && blockedBy === user.id) {
      // Unblock
      await supabase.from('conversations').update({ blocked_by: null }).eq('id', conversationId);
      setIsBlocked(false);
      setBlockedBy(null);
    } else if (!isBlocked) {
      // Block
      await supabase.from('conversations').update({ blocked_by: user.id }).eq('id', conversationId);
      setIsBlocked(true);
      setBlockedBy(user.id);
    }
  };

  return { 
    messages, sendMessage, sendMedia, isUploading, loading,
    isBlocked, blockedBy, clearChat, toggleBlockUser
  };
};

