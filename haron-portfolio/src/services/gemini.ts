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
 * Get Gemini model instance
 */
const getModel = () => {
  const genAI = getGenAI();

  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
  });
};

/**
 * Convert chat messages to Gemini format
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
 * Create ReadableStream response
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
 * AI Chat Completion
 */
export async function streamChatCompletion(
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return createStreamResponse(
        "HARON OS is running in demo mode. Add GEMINI_API_KEY to enable AI.",
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
      "[HARON OS Gemini Error]",
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

    if (
      errorMessage.includes("404") ||
      errorMessage.includes("not found")
    ) {
      return createStreamResponse(
        "HARON OS AI model configuration error. Please verify Gemini API setup.",
      );
    }

    return createStreamResponse(
      `Error: Unable to process request - ${errorMessage}`,
    );
  }
}

/**
 * Complete text generation
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
        "Gemini API is not configured.",
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

    return result.response.text();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred";

    console.error(
      "[HARON OS Complete Error]",
      errorMessage,
    );

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("quota")
    ) {
      return "HARON OS AI is temporarily busy. Please try again shortly.";
    }

    return `Gemini Error: ${errorMessage}`;
  }
}

/**
 * Vision / Image Analysis
 */
export async function analyzeImage(
  base64: string,
  mimeType: string,
  prompt: string,
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "Gemini Vision is not configured.";
    }

    const model = getModel();

    const imageData = {
      inlineData: {
        data: base64,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([
      prompt,
      imageData,
    ] as any);

    return result.response.text();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred";

    console.error(
      "[HARON OS Vision Error]",
      errorMessage,
    );

    return `Vision Error: ${errorMessage}`;
  }
}

/**
 * Health Check
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