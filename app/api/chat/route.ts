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

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const messages = (body.messages ?? [])
    .filter((m) => m?.content?.trim())
    .slice(-12);

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
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

  return NextResponse.json({ message: text });
}
