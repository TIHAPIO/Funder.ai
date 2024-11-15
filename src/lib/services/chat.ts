import { BaseFirestoreService } from './base';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limitToLast,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { Chat, ChatMessage, ChatParticipant } from '../../types/chat';

export class ChatService extends BaseFirestoreService<Chat> {
  private messagesCollection = 'messages';

  constructor() {
    super('chats');
  }

  async createChat(participants: string[]): Promise<string> {
    const participantsMap: Record<string, ChatParticipant> = {};
    participants.forEach(userId => {
      participantsMap[userId] = {
        id: userId,
        lastSeen: new Date().toISOString(),
        typing: false
      };
    });

    const chatData = {
      participants: participantsMap,
      lastActivity: new Date().toISOString(),
      type: participants.length === 2 ? 'direct' : 'group',
      metadata: {
        createdBy: auth.currentUser?.uid || '',
        isEncrypted: false
      }
    };

    return this.create(chatData as Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>);
  }

  async sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text', metadata = {}): Promise<string> {
    const messageData: Omit<ChatMessage, 'id'> = {
      content,
      senderId: auth.currentUser?.uid || '',
      timestamp: new Date().toISOString(),
      type,
      metadata
    };

    const chatRef = this.getDocRef(chatId);
    const messagesRef = collection(chatRef, this.messagesCollection);
    const messageDoc = await addDoc(messagesRef, messageData);

    // Update chat's last activity and last message
    await updateDoc(chatRef, {
      lastActivity: messageData.timestamp,
      lastMessage: {
        ...messageData,
        id: messageDoc.id
      }
    });

    return messageDoc.id;
  }

  async getMessages(chatId: string, messageLimit = 50): Promise<ChatMessage[]> {
    const chatRef = this.getDocRef(chatId);
    const messagesRef = collection(chatRef, this.messagesCollection);
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limitToLast(messageLimit));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as ChatMessage[];
  }

  subscribeToChat(chatId: string, callback: (chat: Chat) => void): Unsubscribe {
    const chatRef = this.getDocRef(chatId);
    return onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        callback({
          ...doc.data(),
          id: doc.id
        } as Chat);
      }
    });
  }

  subscribeToMessages(chatId: string, callback: (messages: ChatMessage[]) => void): Unsubscribe {
    const chatRef = this.getDocRef(chatId);
    const messagesRef = collection(chatRef, this.messagesCollection);
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limitToLast(50));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as ChatMessage[];
      callback(messages);
    });
  }

  async updateTypingStatus(chatId: string, isTyping: boolean): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const chatRef = this.getDocRef(chatId);
    await updateDoc(chatRef, {
      [`participants.${userId}.typing`]: isTyping,
      [`participants.${userId}.lastSeen`]: new Date().toISOString()
    });
  }

  async updateLastSeen(chatId: string): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const chatRef = this.getDocRef(chatId);
    await updateDoc(chatRef, {
      [`participants.${userId}.lastSeen`]: new Date().toISOString()
    });
  }

  async getUserChats(): Promise<Chat[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const q = query(
      this.getCollection(),
      where(`participants.${userId}.id`, '==', userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Chat[];
  }

  async markMessageAsRead(chatId: string, messageId: string): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const chatRef = this.getDocRef(chatId);
    await updateDoc(chatRef, {
      [`participants.${userId}.lastSeen`]: new Date().toISOString()
    });
  }
}

export const chatService = new ChatService();
