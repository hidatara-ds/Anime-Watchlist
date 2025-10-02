'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Minimize2, 
  Maximize2, 
  X,
  Bot,
  User,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AiChatBubbleProps {
  position?: 'sidebar' | 'floating';
  onClose?: () => void;
}

export function AiChatBubble({ position = 'floating', onClose }: AiChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m AniSensei, your anime assistant! ✨ I can help you explore your watchlist, recommend anime based on what you\'ve watched, and answer questions about your viewing habits. What would you like to know?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again. 😅',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (position === 'floating') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed bottom-4 right-4 w-96 h-[500px] z-50"
          >
            <Card className="glass h-full flex flex-col overflow-hidden shadow-2xl border border-[var(--accent-primary)]/20">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border-b border-[var(--border-color)] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10 ring-2 ring-[var(--accent-primary)]/30">
                        <AvatarFallback className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-[var(--font-heading)] text-[var(--text-primary)] flex items-center">
                        AniSensei
                        <Sparkles className="w-4 h-4 ml-1 text-[var(--accent-primary)]" />
                      </CardTitle>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {isTyping ? 'Typing...' : 'Online'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="flex-1 overflow-hidden"
                  >
                    <CardContent className="h-full flex flex-col p-0">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                          {messages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex items-start space-x-2 max-w-[80%]`}>
                                {message.sender === 'ai' && (
                                  <Avatar className="w-8 h-8 mt-1">
                                    <AvatarFallback className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-xs">
                                      <Bot className="w-4 h-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={`rounded-2xl px-4 py-3 ${
                                    message.sender === 'user'
                                      ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'
                                      : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]'
                                  }`}
                                >
                                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.text}
                                  </div>
                                  <div className={`text-xs mt-1 ${
                                    message.sender === 'user' ? 'text-white/70' : 'text-[var(--text-tertiary)]'
                                  }`}>
                                    {message.timestamp.toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </div>
                                </div>
                                {message.sender === 'user' && (
                                  <Avatar className="w-8 h-8 mt-1">
                                    <AvatarFallback className="bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                                      <User className="w-4 h-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                          >
                            <div className="flex items-start space-x-2">
                              <Avatar className="w-8 h-8 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-xs">
                                  <Bot className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-4 py-3">
                                <div className="flex space-x-1">
                                  <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                    className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                                  />
                                  <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                    className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                                  />
                                  <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                    className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="p-4 border-t border-[var(--border-color)]">
                        <div className="flex items-center space-x-2">
                          <Input 
                            placeholder="Ask about your anime..." 
                            className="flex-1 bg-[var(--bg-tertiary)] border-[var(--border-color)] focus:border-[var(--accent-primary)]"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                          />
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button 
                              size="sm" 
                              onClick={sendMessage}
                              disabled={!inputValue.trim() || isLoading}
                              className="btn-gradient h-10 w-10 p-0"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Sidebar version (simplified)
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[var(--border-color)]">
        <h3 className="font-semibold text-[var(--text-primary)] flex items-center">
          <Bot className="w-5 h-5 mr-2 text-[var(--accent-primary)]" />
          AniSensei
        </h3>
      </div>
      {/* Sidebar chat content - simplified version */}
    </div>
  );
}
