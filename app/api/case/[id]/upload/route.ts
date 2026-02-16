import { NextResponse } from "next/server";
import { maxFileMb } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { cleanupExpiredUploads, saveUpload } from "@/lib/uploads";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const documents = await prisma.document.findMany({
    where: { caseId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, fileName: true, mimeType: true, size: true }
  });
  return NextResponse.json({ documents });
}

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  await cleanupExpiredUploads();
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > maxFileMb * 1024 * 1024) {
    return NextResponse.json({ error: `MAX_FILE_MB exceeded (${maxFileMb}MB)` }, { status: 400 });
  }

  const saved = await saveUpload(id, file);
  return NextResponse.json({ id: saved.id, fileName: saved.fileName });
}
