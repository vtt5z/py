export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function createDemoStream(message: string) {
  const encoder = new TextEncoder();
  const demo = [
    "HARON OS is running in local demo mode because OPENAI_API_KEY is not configured.\n\n",
    "Here is a production-shaped response for your request:\n\n",
    `> ${message}\n\n`,
    "- Connect an OpenAI key in `.env.local` to activate real streaming intelligence.\n",
    "- API routes, prompt architecture, and UI streaming are already wired.\n",
    "- Supabase hooks are ready for auth, storage, and future memory persistence.\n",
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
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return createDemoStream(messages.at(-1)?.content ?? "Open HARON OS");
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      stream: true,
      temperature: 0.65,
      messages,
    }),
  });

  if (!response.ok || !response.body) {
    const error = await response.text();
    throw new Error(error || "OpenAI request failed");
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return response.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const text = decoder.decode(chunk);
        const lines = text
          .split("\n")
          .filter((line) => line.startsWith("data: "))
          .map((line) => line.replace("data: ", "").trim());

        for (const line of lines) {
          if (line === "[DONE]") continue;
          try {
            const json = JSON.parse(line) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const content = json.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(encoder.encode(content));
          } catch {
            controller.enqueue(encoder.encode(""));
          }
        }
      },
    }),
  );
}

export async function completeText(prompt: string, system: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return [
      "## Local demo response",
      "",
      "OpenAI is not configured yet. Add `OPENAI_API_KEY` to `.env.local` to activate this tool.",
      "",
      "### Requested task",
      prompt,
    ].join("\n");
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.55,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? "";
}

export async function analyzeImage(base64: string, mimeType: string, prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return "## Screenshot Analysis Demo\n\nOpenAI vision is ready. Add `OPENAI_API_KEY` to inspect UI issues, code errors, layout problems, and debugging suggestions from uploaded screenshots.";
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are HARON OS vision analyst. Diagnose screenshots with practical engineering, UI, and debugging guidance.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? "";
}
