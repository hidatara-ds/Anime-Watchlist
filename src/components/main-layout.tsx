'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SidebarNavigation } from './sidebar-navigation';
import { AiChatBubble } from './ai-chat-bubble';
import { FloatingActionButton, ChatFloatingButton } from './floating-action-button';
import { AddAnimeModal } from './add-anime-modal';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
  onAddAnime?: (anime: any) => Promise<void>;
}

export function MainLayout({ 
  children, 
  currentPage = 'dashboard',
  onPageChange,
  rightPanel,
  showRightPanel = false,
  onAddAnime
}: MainLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAddAnimeModalOpen, setIsAddAnimeModalOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleAddAnime = () => {
    setIsAddAnimeModalOpen(true);
  };

  const handleAddAnimeSubmit = async (animeData: any) => {
    if (onAddAnime) {
      await onAddAnime(animeData);
    }
    setIsAddAnimeModalOpen(false);
  };

  const handleOpenStats = () => {
    onPageChange?.('statistics');
  };

  const handleOpenSettings = () => {
    onPageChange?.('settings');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar Navigation */}
      <SidebarNavigation 
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      {/* Main Content Area */}
      <motion.main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-80'
        }`}
        layout
      >
        <div className={`flex h-screen ${showRightPanel ? 'mr-80' : ''}`}>
          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              {children}
            </div>
          </div>

          {/* Right Panel (Optional) */}
          {showRightPanel && rightPanel && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="w-80 bg-[var(--bg-secondary)] border-l border-[var(--border-color)] fixed right-0 top-0 h-full z-30 overflow-auto"
            >
              {rightPanel}
            </motion.aside>
          )}
        </div>
      </motion.main>

      {/* Floating Action Button */}
      <FloatingActionButton
        onAddAnime={handleAddAnime}
        onOpenChat={handleOpenChat}
        onOpenStats={handleOpenStats}
        onOpenSettings={handleOpenSettings}
      />

      {/* Chat Floating Button */}
      <ChatFloatingButton onClick={handleOpenChat} />

      {/* AI Chat Bubble */}
      {isChatOpen && (
        <AiChatBubble 
          position="floating"
        />
      )}

      {/* Add Anime Modal */}
      <AddAnimeModal
        isOpen={isAddAnimeModalOpen}
        onClose={() => setIsAddAnimeModalOpen(false)}
        onAdd={handleAddAnimeSubmit}
      />

      {/* Global keyboard shortcuts */}
      <div className="hidden">
        {/* This will handle global shortcuts like "/" for search */}
      </div>
    </div>
  );
}
