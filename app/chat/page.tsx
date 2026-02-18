"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "안녕하세요. 비자/서류 관련 질문을 입력하면 바로 도와드릴게요."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = useMemo(() => loading || !input.trim(), [loading, input]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok || !data.message) {
        throw new Error(data.error ?? "요청 처리에 실패했습니다.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message as string }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">OpenAI Chat MVP</h1>
        <p className="text-sm text-slate-600">
          최소 기능 버전입니다. 질문, 답변, 에러 처리까지 포함되어 있습니다.
        </p>
      </div>

      <div className="h-[50vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
              message.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "bg-white text-slate-800 ring-1 ring-slate-200"
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading ? (
          <div className="max-w-[90%] rounded-xl bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200">
            답변 생성 중...
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요."
        />
        <button type="submit" className="btn min-w-24" disabled={disabled}>
          전송
        </button>
      </form>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
