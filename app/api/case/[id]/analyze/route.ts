import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/analyze";
import { prisma } from "@/lib/prisma";
import { generateTemplatePack } from "@/lib/templates";
import { buildTimeline } from "@/lib/timeline";
import { CaseType, OnboardingAnswers } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Params) {
  const { id } = await params;

  const caseRow = await prisma.case.findUnique({ where: { id } });
  if (!caseRow) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const result = await runAnalysis(id);
  const answers = caseRow.answers as unknown as OnboardingAnswers;
  const timelineItems = buildTimeline(caseRow.caseType as CaseType, answers.travelDate);

  await prisma.timeline.upsert({
    where: { caseId: id },
    update: { items: timelineItems },
    create: { caseId: id, items: timelineItems }
  });

  const templatePack = await generateTemplatePack({
    direction: caseRow.direction,
    caseType: caseRow.caseType as CaseType,
    userAnswers: caseRow.answers as Record<string, unknown>,
    aggregatedExtracted: result.aggregated
  });

  await prisma.templatePack.upsert({
    where: { caseId: id },
    update: { templates: templatePack.templates },
    create: { caseId: id, templates: templatePack.templates }
  });

  return NextResponse.json({ ok: true });
}
