import { GoogleGenerativeAI } from "@google/generative-ai";

export type ChatMessage = {
  role: "system" | "user" | "model" | "assistant";
  content: string;
};

// Initialize Gemini API
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(apiKey);
};

const getModel = () => {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

/**
 * Convert chat messages to Gemini format and combine into a prompt
 */
function formatMessagesAsPrompt(messages: ChatMessage[]): string {
  return messages
    .map((msg) => {
      if (msg.role === "system") {
        return msg.content;
      }
      const role = msg.role === "assistant" || msg.role === "model" ? "Assistant" : "User";
      return `${role}: ${msg.content}`;
    })
    .join("\n\n");
}

/**
 * Create a streaming response compatible with ReadableStream
 */
function createStreamResponse(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    start(controller) {
      // Send the entire response as one chunk for compatibility
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

/**
 * Chat completion with streaming-like response
 * Gemini 1.5 Flash API is fast enough to feel real-time
 */
export async function streamChatCompletion(
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return createStreamResponse(
        "HARON OS is in demo mode. Add GEMINI_API_KEY to .env.local to enable AI responses."
      );
    }

    const model = getModel();
    const prompt = formatMessagesAsPrompt(messages);

    // Use generateContent for non-streaming (Gemini doesn't support true SSE streaming in Node.js the same way)
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return createStreamResponse(responseText);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Gemini Chat Error]", errorMessage);
    return createStreamResponse(
      `Error: Unable to process request - ${errorMessage}`
    );
  }
}

/**
 * Complete text generation (non-streaming)
 */
export async function completeText(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return [
        "## HARON OS Demo Mode",
        "",
        "Gemini API is not configured. Add `GEMINI_API_KEY` to `.env.local` to activate this feature.",
        "",
        "### Your Request:",
        prompt,
      ].join("\n");
    }

    const model = getModel();

    // Format prompt with system instruction if provided
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\nUser Request:\n${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    return responseText;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Gemini Complete Error]", errorMessage);
    throw new Error(`Gemini API error: ${errorMessage}`);
  }
}

/**
 * Analyze image using Gemini Vision
 */
export async function analyzeImage(
  base64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return `## HARON OS Vision Demo\n\nGemini Vision is ready. Add \`GEMINI_API_KEY\` to analyze and debug screenshots with AI.`;
    }

    const model = getModel();

    // Prepare image data
    const imageData = {
      inlineData: {
        data: base64,
        mimeType: mimeType,
      },
    };

    // Create system message for vision analysis
    const systemMessage = `You are HARON OS vision analyst. Analyze screenshots with practical engineering, UI, and debugging guidance. 
Focus on:
- Visual errors and UI problems
- Code/configuration issues if visible
- Performance bottlenecks
- Accessibility concerns
- Practical solutions
Be concise and actionable.`;

    const result = await model.generateContent([
      systemMessage,
      "\n\nAnalyze this screenshot:\n",
      prompt,
      imageData,
    ] as any);

    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Gemini Vision Error]", errorMessage);
    throw new Error(`Gemini Vision error: ${errorMessage}`);
  }
}

/**
 * Health check for Gemini API
 */
export async function checkGeminiConnection(): Promise<boolean> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return false;
    }

    const model = getModel();
    const result = await model.generateContent("test");
    return !!result.response.text();
  } catch {
    return false;
  }
}