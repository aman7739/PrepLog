import EmojiPicker from 'emoji-picker-react';
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from "../context/AuthContext";

import { useNavigate } from 'react-router-dom';

const Chat = ({ selectedConvoId, receiverName = "Developer", receiverId, onBack, isMobile }) => {
  const navigate = useNavigate();
  const { 
    messages, sendMessage, sendMedia, isUploading, loading,
    isBlocked, blockedBy, clearChat, toggleBlockUser
  } = useChat(selectedConvoId);
  const { user } = useAuth();
  
  const [showMenu, setShowMenu] = useState(false);
  
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
    setShowMenu(false);
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
    <div className="flex h-[70vh] items-center justify-center text-brand-primary p-10 animate-pulse">
      Loading encrypted chat...
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-brand-black overflow-hidden relative">
        
      {/* Chat Header */}
      <div className="p-4 bg-[#181818] border-b border-theme-border flex items-center justify-between z-20 relative" onClick={() => setShowMenu(false)}>
        <div className="flex items-center gap-3">
          {isMobile && (
             <button onClick={onBack} className="text-theme-textSec hover:text-white mr-1 p-1">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
             </button>
          )}
          <div 
             className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 -ml-1 rounded-lg transition-colors"
             onClick={() => {
               if (receiverId) navigate(`/profile/${receiverId}`);
             }}
             title="View Profile"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center font-bold text-white shadow-lg">
              {receiverName[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="text-theme-text font-bold tracking-wide">@{receiverName}</h3>
              <p className="text-brand-primary text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span> Online
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 relative">
          <button 
             onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
             className={`p-2 transition-colors rounded-full hover:bg-white/5 ${showMenu ? 'text-white bg-white/10' : 'text-theme-textSec hover:text-white'}`}
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
          </button>
          
          {showMenu && (
             <div className="absolute top-12 right-0 sm:right-24 w-48 bg-[#242424] border border-theme-border rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up">
               <button 
                 onClick={() => { setShowMenu(false); clearChat(); }} 
                 className="w-full text-left px-4 py-2 hover:bg-white/5 text-theme-text transition-colors"
               >
                 Clear chat
               </button>
               <button 
                 onClick={() => { setShowMenu(false); toggleBlockUser(); }} 
                 className={`w-full text-left px-4 py-2 hover:bg-white/5 transition-colors ${isBlocked && blockedBy === user.id ? 'text-brand-primary' : 'text-red-500'}`}
               >
                 {isBlocked && blockedBy === user.id ? 'Unblock User' : 'Block User'}
               </button>
               <div className="h-px bg-theme-border my-1"></div>
               <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-2 hover:bg-white/5 text-theme-textSec transition-colors">Report...</button>
             </div>
          )}

          {!isMobile && (
            <button 
              onClick={onBack}
              className="bg-[#181818]/50 hover:bg-[#181818] border border-theme-border text-theme-textSec hover:text-theme-text px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar" onClick={() => {setShowAttachMenu(false); setShowEmojiPicker(false); setShowMenu(false);}}>
        {messages.length === 0 ? (
          <div className="text-center text-theme-textSec mt-20 italic">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user.id;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[65%] lg:max-w-[50%] rounded-2xl text-[15px] shadow-md relative group ${
                  isMe 
                    ? 'bg-[#c85617] text-white rounded-tr-none'
                    : 'bg-[#242424] text-theme-text rounded-tl-none border border-theme-border'
                } ${msg.message_type === 'image' ? 'p-1 pb-6' : 'px-3 py-1.5'}`}>
                  
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
                       className={`flex items-center gap-3 p-3 rounded-lg mb-4 w-full sm:w-[280px] transition-colors ${
                         isMe ? 'bg-black/20 hover:bg-black/30' : 'bg-[#181818] hover:bg-white/5'
                       }`}
                     >
                        <div className="text-3xl drop-shadow-md">📄</div>
                        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                           <span className="block truncate text-sm font-bold text-white">
                             {msg.content.replace('📄 ', '')}
                           </span>
                           <span className="text-xs text-white/70">Document</span>
                        </div>
                        <div className="text-white bg-black/20 p-1.5 rounded-full">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </div>
                     </a>
                  ) : (
                    <div className="relative text-left">
                      <span className="break-words leading-snug whitespace-pre-wrap">{msg.content}</span>
                      {/* WhatsApp spacer hack: forces the last line to wrap earlier, leaving safe space for absolute timestamp */}
                      <span className="inline-block w-[65px] h-[10px]"></span>
                    </div>
                  )}
                  
                  {/* Timestamp & Read Receipts (Absolute positioned bottom right) */}
                  <div className={`absolute bottom-1.5 right-2.5 flex items-center gap-1 text-[10px] select-none ${isMe ? 'text-white/70' : 'text-theme-textSec'}`}>
                    <span className="translate-y-[0.5px]">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {isMe && (
                      <span className="text-[13px] leading-none flex items-center h-[10px]">
                        {msg.is_read ? (
                          <span className="text-[#93c5fd] font-black drop-shadow-sm tracking-[-3px] pl-1" title="Seen">✓✓</span> 
                        ) : (
                          <span className="text-white/60 font-bold ml-1" title="Sent">✓</span> 
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
               <div className="bg-brand-primary/50 text-white p-3 px-4 rounded-2xl rounded-tr-none text-[14px] animate-pulse">
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
        <div className="absolute bottom-20 left-4 sm:left-16 z-50 bg-[#242424] rounded-2xl shadow-2xl p-2 w-56 border border-theme-border animate-fade-in-up">
          
          {/* Document Option */}
          <button 
            type="button"
            onClick={() => docInputRef.current.click()}
            className="flex items-center gap-4 w-full p-3 hover:bg-white/5 rounded-xl transition-all text-theme-text group"
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
            className="flex items-center gap-4 w-full p-3 hover:bg-white/5 rounded-xl transition-all text-theme-text group mt-1"
          >
            <div className="w-10 h-10 rounded-full bg-[#0284c7]/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
              <svg className="w-5 h-5 text-[#38bdf8]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
            </div>
            <span className="font-semibold tracking-wide whitespace-nowrap text-[15px]">Photos & videos</span>
          </button>

        </div>
      )}

      {/* Message Input Area OR Blocked Message */}
      {isBlocked ? (
        <div className="p-6 bg-[#181818] border-t border-theme-border flex justify-center items-center">
          <p className="text-theme-textSec italic">
            {blockedBy === user.id ? "You blocked this user." : "You have been blocked by this user."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSend} className="p-4 bg-[#181818] border-t border-theme-border flex items-center gap-3 relative">
          
          {/* EMOJI PICKER POPUP */}
          {showEmojiPicker && (
             <div className="absolute bottom-20 left-4 z-50 shadow-2xl animate-fade-in-up">
               <EmojiPicker 
                 onEmojiClick={onEmojiClick} 
                 theme="dark" 
                 width={300}
                 height={400}
                 searchDisabled={false}
               />
             </div>
          )}

          {/* ATTACHMENT MENU POPUP */}
          {showAttachMenu && (
            <div className="absolute bottom-20 left-16 z-50 bg-[#242424] border border-theme-border rounded-xl shadow-2xl p-2 flex flex-col gap-1 w-40 animate-fade-in-up">
              <button 
                type="button"
                onClick={() => { imageInputRef.current?.click(); setShowAttachMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-theme-text hover:bg-white/5 rounded-lg transition-colors"
              >
                <span className="text-xl">📷</span> Image
              </button>
              <button 
                type="button"
                onClick={() => { docInputRef.current?.click(); setShowAttachMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-theme-text hover:bg-white/5 rounded-lg transition-colors"
              >
                <span className="text-xl">📄</span> Document
              </button>
            </div>
          )}
          
          <button 
            type="button" 
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
              setShowAttachMenu(false); // Close attach menu if emoji opens
            }}
            title="Emoji (Ctrl+E)"
            className="text-theme-textSec hover:text-brand-primary transition-colors text-2xl"
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
            className={`transition-colors text-2xl disabled:opacity-50 ${showAttachMenu ? 'text-[#FF6B9D]' : 'text-theme-textSec hover:text-[#FF6B9D]'}`}
            title="Attach File"
          >
            📎
          </button>

          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onFocus={() => {setShowAttachMenu(false); setShowEmojiPicker(false);}} // Close menus when typing
            onKeyDown={(e) => {
               // Keyboard shortcut for emoji picker
               if (e.key.toLowerCase() === 'e' && (e.ctrlKey || e.metaKey)) {
                 e.preventDefault();
                 setShowEmojiPicker(prev => !prev);
                 setShowAttachMenu(false);
               }
            }}
            placeholder={isUploading ? "Uploading..." : `Message @${receiverName}... (Ctrl+E for emojis)`}
            disabled={isUploading}
            className="flex-1 bg-brand-black border border-theme-border text-theme-text px-4 py-3 rounded-xl focus:outline-none focus:border-brand-primary transition-all placeholder-gray-600 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || isUploading} 
            className="bg-brand-primary text-theme-text px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            Send
          </button>
        </form>
      )}

      {/* Full Screen Image Modal (Lightbox) */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 cursor-pointer"
          onClick={() => setFullScreenImage(null)}
        >
          {/* Download Button */}
          <a 
            href={fullScreenImage} 
            download
            target="_blank"
            rel="noreferrer"
            className="absolute top-4 right-20 text-white bg-[#181818]/80 hover:bg-brand-primary p-2 px-4 rounded-full transition-colors flex items-center gap-2 text-sm font-bold shadow-lg border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download
          </a>

          <button className="absolute top-4 right-6 text-theme-text text-2xl hover:text-[#FF6B9D] transition-colors bg-[#181818]/80 hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-white/10">
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
