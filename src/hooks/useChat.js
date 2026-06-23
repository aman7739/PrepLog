import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 
import { useAuth } from '../context/AuthContext'; 

export const useChat = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  // NEW: State to track if an upload is currently happening
  const [isUploading, setIsUploading] = useState(false); 
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
      // Listen for UPDATES (like when a message is marked as read)
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

  // Function to push a standard text message to Supabase 
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
      message_type: 'text' // Explicitly marking as text
    });

    if (error) console.error("Error sending message:", error.message);
  };

  // --- NEW: Function to upload media and send it ---
  const sendMedia = async (file) => {
    if (!file) return;
    
    try {
      setIsUploading(true);

      // 1. Create a unique file name to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${conversationId}/${fileName}`; // Group files by conversation ID

      // 2. Upload to the secure Supabase bucket
      const { error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get the public URL for the UI to display
      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(filePath);

      // 4. Determine if it's an image or document
      const isImage = file.type.startsWith('image/');
      const messageType = isImage ? 'image' : 'document';

      // 5. Insert the message into the database
      const { error: dbError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: isImage ? '📷 Image' : `📄 ${file.name}`, // Fallback text for the sidebar
        message_type: messageType,
        media_url: publicUrl
      });

      if (dbError) throw dbError;

    } catch (error) {
      console.error("Error uploading media:", error.message);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Export the new sendMedia function and isUploading state
  return { messages, sendMessage, sendMedia, isUploading, loading };
};

