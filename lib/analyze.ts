import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse";
import { z } from "zod";
import { documentChecklist } from "@/lib/case-config";
import { getOpenAIClient } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { CaseType, QAReportShape } from "@/lib/types";

const extractedSchema = z.object({
  documentType: z.string(),
  extractedFields: z.record(z.string(), z.string()),
  confidence: z.number().min(0).max(1),
  notes: z.array(z.string())
});

const qaSchema = z.object({
  riskLevel: z.enum(["LOW", "MED", "HIGH"]),
  missingDocs: z.array(
    z.object({
      name: z.string(),
      requiredLevel: z.enum(["required", "recommended"]),
      reason: z.string()
    })
  ),
  inconsistencies: z.array(
    z.object({
      field: z.string(),
      values: z.array(z.string()),
      whyItMatters: z.string(),
      fix: z.string()
    })
  ),
  actionItems: z.array(
    z.object({
      priority: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
      title: z.string(),
      steps: z.array(z.string())
    })
  )
});

function inferDocType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes("passport")) return "passport";
  if (lower.includes("i20")) return "i20";
  if (lower.includes("ds2019")) return "ds2019";
  if (lower.includes("admission")) return "admission";
  if (lower.includes("contract")) return "contract";
  if (lower.includes("degree")) return "degree";
  if (lower.includes("bank")) return "bank";
  if (lower.includes("invitation")) return "invitation";
  return "other";
}

async function parseDocumentText(storedPath: string, mimeType: string) {
  if (mimeType.includes("pdf")) {
    const fileBuffer = await fs.readFile(storedPath);
    const parsed = await pdf(fileBuffer);
    return parsed.text.slice(0, 8000);
  }
  return "";
}

async function extractFieldsWithModel(payload: {
  direction: string;
  caseType: string;
  userAnswers: unknown;
  fileName: string;
  mimeType: string;
  text: string;
}) {
  const client = getOpenAIClient();
  if (!client) {
    return {
      documentType: inferDocType(payload.fileName),
      extractedFields: {},
      confidence: 0.35,
      notes: ["OPENAI_API_KEY 미설정: 기본 분류만 수행", "확인 필요"]
    };
  }

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Return strict JSON only. Extract key document fields for immigration-prep QA. No markdown."
      },
      {
        role: "user",
        content: JSON.stringify(payload)
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "extract_fields",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["documentType", "extractedFields", "confidence", "notes"],
          properties: {
            documentType: { type: "string" },
            extractedFields: {
              type: "object",
              additionalProperties: { type: "string" }
            },
            confidence: { type: "number", minimum: 0, maximum: 1 },
            notes: { type: "array", items: { type: "string" } }
          }
        },
        strict: true
      }
    }
  });

  const raw = response.output_text;
  return extractedSchema.parse(JSON.parse(raw));
}

function buildFallbackQa(params: {
  caseType: CaseType;
  answers: Record<string, unknown>;
  docs: Array<{ fileName: string; mimeType: string }>;
}): QAReportShape {
  const checklist = documentChecklist[params.caseType];
  const uploadedNames = params.docs.map((d) => d.fileName.toLowerCase());
  const missingDocs = checklist
    .filter((doc) => !uploadedNames.some((name) => name.includes(doc.name.toLowerCase().split(" ")[0])))
    .map((doc) => ({
      name: doc.name,
      requiredLevel: doc.requiredLevel,
      reason: "해당 케이스에 권장/필수 문서로 정의됨"
    }));

  const inconsistencies: QAReportShape["inconsistencies"] = [];
  const actionItems: QAReportShape["actionItems"] = [
    {
      priority: 1,
      title: "모든 인적사항 교차검토",
      steps: [
        "여권 영문 이름/생년월일/여권번호를 기준 원본으로 고정",
        "다른 문서 표기와 오탈자 여부를 비교",
        "불일치가 있으면 재발급 또는 정정 요청"
      ]
    }
  ];

  const passportExpiry = String(params.answers.passportExpiry ?? "");
  let riskLevel: QAReportShape["riskLevel"] = "LOW";
  if (missingDocs.some((d) => d.requiredLevel === "required")) riskLevel = "HIGH";
  if (missingDocs.length > 0 && riskLevel !== "HIGH") riskLevel = "MED";
  if (passportExpiry) {
    const expiry = new Date(passportExpiry);
    if (!Number.isNaN(expiry.valueOf())) {
      const diffDays = Math.floor((expiry.valueOf() - Date.now()) / (24 * 60 * 60 * 1000));
      if (diffDays < 180) {
        riskLevel = riskLevel === "HIGH" ? "HIGH" : "MED";
        actionItems.unshift({
          priority: 1,
          title: "여권 만료일 임박 여부 확인",
          steps: ["여권 만료일이 6개월 미만이면 갱신 우선", "접수 전 유효기간 정책 재확인"]
        });
      }
    }
  }

  return { riskLevel, missingDocs, inconsistencies, actionItems };
}

