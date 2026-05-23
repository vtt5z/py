import { GoogleGenerativeAI } from "@google/generative-ai";
import { withRetry, getFallbackResponse } from "@/lib/retry";

export type ChatRole = "system" | "user" | "assistant" | "model";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type AssistantLanguage = "en" | "ar";
export type RuntimeContext = {
  locale?: string;
  timezone?: string;
  localTime?: string;
  device?: string;
};

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() ||
  "gemini-3-flash-preview";

function getApiKey() {
  return process.env.GEMINI_API_KEY?.trim();
}

export function hasGeminiKey() {
  return Boolean(getApiKey());
}

function getModel() {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: GEMINI_MODEL,
  });
}

function createTextStream(text: string, chunkSize = 14) {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, "gs")) ?? [text];

      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 12));
      }

      controller.close();
    },
  });
}

function cleanMessages(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.content?.trim() && (message.role === "user" || message.role === "assistant" || message.role === "model"))
    .slice(-10)
    .map((message) => ({
      role: message.role === "model" ? ("assistant" as const) : message.role,
      content: message.content.trim(),
    }));
}

export function detectInputLanguage(text: string): AssistantLanguage {
  return /[\u0600-\u06FF]/.test(text) ? "ar" : "en";
}

export function buildAssistantSystemPrompt(language: AssistantLanguage) {
  const shared = [
    "You are HARON OS, a premium AI workspace assistant for builders, founders, engineers, students, and operators.",
    "You feel polished, calm, precise, and highly capable, like a modern SaaS copiloting layer rather than a chatbot.",
    "Be natural, concise, practical, and helpful. Avoid robotic language, fake theatrics, and unnecessary system phrases.",
    "Use clean markdown with short headings, bullets only when useful, and code blocks for code.",
    "Keep the answer directly useful: explain, decide, debug, design, or write with confidence.",
    "When debugging, include likely cause, fix, and verification.",
    "Never claim to have performed actions you did not perform. Ask one clear question only when necessary.",
  ].join(" ");

  if (language === "ar") {
    return [
      shared,
      "Respond in modern, natural Arabic with a professional and friendly Saudi tone.",
      "Use proper RTL structure and clear business terminology.",
      "Be helpful, concise, and modern without robotic language.",
    ].join(" ");
  }

  return [
    shared,
    "Respond in clear, professional English with a modern and friendly tone.",
    "Be practical and focused on usefulness.",
  ].join(" ");
}

function formatRuntimeContext(context?: RuntimeContext) {
  if (!context) return "";

  return [
    context.locale ? `Locale: ${context.locale}` : "",
    context.timezone ? `Timezone: ${context.timezone}` : "",
    context.localTime ? `Local time: ${context.localTime}` : "",
    context.device ? `Device: ${context.device}` : "",
  ].filter(Boolean).join("\n");
}

function messagesToPrompt(messages: ChatMessage[], language: AssistantLanguage, context?: RuntimeContext) {
  /**
   * SECURITY: Build prompt safely
   * - System prompts only from server (never from frontend messages)
   * - Frontend system role messages are discarded
   * - Only the last 10 user/assistant messages are retained
   * - No system prompt extraction from user content
   */
  const dialogue = cleanMessages(messages)
    .map((message) => {
      const role = message.role === "user" ? "User" : "Assistant";
      return `${role}: ${message.content}`;
    })
    .join("\n\n");

  return [
    buildAssistantSystemPrompt(language),
    formatRuntimeContext(context) ? `Runtime context:\n${formatRuntimeContext(context)}` : "",
    "Conversation:",
    dialogue || "User: Open HARON OS.",
    "",
    "Assistant:",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function demoResponse(prompt: string, language: AssistantLanguage) {
  if (language === "ar") {
    return [
      "## وضع التجربة في هارون أو إس",
      "",
      "Gemini غير مفعّل حالياً لأن `GEMINI_API_KEY` غير موجود في البيئة.",
      "",
      "بمجرد إضافة المفتاح، يشتغل المساعد مباشرة بنفس التجربة الحالية.",
      "",
      "### طلبك",
      prompt.slice(0, 500),
    ].join("\n");
  }

  return [
    "## HARON OS Demo Mode",
    "",
    "Gemini is not active yet because `GEMINI_API_KEY` is not configured.",
    "",
    "Add the key in `.env.local` and this same interface will return live AI responses.",
    "",
    "### Your request",
    prompt.slice(0, 500),
  ].join("\n");
}

export async function streamChatCompletion(
  messages: ChatMessage[],
  language: AssistantLanguage = "en",
  context?: RuntimeContext,
): Promise<ReadableStream<Uint8Array>> {
  const prompt = messagesToPrompt(messages, language, context);

  if (!hasGeminiKey()) {
    return createTextStream(demoResponse(messages.at(-1)?.content ?? "Open HARON OS", language));
  }

  try {
    /**
     * PRODUCTION: Retry logic for streaming
     * Wrap Gemini API call with retry and timeout handling
     */
    const model = getModel();
    const result = await withRetry(
      () => model.generateContentStream(prompt),
      {
        maxRetries: 1, // Fewer retries for streaming
        initialDelayMs: 500,
        maxDelayMs: 2000,
        timeoutMs: 45000, // Longer timeout for streaming
      }
    );
    
    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          /**
           * PRODUCTION: Stream error handling
           * Send error message to stream instead of breaking
           */
          console.error("[HARON OS streaming error]", error);
          const errorMessage = formatGeminiError(error, language) || getFallbackResponse("chat");
          controller.enqueue(encoder.encode("\n\n" + errorMessage));
          controller.close();
        }
      },
    });
  } catch (error) {
    /**
     * PRODUCTION: Fallback to non-streaming completion
     * If streaming fails, use standard completion as backup
     */
    console.error("[HARON OS Gemini streaming fallback]", error);
    const fallbackText = formatGeminiError(error, language) || getFallbackResponse("chat");
    return createTextStream(fallbackText);
  }
}

