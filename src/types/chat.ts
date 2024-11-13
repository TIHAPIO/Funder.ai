export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  attachments?: Attachment[];
  reactions?: MessageReaction[];
  replyTo?: string; // ID of the message being replied to
  readBy: string[]; // Array of user IDs who have read the message
  threadId?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  createdAt: Date;
  typingUsers: string[]; // Array of user IDs currently typing
  unreadCount?: number;
  isGroup: boolean;
  groupName?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  photoURL?: string;
  presence: UserPresence;
  lastSeen?: Date;
}

export interface UserPresence {
  status: 'online' | 'offline' | 'away';
  lastActive: Date;
}

export interface Thread {
  id: string;
  parentMessageId: string;
  participantIds: string[];
  lastReplyAt: Date;
  replyCount: number;
}
