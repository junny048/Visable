import fs from "fs/promises";
import path from "path";
import { fileTtlHours, resolvedUploadDir } from "./config";
import { prisma } from "./prisma";

export async function ensureUploadDir() {
  await fs.mkdir(resolvedUploadDir, { recursive: true });
}

export async function saveUpload(caseId: string, file: File) {
  await ensureUploadDir();
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storedFileName = `${Date.now()}_${safeName}`;
  const storedPath = path.join(resolvedUploadDir, storedFileName);
  await fs.writeFile(storedPath, bytes);

  const deleteAt = new Date(Date.now() + fileTtlHours * 60 * 60 * 1000);
  return prisma.document.create({
    data: {
      caseId,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: bytes.length,
      storedPath,
      deleteAt
    }
  });
}

export async function cleanupExpiredUploads() {
  const now = new Date();
  const expired = await prisma.document.findMany({
    where: { deleteAt: { lt: now } }
  });

  await Promise.all(
    expired.map(async (doc) => {
      try {
        await fs.unlink(doc.storedPath);
      } catch {
        // No-op: file can already be removed or inaccessible.
      }
      await prisma.document.delete({ where: { id: doc.id } });
    })
  );

  return expired.length;
}
