"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CaseNav } from "@/components/case-nav";

type TimelineItem = { id: string; title: string; date: string; note: string };

export default function TimelinePage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [items, setItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    fetch(`/api/case/${caseId}/timeline`)
      .then((r) => r.json())
      .then((data) => setItems((data.timeline?.items as TimelineItem[]) ?? []))
      .catch(() => setItems([]));
  }, [caseId]);

  return (
    <div className="space-y-4">
      <CaseNav caseId={caseId} />
      <section className="panel p-6">
        <h1 className="text-xl font-bold">개인화 타임라인</h1>
        <p className="mt-1 text-sm text-slate-600">케이스 타입과 예정일 기준으로 계산된 마일스톤입니다.</p>
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold">
                {item.date} - {item.title}
              </p>
              <p className="text-xs text-slate-600">{item.note}</p>
            </li>
          ))}
          {items.length === 0 ? <li className="text-sm text-slate-500">아직 타임라인이 없습니다. 분석을 먼저 실행하세요.</li> : null}
        </ul>
        <a className="btn mt-4" href={`/api/case/${caseId}/timeline?format=ics`}>
          ICS 다운로드
        </a>
      </section>
    </div>
  );
}
