import { db } from './firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { ChatRoom, Message, ChatParticipant, MessageReaction, Thread, Attachment } from '@/types/chat';

const storage = getStorage();

// User Functions
export const getAllUsers = async (): Promise<ChatParticipant[]> => {
  try {
    const usersQuery = query(collection(db, 'users'));
    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || 'Unknown User',
      photoURL: doc.data().photoURL,
      presence: doc.data().presence || {
        status: 'offline',
        lastActive: new Date(),
      },
      lastSeen: doc.data().lastSeen?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Group Chat Functions
export const createGroupChat = async (
  participants: string[],
  groupName?: string
): Promise<string> => {
  try {
    const chatRoomRef = await addDoc(collection(db, 'chatRooms'), {
      participants,
      groupName,
      createdAt: serverTimestamp(),
      typingUsers: [],
      unreadCount: 0,
      isGroup: participants.length > 2,
    });
    return chatRoomRef.id;
  } catch (error) {
    console.error('Error creating group chat:', error);
    throw error;
  }
};

// File Upload Functions
export const uploadAttachment = async (
  file: File,
  roomId: string,
  messageId: string,
  senderId: string
): Promise<Attachment> => {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `chat-attachments/${roomId}/${messageId}/${fileName}`;
  const storageRef = ref(storage, filePath);

  // Add metadata
  const metadata = {
    contentType: file.type,
    senderId: senderId,
  };

  try {
    await uploadBytes(storageRef, file, { customMetadata: metadata });
    const downloadURL = await getDownloadURL(storageRef);

    const attachment: Attachment = {
      id: messageId + '-' + fileName,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      url: downloadURL,
      name: file.name,
      size: file.size,
      mimeType: file.type,
    };

    return attachment;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Message Functions
export const sendMessage = async (
  roomId: string,
  content: string,
  senderId: string,
  senderName: string,
  replyTo?: string,
  threadId?: string,
  attachment?: File
) => {
  try {
    const messageData: any = {
      content,
      senderId,
      senderName,
      timestamp: serverTimestamp(),
      readBy: [senderId],
      replyTo,
      threadId,
      reactions: [],
      attachments: [],
    };

    const messageRef = await addDoc(collection(db, `chatRooms/${roomId}/messages`), messageData);

    // Handle file attachment if provided
    if (attachment) {
      const attachmentData = await uploadAttachment(attachment, roomId, messageRef.id, senderId);
      await updateDoc(messageRef, {
        attachments: arrayUnion(attachmentData),
      });
    }

    // Update last message in chat room
    const roomRef = doc(db, 'chatRooms', roomId);
    await updateDoc(roomRef, {
      lastMessage: {
        content,
        timestamp: serverTimestamp(),
      },
      typingUsers: arrayRemove(senderId),
    });

    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const subscribeToMessages = (
  roomId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesQuery = query(
    collection(db, `chatRooms/${roomId}/messages`),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as Message[];
    callback(messages);
  });
};

// Chat Room Functions
export const createChatRoom = async (participants: string[]) => {
  try {
    const chatRoomRef = await addDoc(collection(db, 'chatRooms'), {
      participants,
      createdAt: serverTimestamp(),
      typingUsers: [],
      unreadCount: 0,
      isGroup: false,
    });
    return chatRoomRef.id;
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw error;
  }
};

export const getUserChatRooms = async (userId: string) => {
  try {
    const roomsQuery = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', userId)
    );
    const snapshot = await getDocs(roomsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastMessage: doc.data().lastMessage
        ? {
            ...doc.data().lastMessage,
            timestamp: doc.data().lastMessage.timestamp?.toDate(),
          }
        : undefined,
    })) as ChatRoom[];
  } catch (error) {
    console.error('Error getting user chat rooms:', error);
    throw error;
  }
};

// User Presence and Typing Indicators
export const updateUserPresence = async (userId: string, status: 'online' | 'offline' | 'away') => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      presence: {
        status,
        lastActive: serverTimestamp(),
      },
    });
  } catch (error) {
    console.error('Error updating user presence:', error);
    throw error;
  }
};

export const setTypingStatus = async (roomId: string, userId: string, isTyping: boolean) => {
  try {
    const roomRef = doc(db, 'chatRooms', roomId);
    await updateDoc(roomRef, {
      typingUsers: isTyping ? arrayUnion(userId) : arrayRemove(userId),
    });
  } catch (error) {
    console.error('Error updating typing status:', error);
    throw error;
  }
};

// Message Reactions and Read Receipts
export const addMessageReaction = async (
  roomId: string,
  messageId: string,
  userId: string,
  emoji: string
) => {
  try {
    const messageRef = doc(db, `chatRooms/${roomId}/messages`, messageId);
    const reaction: MessageReaction = {
      emoji,
      userId,
      timestamp: new Date(),
    };
    await updateDoc(messageRef, {
      reactions: arrayUnion(reaction),
    });
  } catch (error) {
    console.error('Error adding message reaction:', error);
    throw error;
  }
};

export const markMessageAsRead = async (roomId: string, messageId: string, userId: string) => {
  try {
    const messageRef = doc(db, `chatRooms/${roomId}/messages`, messageId);
    await updateDoc(messageRef, {
      readBy: arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// Thread Functions
export const createThread = async (
  roomId: string,
  parentMessageId: string,
  participantIds: string[]
) => {
  try {
    const threadRef = await addDoc(collection(db, `chatRooms/${roomId}/threads`), {
      parentMessageId,
      participantIds,
      lastReplyAt: serverTimestamp(),
      replyCount: 0,
    });
    return threadRef.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

export const subscribeToThread = (
  roomId: string,
  threadId: string,
  callback: (thread: Thread) => void
) => {
  const threadRef = doc(db, `chatRooms/${roomId}/threads`, threadId);
  return onSnapshot(threadRef, (snapshot) => {
    const thread = {
      id: snapshot.id,
      ...snapshot.data(),
      lastReplyAt: snapshot.data()?.lastReplyAt?.toDate(),
    } as Thread;
    callback(thread);
  });
};

// Participant Info
export const getParticipantInfo = async (userId: string): Promise<ChatParticipant> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    const userData = userDoc.data();
    return {
      id: userId,
      name: userData.name || 'Unknown User',
      photoURL: userData.photoURL,
      presence: userData.presence || {
        status: 'offline',
        lastActive: new Date(),
      },
      lastSeen: userData.lastSeen?.toDate(),
    };
  } catch (error) {
    console.error('Error getting participant info:', error);
    throw error;
  }
};
