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
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
            <div className="flex items-center gap-3">
              <Image src="/favicon.ico" alt="AI Assistant" width={28} height={28} />
              <CardTitle className="text-lg font-headline tracking-wide">
                AniSensei
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsOpen((v) => !v)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                {isOpen ? 'Hide' : 'Chat'}
              </Button>
            </div>
          </CardHeader>
          {isOpen && (
            <CardContent className="p-4">
              <div className="h-[280px] overflow-y-auto rounded-md border p-3 bg-background/60">
                <div className="text-sm text-muted-foreground">
                  Ask me about anime recommendations!
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button size="sm">Send</Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
