'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircle, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onAddAnime?: () => void;
  onOpenChat?: () => void;
  onOpenStats?: () => void;
  onOpenSettings?: () => void;
}

export function FloatingActionButton({
  onAddAnime,
  onOpenChat,
  onOpenStats,
  onOpenSettings
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Plus,
      label: 'Add Anime',
      onClick: onAddAnime,
      gradient: 'from-green-500 to-emerald-600',
      delay: 0.1
    },
    {
      icon: MessageCircle,
      label: 'Chat with AniSensei',
      onClick: onOpenChat,
      gradient: 'from-blue-500 to-cyan-600',
      delay: 0.2
    },
    {
      icon: BarChart3,
      label: 'View Statistics',
      onClick: onOpenStats,
      gradient: 'from-purple-500 to-violet-600',
      delay: 0.3
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: onOpenSettings,
      gradient: 'from-gray-500 to-slate-600',
      delay: 0.4
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 flex flex-col space-y-3"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0, x: 20 }}
                  transition={{ 
                    delay: action.delay,
                    type: 'spring',
                    stiffness: 200,
                    damping: 10
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3"
                >
                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: action.delay + 0.1 }}
                    className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-2 rounded-lg text-sm font-medium shadow-lg border border-[var(--border-color)] whitespace-nowrap"
                  >
                    {action.label}
                  </motion.div>

                  {/* Action Button */}
                  <Button
                    size="lg"
                    onClick={() => {
                      action.onClick?.();
                      setIsOpen(false);
                    }}
                    className={`w-12 h-12 rounded-full shadow-lg bg-gradient-to-br ${action.gradient} hover:shadow-xl transition-all duration-200 border-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <Button
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full btn-gradient shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.div>
          
          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </motion.div>

      {/* Background overlay when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Chat FAB - separate floating button for chat
export function ChatFloatingButton({ onClick }: { onClick?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-40"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          size="lg"
          onClick={onClick}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-lg hover:shadow-xl transition-all duration-300 border-0 relative overflow-hidden"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          
          {/* Notification dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        </Button>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.8 }}
              className="absolute bottom-0 left-16 bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-2 rounded-lg text-sm font-medium shadow-lg border border-[var(--border-color)] whitespace-nowrap"
            >
              Chat with AniSensei
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[var(--bg-tertiary)] border-l border-b border-[var(--border-color)] rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
