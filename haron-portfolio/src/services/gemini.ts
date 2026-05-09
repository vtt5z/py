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

/**
 * Get Gemini 1.5 Flash model instance
 */
const getModel = () => {
  const genAI = getGenAI();

  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
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

      const role =
        msg.role === "assistant" || msg.role === "model"
          ? "Assistant"
          : "User";

      return `${role}: ${msg.content}`;
    })
    .join("\n\n");
}

/**
 * Create a streaming response compatible with ReadableStream
 */
function createStreamResponse(
  text: string,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

/**
 * Chat completion with streaming-like response
 */
export async function streamChatCompletion(
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return createStreamResponse(
        "HARON OS is in demo mode. Add GEMINI_API_KEY to enable AI responses.",
      );
    }

    const model = getModel();

    const prompt = formatMessagesAsPrompt(messages);

    const result = await model.generateContent(prompt);

    const responseText = result.response.text();

    return createStreamResponse(responseText);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred";

    console.error(
      "[Gemini 1.5 Chat Error]",
      errorMessage,
    );

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("Too Many Requests")
    ) {
      return createStreamResponse(
        "HARON OS AI is temporarily busy. Please wait a few seconds and try again.",
      );
    }

    return createStreamResponse(
      `Error: Unable to process request - ${errorMessage}`,
    );
  }
}

/**
 * Complete text generation (non-streaming)
 */
export async function completeText(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return [
        "## HARON OS Demo Mode",
        "",
        "Gemini API is not configured. Add `GEMINI_API_KEY` to activate this feature.",
        "",
        "### Your Request:",
        prompt,
      ].join("\n");
    }

    const model = getModel();

    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\nUser Request:\n${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);

    const responseText = result.response.text();

    return responseText;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred";

    console.error(
      "[Gemini 1.5 Complete Error]",
      errorMessage,
    );

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("Too Many Requests")
    ) {
      return "HARON OS AI is temporarily busy. Please try again shortly.";
    }

    throw new Error(
      `Gemini 1.5 API error: ${errorMessage}`,
    );
  }
}

/**
 * Analyze image using Gemini Vision
 */
export async function analyzeImage(
  base64: string,
  mimeType: string,
  prompt: string,
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return `## HARON OS Vision Demo

Gemini Vision is ready. Add \`GEMINI_API_KEY\` to analyze screenshots with AI.`;
    }

    const model = getModel();

    const imageData = {
      inlineData: {
        data: base64,
        mimeType: mimeType,
      },
    };

    const systemMessage = `
You are HARON OS vision analyst.

Analyze screenshots with practical engineering and UI debugging guidance.

Focus on:
- Visual errors
- UI problems
- Performance issues
- Accessibility concerns
- Practical solutions

Be concise and actionable.
`;

    const result = await model.generateContent([
      systemMessage,
      "\n\nAnalyze this screenshot:\n",
      prompt,
      imageData,
    ] as any);

    const responseText = result.response.text();

    return responseText;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred";

    console.error(
      "[Gemini 1.5 Vision Error]",
      errorMessage,
    );

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("Too Many Requests")
    ) {
      return "HARON OS Vision AI is temporarily busy. Please try again shortly.";
    }

    throw new Error(
      `Gemini Vision error: ${errorMessage}`,
    );
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