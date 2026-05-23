"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import {
  appendUserChatMessage,
  createUserChat,
  deleteUserChat,
  renameUserChat,
  setUserChatPinned,
  subscribeUserChatMessages,
  subscribeUserChatThreads,
  type Chat,
} from "@/lib/chats";

export function useChats() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeMessages, setActiveMessages] = useState<Chat["messages"]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return undefined;
    if (!isAuthenticated || !user?.uid) {
      setChats([]);
      setActiveChatId(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    return subscribeUserChatThreads(
      user.uid,
      (nextChats) => {
        setChats(nextChats);
        setActiveChatId((current) => current && nextChats.some((chat) => chat.id === current) ? current : nextChats[0]?.id ?? null);
        setLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setLoading(false);
      },
    );
  }, [authLoading, isAuthenticated, user?.uid]);

  useEffect(() => {
    if (!user?.uid || !activeChatId) {
      setActiveMessages([]);
      return undefined;
    }

    return subscribeUserChatMessages(
      user.uid,
      activeChatId,
      setActiveMessages,
      (nextError) => setError(nextError.message),
    );
  }, [activeChatId, user?.uid]);

  const activeChat = useMemo(
    () => {
      const metadata = chats.find((chat) => chat.id === activeChatId);
      return metadata ? { ...metadata, messages: activeMessages } : null;
    },
    [activeChatId, activeMessages, chats],
  );

  const createChat = useCallback(async (title?: string) => {
    if (!user?.uid) throw new Error("User not authenticated");
    const id = await createUserChat(user.uid, title);
    setActiveChatId(id);
    return id;
  }, [user?.uid]);

  const sendMessage = useCallback(async (chatId: string, role: "user" | "assistant", content: string) => {
    if (!user?.uid) throw new Error("User not authenticated");
    await appendUserChatMessage(user.uid, chatId, { role, content });
  }, [user?.uid]);

  const renameChat = useCallback(async (chatId: string, title: string) => {
    if (!user?.uid) throw new Error("User not authenticated");
    await renameUserChat(user.uid, chatId, title);
  }, [user?.uid]);

  const togglePin = useCallback(async (chatId: string, pinned: boolean) => {
    if (!user?.uid) throw new Error("User not authenticated");
    await setUserChatPinned(user.uid, chatId, pinned);
  }, [user?.uid]);

  const removeChat = useCallback(async (chatId: string) => {
    if (!user?.uid) throw new Error("User not authenticated");
    await deleteUserChat(user.uid, chatId);
  }, [user?.uid]);

  return {
    chats,
    pinnedChats: chats.filter((chat) => chat.pinned),
    recentChats: chats.filter((chat) => !chat.pinned),
    activeChat,
    activeChatId,
    setActiveChatId,
    loading,
    error,
    createChat,
    sendMessage,
    renameChat,
    togglePin,
    removeChat,
  };
}
