import { BaseDocument } from '../lib/services/base';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    imageUrl?: string;
  };
}

export interface ChatParticipant {
  id: string;
  lastSeen: string;
  typing: boolean;
}

export interface Chat extends BaseDocument {
  participants: Record<string, ChatParticipant>;
  lastMessage?: ChatMessage;
  lastActivity: string;
  type: 'direct' | 'group';
  name?: string; // For group chats
  imageUrl?: string; // For group chats
  metadata?: {
    createdBy: string;
    description?: string;
    isEncrypted?: boolean;
  };
}

export interface ChatNotification {
  chatId: string;
  messageId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatAttachment {
  id: string;
  chatId: string;
  messageId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedBy: string;
  timestamp: string;
}
