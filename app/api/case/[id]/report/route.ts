import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const report = await prisma.report.findUnique({
    where: { caseId: id },
    select: {
      riskLevel: true,
      missingDocs: true,
      inconsistencies: true,
      actionItems: true,
      createdAt: true
    }
  });
  return NextResponse.json({ report });
}
