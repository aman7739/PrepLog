import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from '../components/chat/ChatSidebar';
import Chat from './Chat';

const ChatMessenger = () => {
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  const navigate = useNavigate();
  
  // RESIZER & MOBILE STATE
  // Start the sidebar at 30% of the screen width
  const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth * 0.3);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track window size to switch between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // If the window resizes, ensure the sidebar stays within bounds
      if (window.innerWidth >= 768) {
        setSidebarWidth(prev => 
          Math.min(Math.max(prev, window.innerWidth * 0.2), window.innerWidth * 0.7)
        );
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConvo = (id, name) => {
    setActiveConvoId(id);
    setReceiverName(name);
  };

  // --- DRAG TO RESIZE LOGIC (Desktop Only) ---
  const handleMouseDown = (e) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || isMobile) return;
    
    // Calculate limits: Minimum 20%, Maximum 70% of the screen width
    const minWidth = window.innerWidth * 0.20;
    const maxWidth = window.innerWidth * 0.70;
    
    // Clamp the new width between those two values
    const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
    setSidebarWidth(newWidth);
  }, [isDragging, isMobile]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  // ---------------------------------------------

  return (
    // FULL SCREEN WRAPPER
    <div className="flex h-screen w-full bg-[#0a0e1a] overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <div 
        style={{ width: isMobile ? '100%' : sidebarWidth }} 
        className={`flex-shrink-0 h-full overflow-hidden ${activeConvoId && isMobile ? 'hidden' : 'block'}`}
      >
        <ChatSidebar
          onSelectConvo={handleSelectConvo}
          activeConvoId={activeConvoId}
        />
      </div>

      {/* 2. DRAGGABLE DIVIDER (Hidden on Mobile) */}
      {!isMobile && (
        <div
          onMouseDown={handleMouseDown}
          className={`w-1 cursor-col-resize z-50 transition-colors ${
            isDragging ? 'bg-[#00d4ff]' : 'bg-[#1e2d45] hover:bg-[#00d4ff]/50'
          }`}
        />
      )}

      {/* 3. CHAT AREA */}
      <div className={`flex-1 h-full relative flex-col bg-[#0a0e1a] overflow-hidden ${!activeConvoId && isMobile ? 'hidden' : 'flex'}`}>
        
        {/* Navigation Button */}
        {isMobile ? (
          <button 
            onClick={() => setActiveConvoId(null)}
            className="absolute top-4 right-4 z-10 bg-[#1e2d45]/80 hover:bg-[#1e2d45] text-white px-3 py-1.5 rounded-lg text-sm transition-all border border-[#1e2d45] shadow-lg backdrop-blur-sm"
          >
            ← Back
          </button>
        ) : (
          <button 
            onClick={() => navigate('/dashboard')}
            className="absolute top-4 right-6 z-10 bg-[#1e2d45]/50 hover:bg-[#1e2d45] text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-all"
          >
            ✕ Close Chat
          </button>
        )}

        {/* Chat Content */}
        {activeConvoId ? (
          <Chat selectedConvoId={activeConvoId} receiverName={receiverName} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#1e2d45]/30 flex items-center justify-center border border-[#1e2d45] mb-6 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
              <span className="text-4xl">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">PrepLog Messenger</h2>
            <p className="text-gray-500 max-w-sm text-center text-sm">
              Select a developer from the sidebar to start a real-time conversation.
            </p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ChatMessenger;

