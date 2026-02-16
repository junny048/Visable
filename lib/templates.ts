import { getOpenAIClient } from "@/lib/openai";
import { CaseType } from "@/lib/types";

type TemplateBundle = {
  templates: Record<string, { en: string; ko: string }>;
};

function fallbackTemplates(caseType: CaseType, answers: Record<string, unknown>): TemplateBundle {
  const name = String((answers.extra as Record<string, string> | undefined)?.fullName ?? "Applicant");
  const date = String(answers.travelDate ?? "");

  return {
    templates: {
      cover_letter: {
        en: `Cover Letter\n\nI, ${name}, prepared this document package for ${caseType}. Planned travel date: ${date}.\n\nThis package is for information support only and is not legal advice.`,
        ko: `설명문\n\n본인 ${name}은(는) ${caseType} 관련 서류 패키지를 준비했습니다. 예정 이동일: ${date}.\n\n본 결과물은 정보 제공 목적이며 법률 자문이 아닙니다.`
      },
      personal_statement: {
        en: `Personal Statement\n\nPurpose, background, and supporting context for ${caseType}.\n\nFor information support only. Not legal advice.`,
        ko: `자기진술서\n\n${caseType} 목적, 배경, 보완 설명을 기재합니다.\n\n정보 제공 목적이며 법률 자문이 아닙니다.`
      }
    }
  };
}

export async function generateTemplatePack(payload: {
  direction: string;
  caseType: CaseType;
  userAnswers: Record<string, unknown>;
  aggregatedExtracted: unknown;
}): Promise<TemplateBundle> {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackTemplates(payload.caseType, payload.userAnswers);
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Generate immigration document templates in both English and Korean. Strict JSON only. Include disclaimer lines in both languages."
        },
        { role: "user", content: JSON.stringify(payload) }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "generate_templates",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["templates"],
            properties: {
              templates: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  additionalProperties: false,
                  required: ["en", "ko"],
                  properties: {
                    en: { type: "string" },
                    ko: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.output_text) as TemplateBundle;
  } catch {
    return fallbackTemplates(payload.caseType, payload.userAnswers);
  }
}
