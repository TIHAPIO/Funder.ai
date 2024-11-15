'use client';

import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Plus, Book, Users, MessageSquare, Loader2 } from 'lucide-react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { ContactBook } from '@/components/chat/ContactBook';
import { useState } from 'react';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showContactBook, setShowContactBook] = useState(false);
  const [chatRooms, setChatRooms] = useState<any[]>([]);

  if (!user && !loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>{t('chat:loginRequired')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>{t('chat:loading')}</p>
      </div>
    );
  }

  const handleCreateRoom = () => {
    // Implementation for creating a new chat room
  };

  const handleChatCreated = (chatId: string) => {
    setSelectedRoomId(chatId);
    setShowContactBook(false);
  };

  return (
    <div className="flex h-full">
      {/* Chat rooms sidebar */}
      <div className="w-64 border-r border-border bg-background">
        <div className="p-4 border-b border-border space-y-2">
          <Button
            onClick={handleCreateRoom}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('chat:newChat')}
          </Button>
          <Button
            onClick={() => setShowContactBook(true)}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Book className="h-4 w-4" />
            {t('chat:contactBook')}
          </Button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-105px)]">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors ${
                selectedRoomId === room.id ? 'bg-accent' : ''
              }`}
            >
              {room.isGroup ? (
                <Users className="h-5 w-5" />
              ) : (
                <MessageSquare className="h-5 w-5" />
              )}
              <div className="flex-1 text-left">
                <div className="font-medium">
                  {room.groupName || `Chat ${room.id.slice(0, 6)}...`}
                </div>
                {room.lastMessage && (
                  <div className="text-sm text-muted-foreground truncate">
                    {room.lastMessage.content}
                  </div>
                )}
              </div>
              {room.unreadCount ? (
                <div className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {t('chat:unreadMessages', { count: room.unreadCount })}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1">
        {selectedRoomId ? (
          <ChatRoom roomId={selectedRoomId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Users className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">{t('chat:noChatSelected.title')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('chat:noChatSelected.description')}
            </p>
            <Button onClick={handleCreateRoom}>
              <Plus className="h-4 w-4 mr-2" />
              {t('chat:noChatSelected.createNew')}
            </Button>
          </div>
        )}
      </div>

      {showContactBook && (
        <ContactBook 
          onClose={() => setShowContactBook(false)} 
          onChatCreated={handleChatCreated}
        />
      )}
    </div>
  );
}
