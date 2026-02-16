import { NextResponse } from "next/server";
import { generateIcs } from "@/lib/ics";
import { prisma } from "@/lib/prisma";
import { TimelineItem } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const timeline = await prisma.timeline.findUnique({
    where: { caseId: id },
    select: { items: true, createdAt: true }
  });

  const { searchParams } = new URL(req.url);
  if (searchParams.get("format") === "ics") {
    const items = ((timeline?.items as TimelineItem[]) ?? []).slice(0, 100);
    const ics = generateIcs(`Case ${id}`, items);
    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="timeline-${id}.ics"`
      }
    });
  }

  return NextResponse.json({ timeline });
}
