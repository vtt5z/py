/**
 * @deprecated This file is deprecated and no longer used.
 * The project has been migrated to use Google Gemini API.
 * Please use @/services/gemini instead.
 *
 * This file is kept for reference only.
 * See: https://github.com/google/generative-ai-js
 */

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export function hasOpenAIKey() {
  console.warn("[DEPRECATED] hasOpenAIKey() is deprecated. Use Gemini service instead.");
  return false;
}

export function createDemoStream(message: string) {
  console.warn("[DEPRECATED] createDemoStream() is deprecated. Use Gemini service instead.");
  const encoder = new TextEncoder();
  const demo = [
    "This OpenAI service is deprecated. HARON OS now uses Google Gemini API.\n\n",
    "Please configure GEMINI_API_KEY in .env.local to use the AI features.\n",
  ];

  return new ReadableStream({
    start(controller) {
      let index = 0;
      const push = () => {
        if (index >= demo.length) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(demo[index]));
        index += 1;
        setTimeout(push, 120);
      };
      push();
    },
  });
}

export async function streamChatCompletion(messages: ChatMessage[]) {
  console.warn("[DEPRECATED] streamChatCompletion() from openai.ts is deprecated. Use Gemini service instead.");
  throw new Error("OpenAI service is deprecated. Please migrate to Gemini service.");
}

export async function completeText(prompt: string, system: string) {
  console.warn("[DEPRECATED] completeText() from openai.ts is deprecated. Use Gemini service instead.");
  throw new Error("OpenAI service is deprecated. Please migrate to Gemini service.");
}

export async function analyzeImage(base64: string, mimeType: string, prompt: string) {
  console.warn("[DEPRECATED] analyzeImage() from openai.ts is deprecated. Use Gemini service instead.");
  throw new Error("OpenAI service is deprecated. Please migrate to Gemini service.");
}
