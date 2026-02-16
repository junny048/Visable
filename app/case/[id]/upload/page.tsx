"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CaseNav } from "@/components/case-nav";

type UploadedDoc = { id: string; fileName: string; mimeType: string; size: number };

export default function UploadPage() {
  const routeParams = useParams<{ id: string }>();
  const caseId = routeParams.id;
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!caseId) return;
    const res = await fetch(`/api/case/${caseId}/upload`);
    if (res.ok) {
      const data = (await res.json()) as { documents: UploadedDoc[] };
      setDocs(data.documents);
    }
  }

  useEffect(() => {
    void refresh();
  }, [caseId]);

  async function upload(fileList: FileList | null) {
    if (!fileList || !caseId) return;
    setBusy(true);
    for (const file of Array.from(fileList)) {
      const form = new FormData();
      form.append("file", file);
      await fetch(`/api/case/${caseId}/upload`, {
        method: "POST",
        body: form
      });
    }
    await refresh();
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      {caseId ? <CaseNav caseId={caseId} /> : null}
      <section className="panel p-6">
        <h1 className="text-xl font-bold">문서 업로드</h1>
        <p className="mt-1 text-sm text-slate-600">PDF/JPG/PNG 업로드. 파일은 TTL 정책에 따라 자동 삭제됩니다.</p>
        <label className="mt-4 block cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-8 text-center">
          <input
            className="hidden"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={(e) => void upload(e.target.files)}
          />
          <span className="text-sm font-medium text-blue-700">{busy ? "업로드 중..." : "파일 선택 또는 드래그 앤 드롭"}</span>
        </label>
      </section>

      <section className="panel p-6">
        <h2 className="text-lg font-semibold">업로드된 문서</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {docs.map((doc) => (
            <li key={doc.id} className="rounded-lg border border-slate-200 px-3 py-2">
              {doc.fileName} ({Math.ceil(doc.size / 1024)} KB)
            </li>
          ))}
          {docs.length === 0 ? <li className="text-slate-500">아직 업로드한 문서가 없습니다.</li> : null}
        </ul>
        <div className="mt-4">
          <Link href={`/case/${caseId}/analyze`} className="btn">
            분석 단계로 이동
          </Link>
        </div>
      </section>
    </div>
  );
}
