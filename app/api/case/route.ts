import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createCaseSchema = z.object({
  direction: z.enum(["KR_TO_US", "US_TO_KR"]),
  caseType: z.enum(["F1", "B1B2", "J1", "D2", "C3", "E2"]),
  answers: z.object({
    travelDate: z.string(),
    stayDuration: z.string(),
    passportExpiry: z.string(),
    occupation: z.string(),
    withFamily: z.enum(["YES", "NO"]),
    extra: z.record(z.string(), z.string())
  })
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createCaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const row = await prisma.case.create({ data: parsed.data });
  return NextResponse.json({ id: row.id });
}
