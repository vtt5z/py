/**
 * useConversations - Hook for managing Firestore-persisted conversations
 * 
 * Handles:
 * - Creating new conversations
 * - Loading conversation history
 * - Saving messages
 * - Switching between conversations
 * - Archiving conversations
 * - Guest mode (localStorage only)
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  createConversation,
  getUserConversations,
  addMessageToConversation,
  getConversationMessages,
  archiveConversation,
  type Conversation,
  type Message,
} from "@/lib/firestore";

export interface ConversationState {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface UseConversationsReturn {
  conversations: Conversation[];
  currentConversation: ConversationState | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadConversations: () => Promise<void>;
  startNewConversation: (firstMessage: string) => Promise<string>;
  switchConversation: (conversationId: string) => Promise<void>;
  addMessage: (role: "user" | "assistant", content: string, conversationId?: string) => Promise<void>;
  archiveCurrentConversation: () => Promise<void>;
  deleteCurrentConversation: () => Promise<void>;
}

const GUEST_STORAGE_KEY = "haron_guest_conversations";

export function useConversations(): UseConversationsReturn {
  const { user, isGuest, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversation history
  const loadConversations = useCallback(async () => {
    if (!isAuthenticated || !user?.uid) return;

    try {
      setLoading(true);
      const convs = await getUserConversations(user.uid);
      setConversations(convs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.uid]);

  // Load conversations on auth change
  useEffect(() => {
    if (isAuthenticated && !isGuest) {
      loadConversations();
    }
  }, [isAuthenticated, isGuest, loadConversations]);

  // Start new conversation
  const startNewConversation = useCallback(
    async (firstMessage: string): Promise<string> => {
      // Guest mode: use localStorage
      if (isGuest || !isAuthenticated) {
        const guestConvs: ConversationState[] = JSON.parse(
          localStorage.getItem(GUEST_STORAGE_KEY) || "[]"
        );

        const newConv: ConversationState = {
          id: `guest_${Date.now()}`,
          title: firstMessage.slice(0, 50),
          messages: [
            {
              id: `msg_${Date.now()}`,
              role: "user",
              content: firstMessage,
              createdAt: new Date(),
              language: "en",
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        guestConvs.push(newConv);
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestConvs));
        setCurrentConversation(newConv);
        return newConv.id;
      }

      // Authenticated mode: use Firestore
      if (!user?.uid) throw new Error("User not authenticated");

      try {
        const conv = await createConversation(user.uid, firstMessage);
        const messages = await getConversationMessages(conv.id);

        setCurrentConversation({
          id: conv.id,
          title: conv.title,
          messages,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
        });

        setConversations((prev) => [conv, ...prev]);
        return conv.id;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create conversation";
        setError(message);
        throw err;
      }
    },
    [isAuthenticated, isGuest, user?.uid]
  );

  // Switch conversation
  const switchConversation = useCallback(
    async (conversationId: string) => {
      // Guest mode
      if (isGuest || !isAuthenticated) {
        const guestConvs: ConversationState[] = JSON.parse(
          localStorage.getItem(GUEST_STORAGE_KEY) || "[]"
        );

        const conv = guestConvs.find((c) => c.id === conversationId);
        if (conv) {
          setCurrentConversation(conv);
        }
        return;
      }

      // Firestore mode
      try {
        setLoading(true);
        const messages = await getConversationMessages(conversationId);
        const conv = conversations.find((c) => c.id === conversationId);

        if (conv) {
          setCurrentConversation({
            id: conv.id,
            title: conv.title,
            messages,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load conversation");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, isGuest, conversations]
  );

  // Add message
  const addMessage = useCallback(
    async (role: "user" | "assistant", content: string, conversationId?: string) => {
      const activeConversationId = conversationId || currentConversation?.id;
      if (!activeConversationId) return;

      // Guest mode
      if (isGuest || !isAuthenticated) {
        const guestConvs: ConversationState[] = JSON.parse(
          localStorage.getItem(GUEST_STORAGE_KEY) || "[]"
        );

        const convIdx = guestConvs.findIndex((c) => c.id === activeConversationId);
        if (convIdx >= 0) {
          guestConvs[convIdx].messages.push({
            id: `msg_${Date.now()}`,
            role,
            content,
            createdAt: new Date(),
            language: "en",
          });

          guestConvs[convIdx].updatedAt = new Date();
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestConvs));

          setCurrentConversation({ ...guestConvs[convIdx] });
        }
        return;
      }

      // Firestore mode
      if (!user?.uid) return;

      try {
        const message = await addMessageToConversation(
          activeConversationId,
          role,
          content,
          "en"
        );

        setCurrentConversation((prev) => {
          if (!prev || prev.id !== activeConversationId) return prev;
          return {
            ...prev,
            messages: [...prev.messages, message],
            updatedAt: new Date(),
          };
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save message");
      }
    },
    [currentConversation, isAuthenticated, isGuest, user?.uid]
  );

  // Archive conversation
  const archiveCurrentConversation = useCallback(async () => {
    if (!currentConversation || !isAuthenticated || !user?.uid) return;

    try {
      await archiveConversation(currentConversation.id);
      setConversations((prev) => prev.filter((c) => c.id !== currentConversation.id));
      setCurrentConversation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive conversation");
    }
  }, [currentConversation, isAuthenticated, user?.uid]);

  // Delete conversation
  const deleteCurrentConversation = useCallback(async () => {
    if (!currentConversation) return;

    // Guest mode
    if (isGuest || !isAuthenticated) {
      const guestConvs: ConversationState[] = JSON.parse(
        localStorage.getItem(GUEST_STORAGE_KEY) || "[]"
      );

      const filtered = guestConvs.filter((c) => c.id !== currentConversation.id);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(filtered));
      setCurrentConversation(null);
      return;
    }

    // Firestore mode: for now, archive instead of delete
    await archiveCurrentConversation();
  }, [currentConversation, isAuthenticated, isGuest, archiveCurrentConversation]);

  return {
    conversations,
    currentConversation,
    loading,
    error,
    loadConversations,
    startNewConversation,
    switchConversation,
    addMessage,
    archiveCurrentConversation,
    deleteCurrentConversation,
  };
}
