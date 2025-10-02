'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  List, 
  BarChart3, 
  Bot, 
  Settings, 
  User, 
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'my-anime', label: 'My Anime List', icon: List },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'anisensei', label: 'AniSensei', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const tierInfo = {
  current: 'A',
  progress: 75,
  nextTier: 'S'
};

export function SidebarNavigation({ currentPage = 'dashboard', onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const textVariants = {
    expanded: { opacity: 1, display: 'block' },
    collapsed: { opacity: 0, display: 'none' }
  };

  return (
    <motion.div
      className="h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col fixed left-0 top-0 z-40"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-6 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="flex items-center space-x-2"
                variants={textVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-[var(--font-heading)] text-[var(--text-primary)]">
                    AnimeLogger
                  </h1>
                  <p className="text-xs text-[var(--text-tertiary)]">Your anime companion</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.div key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                onClick={() => onPageChange?.(item.id)}
                className={`w-full justify-start h-12 relative overflow-hidden transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--bg-hover)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10"
                    layoutId="activeTab"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} z-10`} />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      className="z-10 font-medium"
                      variants={textVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <Card className="glass p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 ring-2 ring-[var(--accent-primary)]/20">
              <AvatarImage src="/api/placeholder/40/40" alt="User Avatar" />
              <AvatarFallback className="bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                U
              </AvatarFallback>
            </Avatar>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  className="flex-1 min-w-0"
                  variants={textVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    Anime Enthusiast
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`tier-${tierInfo.current.toLowerCase()} text-xs px-2 py-0.5 animate-glow`}>
                      Tier {tierInfo.current}
                    </Badge>
                    <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-1.5">
                      <motion.div
                        className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${tierInfo.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    {tierInfo.progress}% to Tier {tierInfo.nextTier}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
