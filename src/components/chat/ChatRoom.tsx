import { useEffect, useRef, useState } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { 
  sendMessage, 
  subscribeToMessages, 
  setTypingStatus,
  markMessageAsRead,
  createThread
} from '@/lib/chat-utils';
import { Paperclip } from 'lucide-react';

interface ChatRoomProps {
  roomId: string;
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | undefined>();
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!roomId || !user) return;

    const unsubscribe = subscribeToMessages(roomId, (updatedMessages) => {
      setMessages(updatedMessages);
      // Mark new messages as read
      updatedMessages.forEach(message => {
        if (!message.readBy?.includes(user.uid)) {
          markMessageAsRead(roomId, message.id, user.uid);
        }
      });
    });

    return () => {
      unsubscribe();
      // Clear typing status when leaving the room
      if (user) {
        setTypingStatus(roomId, user.uid, false);
      }
    };
  }, [roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = () => {
    if (!user) return;

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set typing status to true
    setTypingStatus(roomId, user.uid, true);

    // Set new timeout to clear typing status after 2 seconds
    const timeout = setTimeout(() => {
      setTypingStatus(roomId, user.uid, false);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    try {
      await sendMessage(
        roomId,
        newMessage.trim(),
        user.uid,
        user.displayName || 'Anonymous',
        replyingTo
      );
      setNewMessage('');
      setReplyingTo(undefined);

      // Clear typing status after sending
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingStatus(roomId, user.uid, false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    try {
      // TODO: Implement file upload to storage
      // For now, we'll just send a message about the file
      await sendMessage(
        roomId,
        `Sent a file: ${file.name}`,
        user.uid,
        user.displayName || 'Anonymous'
      );
    } catch (error) {
      console.error('Error sending file:', error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
  };

  const handleStartThread = async (messageId: string) => {
    if (!user) return;
    try {
      const threadId = await createThread(roomId, messageId, [user.uid]);
      // TODO: Implement thread view
      console.log('Thread created:', threadId);
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            roomId={roomId}
            onReply={handleReply}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
          <span className="text-sm">Replying to a message</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(undefined)}
          >
            Cancel
          </Button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="border-t p-4 dark:border-gray-800"
      >
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
