import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages?: ChatMessage[];
};

const SYSTEM_PROMPT = `
You are VISABLE assistant.
Keep answers practical and concise.
If a question is legal or immigration-sensitive, add a short caution that official guidance and licensed professionals should be used for final decisions.
Reply in Korean unless the user asks for another language.
`.trim();

function normalizeBaseUrl(input: string) {
  return input.endsWith("/") ? input.slice(0, -1) : input;
}

async function callPythonApi(messages: ChatMessage[]) {
  const baseUrl = process.env.PYTHON_API_URL;
  if (!baseUrl) return null;

  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      system_prompt: SYSTEM_PROMPT,
      temperature: 0.2
    })
  });

  const data = (await response.json()) as { message?: string; error?: string; detail?: string };
  if (!response.ok || !data.message) {
    const error = data.error ?? data.detail ?? "Python API call failed";
    throw new Error(error);
  }

  return data.message;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const messages = (body.messages ?? [])
      .filter((m) => m?.content?.trim())
      .slice(-12);

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const pythonMessage = await callPythonApi(messages);
    if (pythonMessage) {
      return NextResponse.json({ message: pythonMessage, provider: "python-api" });
    }

    const client = getOpenAIClient();
    if (!client) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is not configured"
        },
        { status: 500 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content }))
      ]
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json({ error: "No response generated" }, { status: 502 });
    }

    return NextResponse.json({ message: text, provider: "next-api" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
