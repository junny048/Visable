import os
from typing import Literal

from fastapi import FastAPI, HTTPException
from openai import OpenAI
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(default_factory=list)
    system_prompt: str | None = None
    temperature: float = 0.2
    model: str = "gpt-4o-mini"


class ChatResponse(BaseModel):
    message: str


app = FastAPI(title="VISABLE Python Chat API", version="0.1.0")


DEFAULT_SYSTEM_PROMPT = (
    "You are VISABLE assistant. Keep answers practical and concise. "
    "If a question is legal or immigration-sensitive, add a short caution that official guidance "
    "and licensed professionals should be used for final decisions. "
    "Reply in Korean unless the user asks for another language."
)


def get_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured")
    return OpenAI(api_key=api_key)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    cleaned_messages = [
        {"role": m.role, "content": m.content.strip()}
        for m in request.messages
        if m.content and m.content.strip()
    ][-12:]

    if not cleaned_messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    client = get_client()

    try:
        completion = client.chat.completions.create(
            model=request.model,
            temperature=request.temperature,
            messages=[
                {"role": "system", "content": request.system_prompt or DEFAULT_SYSTEM_PROMPT},
                *cleaned_messages,
            ],
        )
        text = (completion.choices[0].message.content or "").strip()
        if not text:
            raise HTTPException(status_code=502, detail="No response generated")
        return ChatResponse(message=text)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
