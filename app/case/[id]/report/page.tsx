"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CaseNav } from "@/components/case-nav";

type ReportShape = {
  riskLevel: "LOW" | "MED" | "HIGH";
  missingDocs: Array<{ name: string; requiredLevel: string; reason: string }>;
  inconsistencies: Array<{ field: string; values: string[]; whyItMatters: string; fix: string }>;
  actionItems: Array<{ priority: number; title: string; steps: string[] }>;
};

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [report, setReport] = useState<ReportShape | null>(null);

  useEffect(() => {
    fetch(`/api/case/${caseId}/report`)
      .then((r) => r.json())
      .then((data) => setReport(data.report as ReportShape))
      .catch(() => setReport(null));
  }, [caseId]);

  return (
    <div className="space-y-4">
      <CaseNav caseId={caseId} />
      <section className="panel p-6">
        <h1 className="text-xl font-bold">서류 QA 리포트</h1>
        <p className="mt-1 text-sm text-slate-600">법률 자문/승인 예측이 아닌, 근거 기반 점검 리포트입니다.</p>
        {!report ? <p className="mt-4 text-sm text-slate-500">아직 분석 결과가 없습니다.</p> : null}
        {report ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm">
              <p>
                Risk Level: <strong>{report.riskLevel}</strong>
              </p>
              <p className="mt-1 text-xs text-slate-600">확인 필요 라벨: 최종 요구사항은 공식 안내를 재확인하세요.</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold">누락 문서</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {report.missingDocs.map((d, i) => (
                  <li key={`${d.name}-${i}`} className="rounded-lg border border-slate-200 p-3">
                    {d.name} ({d.requiredLevel}) - {d.reason}
                  </li>
                ))}
                {report.missingDocs.length === 0 ? <li className="text-slate-500">누락 없음</li> : null}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold">불일치</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {report.inconsistencies.map((d, i) => (
                  <li key={`${d.field}-${i}`} className="rounded-lg border border-slate-200 p-3">
                    <p>
                      {d.field}: {d.values.join(" vs ")}
                    </p>
                    <p className="text-slate-600">{d.whyItMatters}</p>
                    <p className="text-slate-600">Fix: {d.fix}</p>
                  </li>
                ))}
                {report.inconsistencies.length === 0 ? <li className="text-slate-500">불일치 없음</li> : null}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold">Action Items</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {report.actionItems.map((item, i) => (
                  <li key={`${item.title}-${i}`} className="rounded-lg border border-slate-200 p-3">
                    <p>
                      P{item.priority}. {item.title}
                    </p>
                    <p className="text-slate-600">{item.steps.join(" / ")}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
