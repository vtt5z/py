import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "",
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function completeText(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    return "Gemini API key is missing.";
  }

  const result = await model.generateContent(prompt);

  return result.response.text();
}

export async function streamChatCompletion(messages: any[]) {
  const prompt = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const text = await completeText(prompt);

  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}