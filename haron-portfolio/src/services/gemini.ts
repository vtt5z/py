import { GoogleGenerativeAI } from "@google/generative-ai";

export type ChatRole = "system" | "user" | "assistant" | "model";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type AssistantLanguage = "en" | "ar";

const GEMINI_MODEL = "gemini-1.5-flash";

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
    .filter((message) => message.content?.trim())
    .slice(-16)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

export function detectInputLanguage(text: string): AssistantLanguage {
  return /[\u0600-\u06FF]/.test(text) ? "ar" : "en";
}

export function buildAssistantSystemPrompt(language: AssistantLanguage) {
  const shared = [
    "You are HARON OS, a premium AI operating system assistant for a software engineer and data analyst.",
    "Be concise, polished, natural, helpful, and technically sharp.",
    "Use clean markdown with short headings, bullets only when useful, and code blocks for code.",
    "Do not sound robotic. Avoid over-explaining. Prefer practical next steps.",
    "When debugging, include likely cause, fix, and verification.",
  ].join(" ");

  if (language === "ar") {
    return [
      shared,
      "Respond in modern Arabic with a natural Saudi-friendly tone.",
      "Use RTL-friendly structure, clear wording, and professional app terminology.",
      "Keep the tone premium, calm, and useful.",
    ].join(" ");
  }

  return [
    shared,
    "Respond in premium, professional English with a futuristic but grounded tone.",
  ].join(" ");
}

function messagesToPrompt(messages: ChatMessage[], language: AssistantLanguage) {
  const systemFromMessages = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");

  const dialogue = cleanMessages(messages)
    .filter((message) => message.role !== "system")
    .map((message) => {
      const role = message.role === "assistant" || message.role === "model" ? "Assistant" : "User";
      return `${role}: ${message.content}`;
    })
    .join("\n\n");

  return [
    buildAssistantSystemPrompt(language),
    systemFromMessages,
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
      "## وضع التجربة في HARON OS",
      "",
      "Gemini غير مفعّل حالياً لأن `GEMINI_API_KEY` غير موجود في البيئة.",
      "",
      "بمجرد إضافة المفتاح، سيعمل المساعد مباشرة بنفس الواجهة الحالية.",
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
): Promise<ReadableStream<Uint8Array>> {
  const prompt = messagesToPrompt(messages, language);

  if (!hasGeminiKey()) {
    return createTextStream(demoResponse(messages.at(-1)?.content ?? "Open HARON OS", language));
  }

  try {
    const model = getModel();
    const result = await model.generateContentStream(prompt);
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
          controller.enqueue(encoder.encode(formatGeminiError(error, language)));
          controller.close();
        }
      },
    });
  } catch (error) {
    return createTextStream(formatGeminiError(error, language));
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
    const result = await getModel().generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    return formatGeminiError(error, language);
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
    const imagePart = {
      inlineData: {
        data: base64,
        mimeType,
      },
    };

    const result = await getModel().generateContent([
      buildAssistantSystemPrompt(language),
      prompt,
      imagePart,
    ]);

    return result.response.text();
  } catch (error) {
    return formatGeminiError(error, language);
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
      ? "HARON OS مشغول حالياً بسبب حد الاستخدام. جرّب مرة ثانية بعد قليل."
      : "HARON OS is temporarily rate-limited. Please try again shortly.";
  }

  if (/api key|GEMINI_API_KEY|permission|unauthorized/i.test(message)) {
    return language === "ar"
      ? "إعداد Gemini غير مكتمل. تأكد من إضافة `GEMINI_API_KEY` في متغيرات البيئة."
      : "Gemini is not configured correctly. Add `GEMINI_API_KEY` to your environment variables.";
  }

  if (/model|not found|404/i.test(message)) {
    return language === "ar"
      ? "إعداد نموذج Gemini غير صحيح. HARON OS يستخدم `gemini-1.5-flash`."
      : "Gemini model configuration failed. HARON OS is configured for `gemini-1.5-flash`.";
  }

  return language === "ar"
    ? `تعذر تنفيذ الطلب حالياً: ${message}`
    : `HARON OS could not complete the request: ${message}`;
}