async function createQaWithModel(payload: Record<string, unknown>): Promise<QAReportShape> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("OPENAI_DISABLED");
  }
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are a document QA engine. Return strict JSON only. No legal advice. Always include rationale and confirm-needed labels."
      },
      { role: "user", content: JSON.stringify(payload) }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "qa_report",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["riskLevel", "missingDocs", "inconsistencies", "actionItems"],
          properties: {
            riskLevel: { type: "string", enum: ["LOW", "MED", "HIGH"] },
            missingDocs: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["name", "requiredLevel", "reason"],
                properties: {
                  name: { type: "string" },
                  requiredLevel: { type: "string", enum: ["required", "recommended"] },
                  reason: { type: "string" }
                }
              }
            },
            inconsistencies: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["field", "values", "whyItMatters", "fix"],
                properties: {
                  field: { type: "string" },
                  values: { type: "array", items: { type: "string" } },
                  whyItMatters: { type: "string" },
                  fix: { type: "string" }
                }
              }
            },
            actionItems: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["priority", "title", "steps"],
                properties: {
                  priority: { type: "integer", minimum: 1, maximum: 5 },
                  title: { type: "string" },
                  steps: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    }
  });
  return qaSchema.parse(JSON.parse(response.output_text));
}

export async function runAnalysis(caseId: string) {
  const row = await prisma.case.findUnique({
    where: { id: caseId },
    include: { documents: true }
  });
  if (!row) throw new Error("CASE_NOT_FOUND");

  const extracted = await Promise.all(
    row.documents.map(async (doc) => {
      const text = await parseDocumentText(doc.storedPath, doc.mimeType);
      return extractFieldsWithModel({
        direction: row.direction,
        caseType: row.caseType,
        userAnswers: row.answers,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
        text
      });
    })
  );

  const aggregated = {
    documents: extracted,
    timestamp: new Date().toISOString()
  };

  await prisma.extractedData.upsert({
    where: { caseId },
    update: { aggregated },
    create: { caseId, aggregated }
  });

  let report: QAReportShape;
  try {
    report = await createQaWithModel({
      direction: row.direction,
      caseType: row.caseType,
      userAnswers: row.answers,
      aggregatedExtracted: aggregated,
      uploadedDocs: row.documents.map((d) => ({ fileName: d.fileName, mimeType: d.mimeType }))
    });
  } catch {
    report = buildFallbackQa({
      caseType: row.caseType as CaseType,
      answers: row.answers as Record<string, unknown>,
      docs: row.documents.map((d) => ({ fileName: d.fileName, mimeType: d.mimeType }))
    });
  }

  await prisma.report.upsert({
    where: { caseId },
    update: {
      riskLevel: report.riskLevel,
      missingDocs: report.missingDocs,
      inconsistencies: report.inconsistencies,
      actionItems: report.actionItems,
      rawModel: report
    },
    create: {
      caseId,
      riskLevel: report.riskLevel,
      missingDocs: report.missingDocs,
      inconsistencies: report.inconsistencies,
      actionItems: report.actionItems,
      rawModel: report
    }
  });

  return { aggregated, report };
}
