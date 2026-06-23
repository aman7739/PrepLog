import EmojiPicker from 'emoji-picker-react';
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from "../context/AuthContext";

const Chat = ({ selectedConvoId, receiverName = "Developer" }) => {
  const { messages, sendMessage, sendMedia, isUploading, loading } = useChat(selectedConvoId);
  const { user } = useAuth();
  
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null); 
  
  // NEW: State to control the attachment pop-up menu
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  const scrollRef = useRef();
  
  // NEW: Two separate refs for the two different file types
  const imageInputRef = useRef();
  const docInputRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    sendMedia(file);
    e.target.value = null; 
    setShowAttachMenu(false); // Close menu after selecting
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center text-[#00d4ff] p-10 animate-pulse">
      Loading encrypted chat...
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0e1a] overflow-hidden relative">
        
      {/* Chat Header */}
      <div className="p-4 bg-[#0f172a] border-b border-[#1e2d45] flex items-center justify-between z-10">
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
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar" onClick={() => {setShowAttachMenu(false); setShowEmojiPicker(false);}}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 italic">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user.id;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl text-[15px] shadow-md relative ${
                  isMe 
                    ? 'bg-[#2563eb] text-white rounded-tr-none'
                    : 'bg-[#1e2d45] text-white rounded-tl-none border border-[#1e2d45]'
                } ${msg.message_type === 'image' ? 'p-1' : 'p-3 px-4'}`}>
                  
                  {/* Media Rendering */}
                  {msg.message_type === 'image' ? (
                    <div 
                      className="cursor-pointer overflow-hidden rounded-[12px] border border-white/20 shadow-sm"
                      onClick={() => setFullScreenImage(msg.media_url)}
                    >
                      <img 
                        src={msg.media_url} 
                        alt="Uploaded" 
                        className="w-full sm:max-w-[300px] h-auto max-h-[250px] object-cover hover:opacity-90 transition-opacity block"
                      />
                    </div>
                  ) : msg.message_type === 'document' ? (
                     <a 
                       href={msg.media_url} 
                       target="_blank" 
                       rel="noreferrer" 
                       className={`flex items-center gap-3 p-3 rounded-lg mb-1 w-full sm:w-[280px] transition-colors ${
                         isMe ? 'bg-[#1d4ed8] hover:bg-[#1e40af]' : 'bg-[#0f172a] hover:bg-[#0a0e1a]'
                       }`}
                     >
                        <div className="text-3xl drop-shadow-md">📄</div>
                        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                           <span className="block truncate text-sm font-bold text-white">
                             {msg.content.replace('📄 ', '')}
                           </span>
                           <span className="text-xs text-gray-300">Document</span>
                        </div>
                        <div className="text-white bg-black/20 p-1.5 rounded-full">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </div>
                     </a>
                  ) : (
                    <div className="break-words">{msg.content}</div>
                  )}
                  
                  {/* Timestamp & Read Receipts */}
                  <div className={`flex items-center justify-end gap-1.5 text-[10px] mt-1 ${isMe ? 'text-blue-200/80' : 'text-gray-400'} ${msg.message_type === 'image' ? 'px-1 pb-0.5' : ''}`}>
                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
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
        
        {isUploading && (
           <div className="flex justify-end">
              <div className="bg-[#2563eb]/50 text-white p-3 px-4 rounded-2xl rounded-tr-none text-[14px] animate-pulse">
                 Uploading media...
              </div>
           </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Emoji Picker UI */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-40 shadow-2xl">
          <EmojiPicker 
            onEmojiClick={onEmojiClick} 
            theme="dark" 
            autoFocusSearch={false}
          />
        </div>
      )}

      {/* NEW: WhatsApp-Style Attachment Menu */}
      {/* NEW: WhatsApp-Style Attachment Menu */}
      {showAttachMenu && (
        <div className="absolute bottom-20 left-4 sm:left-16 z-50 bg-[#1e2d45] rounded-2xl shadow-2xl p-2 w-56 border border-white/10 animate-fade-in-up">
          
          {/* Document Option */}
          <button 
            type="button"
            onClick={() => docInputRef.current.click()}
            className="flex items-center gap-4 w-full p-3 hover:bg-[#2a3f5f] rounded-xl transition-all text-white group"
          >
            <div className="w-10 h-10 rounded-full bg-[#4f46e5]/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
              <svg className="w-5 h-5 text-[#818cf8]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
            </div>
            <span className="font-semibold tracking-wide whitespace-nowrap text-[15px]">Document</span>
          </button>
          
          {/* Photos & Videos Option */}
          <button 
            type="button"
            onClick={() => imageInputRef.current.click()}
            className="flex items-center gap-4 w-full p-3 hover:bg-[#2a3f5f] rounded-xl transition-all text-white group mt-1"
          >
            <div className="w-10 h-10 rounded-full bg-[#0284c7]/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
              <svg className="w-5 h-5 text-[#38bdf8]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
            </div>
            <span className="font-semibold tracking-wide whitespace-nowrap text-[15px]">Photos & videos</span>
          </button>

        </div>
      )}
      

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-[#0f172a] border-t border-[#1e2d45] flex gap-3 items-center z-10 relative">
        
        <button 
          type="button" 
          onClick={() => {
            setShowEmojiPicker((prev) => !prev);
            setShowAttachMenu(false); // Close attach menu if emoji opens
          }}
          className="text-gray-400 hover:text-[#00d4ff] transition-colors text-2xl"
        >
          😀
        </button>

        {/* The two hidden file inputs */}
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          accept="image/*"
        />
        <input 
          type="file" 
          ref={docInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          accept=".pdf,.doc,.docx,.txt"
        />

        {/* Modified Paperclip Button to toggle the menu */}
        <button 
          type="button" 
          onClick={() => {
            setShowAttachMenu((prev) => !prev);
            setShowEmojiPicker(false); // Close emoji picker if attach opens
          }}
          disabled={isUploading}
          className={`transition-colors text-2xl disabled:opacity-50 ${showAttachMenu ? 'text-[#FF6B9D]' : 'text-gray-400 hover:text-[#FF6B9D]'}`}
          title="Attach File"
        >
          📎
        </button>

        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onFocus={() => {setShowAttachMenu(false); setShowEmojiPicker(false);}} // Close menus when typing
          placeholder={isUploading ? "Uploading..." : `Message @${receiverName}...`}
          disabled={isUploading}
          className="flex-1 bg-[#0a0e1a] border border-[#1e2d45] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#00d4ff] transition-all placeholder-gray-600 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim() || isUploading} 
          className="bg-gradient-to-r from-[#00d4ff] to-[#FF6B9D] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          Send
        </button>
      </form>

      {/* Full Screen Image Modal (Lightbox) */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 cursor-pointer"
          onClick={() => setFullScreenImage(null)}
        >
          <button className="absolute top-4 right-6 text-white text-4xl hover:text-[#FF6B9D] transition-colors">
            &times;
          </button>
          <img 
            src={fullScreenImage} 
            alt="Full screen" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
};

export default Chat;
