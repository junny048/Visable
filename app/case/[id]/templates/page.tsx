"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CaseNav } from "@/components/case-nav";

type TemplateMap = Record<string, { en: string; ko: string }>;

export default function TemplatesPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [lang, setLang] = useState<"en" | "ko">("ko");
  const [templates, setTemplates] = useState<TemplateMap>({});

  useEffect(() => {
    fetch(`/api/case/${caseId}/templates`)
      .then((r) => r.json())
      .then((data) => setTemplates((data.templatePack?.templates as TemplateMap) ?? {}))
      .catch(() => setTemplates({}));
  }, [caseId]);

  const entries = Object.entries(templates);

  return (
    <div className="space-y-4">
      <CaseNav caseId={caseId} />
      <section className="panel p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">템플릿 패키지 (EN/KO)</h1>
          <div className="flex gap-2">
            <button className={lang === "ko" ? "btn" : "btn-secondary"} onClick={() => setLang("ko")}>
              KO
            </button>
            <button className={lang === "en" ? "btn" : "btn-secondary"} onClick={() => setLang("en")}>
              EN
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-600">자동 채움 결과를 검토 후 실제 정보로 수정해서 사용하세요.</p>

        <div className="mt-4 space-y-4">
          {entries.map(([key, val]) => (
            <article key={key} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-blue-800">{key}</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{lang === "ko" ? val.ko : val.en}</pre>
            </article>
          ))}
          {entries.length === 0 ? (
            <p className="text-sm text-slate-500">아직 템플릿이 없습니다. 분석 단계를 먼저 실행하세요.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
