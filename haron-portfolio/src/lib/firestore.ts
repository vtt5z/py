/**
 * Firestore Collections Schema
 * 
 * COLLECTIONS:
 * 
 * 1. users/ - User profiles
 *    - id: string (auth UID)
 *    - email: string
 *    - displayName: string | null
 *    - photoURL: string | null
 *    - role: "owner" | "user" (server-determined)
 *    - emailVerified: boolean
 *    - language: "en" | "ar"
 *    - createdAt: timestamp
 *    - updatedAt: timestamp
 * 
 * 2. conversations/ - Chat conversations
 *    - id: string (auto)
 *    - userId: string (reference to users doc)
 *    - title: string (auto-generated from first message)
 *    - messages: number (count of messages)
 *    - firstMessage: string (preview of first message)
 *    - createdAt: timestamp
 *    - updatedAt: timestamp
 *    - isArchived: boolean
 * 
 * 3. conversations/{conversationId}/messages/ - Messages in a conversation
 *    - id: string (auto)
 *    - role: "user" | "assistant"
 *    - content: string
 *    - createdAt: timestamp
 *    - language: "en" | "ar"
 * 
 * 4. uploads/ - Uploaded files
 *    - id: string (auto)
 *    - userId: string (reference to users doc)
 *    - fileName: string
 *    - size: number
 *    - mimeType: string
 *    - storageRef: string (Firebase Storage path)
 *    - uploadedAt: timestamp
 *    - isPublic: boolean
 * 
 * 5. preferences/ - User preferences
 *    - id: string (auth UID, same as user)
 *    - theme: "light" | "dark"
 *    - language: "en" | "ar"
 *    - emailNotifications: boolean
 *    - updatedAt: timestamp
 */

import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  increment,
  writeBatch,
  orderBy,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: number;
  firstMessage: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  language: "en" | "ar";
}

export interface Upload {
  id: string;
  userId: string;
  fileName: string;
  size: number;
  mimeType: string;
  storageRef: string;
  uploadedAt: Date;
  isPublic: boolean;
}

/**
 * Create a new conversation
 */
export async function createConversation(
  userId: string,
  firstMessage: string
): Promise<Conversation> {
  const db = getFirebaseFirestore();
  const convsRef = collection(db, "conversations");

  // Generate title from first message (first 50 chars)
  const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");

  const docRef = await addDoc(convsRef, {
    userId,
    title,
    messages: 1,
    firstMessage,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isArchived: false,
  });

  await addDoc(collection(db, "conversations", docRef.id, "messages"), {
    role: "user",
    content: firstMessage,
    language: /[\u0600-\u06FF]/.test(firstMessage) ? "ar" : "en",
    createdAt: Timestamp.now(),
  });

  return {
    id: docRef.id,
    userId,
    title,
    messages: 1,
    firstMessage,
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
  };
}

/**
 * Get user's conversations
 */
export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const db = getFirebaseFirestore();
  const convsRef = collection(db, "conversations");
  const q = query(
    convsRef,
    where("userId", "==", userId),
    where("isArchived", "==", false)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      messages: data.messages,
      firstMessage: data.firstMessage,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      isArchived: data.isArchived,
    };
  });
}

/**
 * Add message to conversation
 */
export async function addMessageToConversation(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  language: "en" | "ar"
): Promise<Message> {
  const db = getFirebaseFirestore();
  const messagesRef = collection(db, "conversations", conversationId, "messages");

  const docRef = await addDoc(messagesRef, {
    role,
    content,
    language,
    createdAt: Timestamp.now(),
  });

  // Update conversation updatedAt and message count
  const convRef = doc(db, "conversations", conversationId);
  await updateDoc(convRef, {
    updatedAt: Timestamp.now(),
    messages: increment(1),
  });

  return {
    id: docRef.id,
    role,
    content,
    createdAt: new Date(),
    language,
  };
}

/**
 * Get messages from a conversation
 */
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const db = getFirebaseFirestore();
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  const snapshot = await getDocs(query(messagesRef, orderBy("createdAt", "asc")));

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      role: data.role,
      content: data.content,
      createdAt: data.createdAt?.toDate() || new Date(),
      language: data.language,
    };
  });
}

/**
 * Archive conversation
 */
export async function archiveConversation(conversationId: string): Promise<void> {
  const db = getFirebaseFirestore();
  const convRef = doc(db, "conversations", conversationId);
  await updateDoc(convRef, {
    isArchived: true,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Delete conversation and all its messages
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  const db = getFirebaseFirestore();
  const batch = writeBatch(db);

  // Delete all messages
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  const messagesSnapshot = await getDocs(messagesRef);
  messagesSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Delete conversation
  const convRef = doc(db, "conversations", conversationId);
  batch.delete(convRef);

  await batch.commit();
}

/**
 * Record file upload
 */
export async function recordFileUpload(
  userId: string,
  fileName: string,
  size: number,
  mimeType: string,
  storageRef: string
): Promise<Upload> {
  const db = getFirebaseFirestore();
  const uploadsRef = collection(db, "uploads");

  const docRef = await addDoc(uploadsRef, {
    userId,
    fileName,
    size,
    mimeType,
    storageRef,
    uploadedAt: Timestamp.now(),
    isPublic: false,
  });

  return {
    id: docRef.id,
    userId,
    fileName,
    size,
    mimeType,
    storageRef,
    uploadedAt: new Date(),
    isPublic: false,
  };
}

/**
 * Get user's uploads
 */
export async function getUserUploads(userId: string): Promise<Upload[]> {
  const db = getFirebaseFirestore();
  const uploadsRef = collection(db, "uploads");
  const q = query(uploadsRef, where("userId", "==", userId));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      fileName: data.fileName,
      size: data.size,
      mimeType: data.mimeType,
      storageRef: data.storageRef,
      uploadedAt: data.uploadedAt?.toDate() || new Date(),
      isPublic: data.isPublic,
    };
  });
}
