import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from "../context/AuthContext";

const Chat = ({ selectedConvoId, receiverName = "Developer" }) => {
  const { messages, sendMessage, loading } = useChat(selectedConvoId);
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();

  // Auto-scroll to bottom whenever a new message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage('');
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center text-[#00d4ff] p-10 animate-pulse">
      Loading encrypted chat...
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0e1a] overflow-hidden">
        
      {/* Chat Header */}
      <div className="p-4 bg-[#0f172a] border-b border-[#1e2d45] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00d4ff] to-[#FF6B9D] flex items-center justify-center font-bold text-white shadow-lg">
            {receiverName[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-bold tracking-wide">@{receiverName}</h3>
            <p className="text-[#00d4ff] text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span> Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 italic">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user.id;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 px-4 rounded-2xl text-[15px] shadow-md relative ${
                  isMe 
                    ? 'bg-[#2563eb] text-white rounded-tr-none' // CHANGED: Sleek Royal Blue
                    : 'bg-[#1e2d45] text-white rounded-tl-none border border-[#1e2d45]'
                }`}>
                  {msg.content}
                  
                  {/* Timestamp & Read Receipts */}
                  <div className={`flex items-center justify-end gap-1.5 text-[10px] mt-1.5 ${isMe ? 'text-blue-200/80' : 'text-gray-400'}`}>
                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {/* The Ticks (Only show on messages YOU sent) */}
                    {isMe && (
                      <span className="text-[14px] leading-none tracking-tighter flex items-center">
                        {msg.is_read ? (
                          <span className="text-[#00d4ff] font-black drop-shadow-md" title="Seen">✓✓</span> 
                        ) : (
                          <span className="text-blue-200/50 font-bold" title="Sent">✓</span> 
                        )}
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-[#0f172a] border-t border-[#1e2d45] flex gap-3">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message @${receiverName}...`}
          className="flex-1 bg-[#0a0e1a] border border-[#1e2d45] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#00d4ff] transition-all placeholder-gray-600"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()} 
          className="bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

