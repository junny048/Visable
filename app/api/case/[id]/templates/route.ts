import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const templatePack = await prisma.templatePack.findUnique({
    where: { caseId: id },
    select: { templates: true, createdAt: true }
  });
  return NextResponse.json({ templatePack });
}
