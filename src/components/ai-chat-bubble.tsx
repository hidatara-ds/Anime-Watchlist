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
    <div className="sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <Card className="supports-[backdrop-filter]:bg-background/80 border-b">
          <CardHeader className="flex flex-row items-center justify-between py-1.5 px-4">
            <div className="flex items-center gap-2">
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
            <CardContent className="p-3">
              <div className="h-[260px] overflow-y-auto rounded-md border p-3 bg-background/60">
                <div className="text-sm text-muted-foreground">
                  Ask me about anime recommendations!
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
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
