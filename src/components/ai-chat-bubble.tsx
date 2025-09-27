'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X } from 'lucide-react';
import Image from 'next/image';

export function AiChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${isOpen ? 'block' : 'hidden'} w-80 md:w-96`}>
        <Card className="flex flex-col h-[400px]">
          <CardHeader className="flex flex-row items-center justify-between bg-muted py-2 px-4">
            <div className="flex items-center gap-2">
                <Image src="/favicon.ico" alt="AI Assistant" width={24} height={24} />
                <CardTitle className="text-base font-medium">AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-4 overflow-y-auto">
            {/* Placeholder for chat messages */}
            <div className="text-center text-sm text-muted-foreground">
              Ask me about anime recommendations!
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <Input placeholder="Type your message..." />
          </div>
        </Card>
      </div>

      <Button 
        size="icon" 
        className={`rounded-full h-16 w-16 shadow-lg ${isOpen ? 'hidden' : 'flex'}`}
        onClick={() => setIsOpen(true)}
      >
        <Image src="/favicon.ico" alt="AI Assistant" width={40} height={40} />
      </Button>
    </div>
  );
}
