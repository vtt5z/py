export const translations = {
  en: {
    chat: {
      title: "Chats",
      new: "New chat",
      empty: "No chats yet",
      emptyDescription: "Start a new conversation and it will appear here.",
      pinned: "Pinned",
      recent: "Recent chats",
      search: "Search chats...",
      rename: "Rename",
      delete: "Delete",
      pin: "Pin",
      unpin: "Unpin",
      deleteConfirm: "Delete this chat permanently?",
      placeholder: "Ask HARON OS anything...",
      saved: "Chat saved",
      renamed: "Chat renamed",
      deleted: "Chat deleted",
      pinUpdated: "Pin updated",
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      goHome: "Go home",
      retry: "Retry",
    },
    empty: {
      chatsTitle: "No chats yet",
      chatsDescription: "Create your first conversation to start building memory.",
      secondaryHint: "Pinned chats stay at the top for quick access.",
    },
    notFound: {
      title: "Page not found",
      description: "The page you requested does not exist or may have moved.",
      suggestion: "Open assistant",
    },
  },
  ar: {
    chat: {
      title: "المحادثات",
      new: "محادثة جديدة",
      empty: "لا توجد محادثات بعد",
      emptyDescription: "ابدأ محادثة جديدة وستظهر هنا مباشرة.",
      pinned: "المثبتة",
      recent: "المحادثات الأخيرة",
      search: "ابحث في المحادثات...",
      rename: "إعادة التسمية",
      delete: "حذف",
      pin: "تثبيت",
      unpin: "إلغاء التثبيت",
      deleteConfirm: "هل تريد حذف هذه المحادثة نهائيًا؟",
      placeholder: "اسأل هارون أو إس أي شيء...",
      saved: "تم حفظ المحادثة",
      renamed: "تم تحديث الاسم",
      deleted: "تم حذف المحادثة",
      pinUpdated: "تم تحديث التثبيت",
    },
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      goHome: "العودة للرئيسية",
      retry: "إعادة المحاولة",
    },
    empty: {
      chatsTitle: "لا توجد محادثات بعد",
      chatsDescription: "أنشئ أول محادثة لتبدأ ذاكرة العمل.",
      secondaryHint: "المحادثات المثبتة تبقى في الأعلى للوصول السريع.",
    },
    notFound: {
      title: "الصفحة غير موجودة",
      description: "الصفحة المطلوبة غير موجودة أو تم نقلها.",
      suggestion: "افتح المساعد",
    },
  },
} as const;

export type TranslationKey =
  | "chat.title"
  | "chat.new"
  | "chat.empty"
  | "chat.emptyDescription"
  | "chat.pinned"
  | "chat.recent"
  | "chat.search"
  | "chat.rename"
  | "chat.delete"
  | "chat.pin"
  | "chat.unpin"
  | "chat.deleteConfirm"
  | "chat.placeholder"
  | "chat.saved"
  | "chat.renamed"
  | "chat.deleted"
  | "chat.pinUpdated"
  | "common.loading"
  | "common.error"
  | "common.goHome"
  | "common.retry"
  | "empty.chatsTitle"
  | "empty.chatsDescription"
  | "empty.secondaryHint"
  | "notFound.title"
  | "notFound.description"
  | "notFound.suggestion";

export function getTranslation(language: keyof typeof translations, key: TranslationKey) {
  return key.split(".").reduce<unknown>((value, segment) => {
    if (typeof value !== "object" || value === null) return undefined;
    return (value as Record<string, unknown>)[segment];
  }, translations[language]) as string | undefined;
}
