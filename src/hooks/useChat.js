import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 
import { useAuth } from '../context/AuthContext'; 

export const useChat = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId || !user) return;

    // --- NEW: Mark unread messages as read ---
    const markAsRead = async () => {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id) // Only mark messages from the OTHER person as read
        .eq('is_read', false);
    };
    
    markAsRead();
    // ------------------------------------------

    // 1. Fetch existing message history from the DB 
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error) setMessages(data);
      setLoading(false);
    };

    fetchMessages();

    // 2. Real-time Subscription: Listen for INSERT and UPDATE events 
    const channel = supabase
      .channel(`chat_${conversationId}`) 
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
        // Add the new message to our local state instantly!
        setMessages((prev) => [...prev, payload.new]);
        
        // If we receive a message, instantly mark it as read!
        if (payload.new.sender_id !== user.id) {
           markAsRead();
        }
      })
      // NEW: Listen for UPDATES (like when a message is marked as read)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        // Swap out the old message for the updated one so the tick changes instantly
        setMessages((prev) => prev.map(msg => msg.id === payload.new.id ? payload.new : msg));
      })
      .subscribe();

    // Cleanup: Remove the WebSocket connection when the user leaves the chat 
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]); 

  // Function to push a new message to Supabase 
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim()
    });

    if (error) console.error("Error sending message:", error.message);
  };

  return { messages, sendMessage, loading };
};