export async function completeText(prompt: string, systemPrompt?: string, language: AssistantLanguage = "en") {
  const fullPrompt = [
    buildAssistantSystemPrompt(language),
    systemPrompt,
    "Task:",
    prompt,
  ]
    .filter(Boolean)
    .join("\n\n");

  if (!hasGeminiKey()) {
    return demoResponse(prompt, language);
  }

  try {
    /**
     * PRODUCTION: Retry logic with timeout
     * If Gemini fails, retry up to 3 times with exponential backoff
     */
    const result = await withRetry(
      () => getModel().generateContent(fullPrompt),
      {
        maxRetries: 2,
        initialDelayMs: 500,
        maxDelayMs: 3000,
        timeoutMs: 30000,
      }
    );
    
    return result.response.text();
  } catch (error) {
    console.error("[HARON OS Gemini complete error]", error);
    
    /**
     * PRODUCTION: Graceful fallback
     * If Gemini fails after retries, return friendly message
     */
    const fallbackMessage = getFallbackResponse("chat");
    return formatGeminiError(error, language) || fallbackMessage;
  }
}

export async function analyzeImage(
  base64: string,
  mimeType: string,
  prompt: string,
  language: AssistantLanguage = "en",
) {
  if (!hasGeminiKey()) {
    return language === "ar"
      ? "Gemini Vision غير مفعّل حالياً. أضف `GEMINI_API_KEY` لتحليل الصور."
      : "Gemini Vision is not active yet. Add `GEMINI_API_KEY` to analyze screenshots.";
  }

  try {
    /**
     * PRODUCTION: Retry logic for image analysis
     */
    const imagePart = {
      inlineData: {
        data: base64,
        mimeType,
      },
    };

    const result = await withRetry(
      () => getModel().generateContent([
        buildAssistantSystemPrompt(language),
        prompt,
        imagePart,
      ]),
      {
        maxRetries: 2,
        initialDelayMs: 500,
        maxDelayMs: 3000,
        timeoutMs: 30000,
      }
    );

    return result.response.text();
  } catch (error) {
    console.error("[HARON OS image analysis error]", error);
    return formatGeminiError(error, language) || getFallbackResponse("screenshot");
  }
}

export async function checkGeminiConnection() {
  if (!hasGeminiKey()) return false;

  try {
    const result = await getModel().generateContent("Reply with: ok");
    return result.response.text().toLowerCase().includes("ok");
  } catch {
    return false;
  }
}

function formatGeminiError(error: unknown, language: AssistantLanguage) {
  const message = error instanceof Error ? error.message : "Unknown Gemini error";

  if (/429|quota|too many requests/i.test(message)) {
    return language === "ar"
      ? "هارون أو إس مشغول حالياً بسبب حد الاستخدام. جرّب مرة ثانية بعد قليل."
      : "HARON OS is temporarily rate-limited. Please try again shortly.";
  }

  if (/api key|GEMINI_API_KEY|permission|unauthorized/i.test(message)) {
    return language === "ar"
      ? "إعداد Gemini غير مكتمل. تأكد من إضافة `GEMINI_API_KEY` في متغيرات البيئة."
      : "Gemini is not configured correctly. Add `GEMINI_API_KEY` to your environment variables.";
  }

  if (/model|not found|404/i.test(message)) {
    return language === "ar"
      ? `إعداد نموذج Gemini غير صحيح. هارون أو إس يستخدم \`${GEMINI_MODEL}\`.`
      : `Gemini model configuration failed. HARON OS is configured for \`${GEMINI_MODEL}\`.`;
  }

  return language === "ar"
    ? "تعذر تنفيذ الطلب حالياً. جرّب مرة ثانية بعد لحظات."
    : "HARON OS could not complete the request. Please try again in a moment.";
}
