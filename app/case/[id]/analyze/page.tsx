"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CaseNav } from "@/components/case-nav";

export default function AnalyzePage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/case/${caseId}/analyze`, { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      setError("분석 실패: 문서를 먼저 업로드했는지 확인하세요.");
      return;
    }
    router.push(`/case/${caseId}/report`);
  }

  return (
    <div className="space-y-4">
      <CaseNav caseId={caseId} />
      <section className="panel p-6">
        <h1 className="text-xl font-bold">분석 실행</h1>
        <p className="mt-1 text-sm text-slate-600">
          추출(extract) - QA(report) - timeline - templates 순서로 결과를 생성합니다.
        </p>
        <button className="btn mt-4" onClick={() => void run()} disabled={loading}>
          {loading ? "분석 중..." : "분석 시작"}
        </button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>
    </div>
  );
}
