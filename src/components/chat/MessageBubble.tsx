import { useState } from 'react';
import Image from 'next/image';
import { Message, MessageReaction } from '@/types/chat';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Smile, Reply, Check, CheckCheck, FileIcon } from 'lucide-react';
import { addMessageReaction } from '@/lib/chat-utils';

interface MessageBubbleProps {
  message: Message;
  roomId: string;
  onReply?: (messageId: string) => void;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😊', '😂', '🎉', '👏', '🔥', '💯'];

export function MessageBubble({ message, roomId, onReply }: MessageBubbleProps) {
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isOwnMessage = user?.uid === message.senderId;

  const handleReaction = async (emoji: string) => {
    if (!user) return;
    try {
      await addMessageReaction(roomId, message.id, user.uid, emoji);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const getReadStatus = () => {
    if (!message.readBy) return null;
    const readByOthers = message.readBy.filter(id => id !== message.senderId);
    if (readByOthers.length === 0) return <Check className="h-4 w-4 text-gray-400" />;
    return <CheckCheck className="h-4 w-4 text-blue-500" />;
  };

  const renderAttachments = () => {
    if (!message.attachments?.length) return null;
    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map(attachment => (
          <div
            key={attachment.id}
            className="flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800"
          >
            {attachment.type === 'image' ? (
              <div className="relative w-32 h-32">
                <Image
                  src={attachment.url}
                  alt={attachment.name}
                  width={128}
                  height={128}
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5" />
                <span className="text-sm">{attachment.name}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round(attachment.size / 1024)}KB)
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderReactions = () => {
    if (!message.reactions?.length) return null;
    const reactionCounts = message.reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <div
            key={emoji}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm"
          >
            <span>{emoji}</span>
            <span className="text-xs text-gray-500">{count}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'flex w-full',
        isOwnMessage ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-lg px-4 py-2 mb-2 relative group',
          isOwnMessage
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800'
        )}
      >
        {/* Reply indicator */}
        {message.replyTo && (
          <div className="text-xs opacity-70 mb-1">
            Replying to a message...
          </div>
        )}

        {/* Sender name */}
        {!isOwnMessage && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {message.senderName}
          </div>
        )}

        {/* Message content */}
        <div className="text-sm">{message.content}</div>

        {/* Attachments */}
        {renderAttachments()}

        {/* Reactions */}
        {renderReactions()}

        {/* Message metadata */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isOwnMessage && getReadStatus()}
        </div>

        {/* Action buttons */}
        <div className={cn(
          'absolute -top-8 right-0 flex items-center gap-1 p-1 rounded-md bg-white dark:bg-gray-900 shadow-md opacity-0 transition-opacity',
          'group-hover:opacity-100'
        )}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onReply?.(message.id)}
          >
            <Reply className="h-4 w-4" />
          </Button>
        </div>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute top-0 right-0 mt-8 p-2 grid grid-cols-4 gap-1 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10">
            {EMOJI_OPTIONS.map(emoji => (
              <button
                key={emoji}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
