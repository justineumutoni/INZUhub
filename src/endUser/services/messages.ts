import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export type Conversation = {
  id: string;
  ownerName: string;
  propertyTitle: string;
  propertyId?: string;
  lastMessage: string;
  updatedAt?: Timestamp;
};

export type ChatMessage = {
  id: string;
  text: string;
  senderId: string;
  createdAt?: Timestamp;
};

function requireUserId(): string {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error('You must be signed in to use messages.');
  }
  return userId;
}

function conversationsCollection(userId: string) {
  return collection(db, 'users', userId, 'conversations');
}

export function subscribeToConversations(
  onChange: (conversations: Conversation[]) => void,
  onError: (error: Error) => void,
): () => void {
  try {
    const userId = requireUserId();
    const conversationsQuery = query(conversationsCollection(userId), orderBy('updatedAt', 'desc'));

    return onSnapshot(
      conversationsQuery,
      (snapshot: any) => {
        onChange(snapshot.docs.map((conversation: any) => ({
          id: conversation.id,
          ...(conversation.data() as Omit<Conversation, 'id'>),
        })));
      },
      onError,
    );
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unable to load conversations.'));
    return () => {};
  }
}

export function subscribeToMessages(
  conversationId: string,
  onChange: (messages: ChatMessage[]) => void,
  onError: (error: Error) => void,
): () => void {
  try {
    const userId = requireUserId();
    const messagesQuery = query(
      collection(conversationsCollection(userId), conversationId, 'messages'),
      orderBy('createdAt', 'asc'),
    );

    return onSnapshot(
      messagesQuery,
      (snapshot: any) => {
        onChange(snapshot.docs.map((message: any) => ({
          id: message.id,
          ...(message.data() as Omit<ChatMessage, 'id'>),
        })));
      },
      onError,
    );
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unable to load messages.'));
    return () => {};
  }
}

export async function createOrOpenConversation(input: {
  propertyId?: string;
  propertyTitle: string;
  ownerName: string;
}): Promise<string> {
  const userId = requireUserId();
  const stableKey = `${input.propertyId || 'property'}-${input.ownerName}-${input.propertyTitle}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
  const conversationRef = doc(conversationsCollection(userId), stableKey);

  await setDoc(conversationRef, {
    propertyId: input.propertyId || '',
    propertyTitle: input.propertyTitle,
    ownerName: input.ownerName,
    lastMessage: '',
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return conversationRef.id;
}

export async function sendMessage(input: {
  conversationId: string;
  text: string;
  propertyId?: string;
  propertyTitle: string;
  ownerName: string;
}): Promise<void> {
  const userId = requireUserId();
  const conversationRef = doc(conversationsCollection(userId), input.conversationId);
  const messagesRef = collection(conversationRef, 'messages');

  await addDoc(messagesRef, {
    text: input.text,
    senderId: userId,
    createdAt: serverTimestamp(),
  });

  await setDoc(conversationRef, {
    propertyId: input.propertyId || '',
    propertyTitle: input.propertyTitle,
    ownerName: input.ownerName,
    lastMessage: input.text,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
