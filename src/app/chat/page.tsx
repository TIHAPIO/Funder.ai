'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChatRoom as ChatRoomType } from '@/types/chat';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { ContactBook } from '@/components/chat/ContactBook';
import { Button } from '@/components/ui/button';
import { getUserChatRooms, createChatRoom } from '@/lib/chat-utils';
import { MessageSquare, Plus, Users, Book } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactBook, setShowContactBook] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadChatRooms = async () => {
      try {
        const rooms = await getUserChatRooms(user.uid);
        setChatRooms(rooms);
        if (rooms.length > 0 && !selectedRoomId) {
          setSelectedRoomId(rooms[0].id);
        }
      } catch (error) {
        console.error('Error loading chat rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatRooms();
  }, [user, selectedRoomId]);

  const handleCreateRoom = async () => {
    if (!user) return;
    setShowContactBook(true);
  };

  const handleChatCreated = async (roomId: string) => {
    setSelectedRoomId(roomId);
    // Refresh the room list
    if (user) {
      const rooms = await getUserChatRooms(user.uid);
      setChatRooms(rooms);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Please log in to access chat.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading chats...</p>
      </div>
    );
  }

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
            Neuer Chat
          </Button>
          <Button
            onClick={() => setShowContactBook(true)}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Book className="h-4 w-4" />
            Kontaktbuch
          </Button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-105px)]">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={`
                w-full px-4 py-3 flex items-center gap-3 hover:bg-accent
                ${room.id === selectedRoomId ? 'bg-accent' : ''}
              `}
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
                  {room.unreadCount}
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
            <h3 className="text-lg font-medium mb-2">Kein Chat ausgewählt</h3>
            <p className="text-muted-foreground mb-4">
              Wähle einen Chat aus der Seitenleiste oder erstelle einen neuen Chat
            </p>
            <Button onClick={handleCreateRoom}>
              <Plus className="h-4 w-4 mr-2" />
              Neuen Chat erstellen
            </Button>
          </div>
        )}
      </div>

      {/* Contact Book Modal */}
      {showContactBook && (
        <ContactBook
          onClose={() => setShowContactBook(false)}
          onChatCreated={handleChatCreated}
        />
      )}
    </div>
  );
}
