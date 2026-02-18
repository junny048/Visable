import argparse
import os

from openai import OpenAI


def main() -> None:
    parser = argparse.ArgumentParser(description="Simple OpenAI chat test")
    parser.add_argument("--message", default="연결 테스트 한 줄로 답해줘")
    parser.add_argument("--model", default="gpt-4o-mini")
    args = parser.parse_args()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")

    client = OpenAI(api_key=api_key)
    completion = client.chat.completions.create(
        model=args.model,
        temperature=0.2,
        messages=[
            {
                "role": "system",
                "content": "You are a concise assistant. Reply in Korean.",
            },
            {"role": "user", "content": args.message},
        ],
    )
    print((completion.choices[0].message.content or "").strip())


if __name__ == "__main__":
    main()
