import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { getFirebaseFirestore } from "@/lib/firebase";

export type ChatMessage = {
  id?: string;
  chatId?: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

export type Chat = {
  id: string;
  title: string;
  pinned: boolean;
  folder: "study" | "coding" | "projects" | "general";
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
};

type FirestoreChatMessage = Omit<ChatMessage, "createdAt"> & { createdAt: Timestamp };

function assertUserId(userId: string) {
  if (!userId.trim()) throw new Error("Missing authenticated user id");
}

function userChatRoot(userId: string) {
  assertUserId(userId);
  return doc(getFirebaseFirestore(), "chats", userId);
}

function threadsCollection(userId: string) {
  assertUserId(userId);
  return collection(getFirebaseFirestore(), "chats", userId, "threads");
}

function messagesCollection(userId: string) {
  assertUserId(userId);
  return collection(getFirebaseFirestore(), "chats", userId, "messages");
}

function threadDocument(userId: string, chatId: string) {
  assertUserId(userId);
  if (!chatId.trim()) throw new Error("Missing chat id");
  return doc(getFirebaseFirestore(), "chats", userId, "threads", chatId);
}

export function subscribeUserChatThreads(
  userId: string,
  callback: (chats: Chat[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(threadsCollection(userId), orderBy("updatedAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const chats = snapshot.docs
        .map((chatDoc) => {
          const data = chatDoc.data();
          return {
            id: chatDoc.id,
            title: data.title || "New chat",
            pinned: Boolean(data.pinned),
            folder: data.folder || "general",
            lastMessage: data.lastMessage || "",
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
            messages: [],
          } satisfies Chat;
        })
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.getTime() - a.updatedAt.getTime());
      callback(chats);
    },
    (error) => onError(error),
  );
}

export function subscribeUserChatMessages(
  userId: string,
  chatId: string,
  callback: (messages: ChatMessage[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(messagesCollection(userId), where("chatId", "==", chatId));
  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs
        .map((messageDoc) => {
          const data = messageDoc.data() as FirestoreChatMessage;
          return {
            id: messageDoc.id,
            chatId: data.chatId,
            role: data.role,
            content: data.content,
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
          } satisfies ChatMessage;
        })
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      callback(messages);
    },
    (error) => onError(error),
  );
}

export async function createUserChat(userId: string, title = "New chat") {
  const now = Timestamp.now();
  const root = userChatRoot(userId);
  const ref = await addDoc(threadsCollection(userId), {
    userId: root.id,
    title: sanitizeTitle(title),
    pinned: false,
    folder: inferFolder(title),
    lastMessage: "",
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function appendUserChatMessage(
  userId: string,
  chatId: string,
  message: Omit<ChatMessage, "createdAt" | "id" | "chatId">,
) {
  const safeContent = sanitizeContent(message.content);
  if (!safeContent) throw new Error("Message cannot be empty");

  const now = Timestamp.now();
  await addDoc(messagesCollection(userId), {
    chatId,
    role: message.role,
    content: safeContent,
    createdAt: now,
  });
  await updateDoc(threadDocument(userId, chatId), {
    lastMessage: safeContent.slice(0, 180),
    updatedAt: now,
  });
}

export async function renameUserChat(userId: string, chatId: string, title: string) {
  await updateDoc(threadDocument(userId, chatId), {
    title: sanitizeTitle(title),
    updatedAt: Timestamp.now(),
  });
}

export async function setUserChatPinned(userId: string, chatId: string, pinned: boolean) {
  await updateDoc(threadDocument(userId, chatId), {
    pinned,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteUserChat(userId: string, chatId: string) {
  const batch = writeBatch(getFirebaseFirestore());
  const messages = await getDocs(query(messagesCollection(userId), where("chatId", "==", chatId)));
  messages.docs.forEach((messageDoc) => batch.delete(messageDoc.ref));
  batch.delete(threadDocument(userId, chatId));
  await batch.commit();
}

function sanitizeTitle(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 80) || "New chat";
}

function sanitizeContent(value: string) {
  return value.replace(/\u0000/g, "").trim().slice(0, 20000);
}

function inferFolder(value: string): Chat["folder"] {
  if (/study|quiz|notes|تعلم|دراسة|اختبار/i.test(value)) return "study";
  if (/code|bug|sql|api|firebase|كود|برمجة|خطأ/i.test(value)) return "coding";
  if (/project|launch|startup|مشروع|إطلاق/i.test(value)) return "projects";
  return "general";
}
