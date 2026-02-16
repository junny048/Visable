"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { caseCards, caseQuestions } from "@/lib/case-config";
import { CaseType, Direction } from "@/lib/types";

export default function NewCasePage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialDirection = (params.get("direction") as Direction) || "KR_TO_US";
  const initialCaseType = (params.get("caseType") as CaseType) || "F1";

  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [caseType, setCaseType] = useState<CaseType>(initialCaseType);
  const [travelDate, setTravelDate] = useState("");
  const [stayDuration, setStayDuration] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [occupation, setOccupation] = useState("");
  const [withFamily, setWithFamily] = useState<"YES" | "NO">("NO");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const filteredCases = useMemo(
    () => caseCards.filter((c) => c.direction === direction),
    [direction]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/case", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        direction,
        caseType,
        answers: { travelDate, stayDuration, passportExpiry, occupation, withFamily, extra }
      })
    });
    setLoading(false);
    if (!res.ok) {
      alert("케이스 생성에 실패했습니다.");
      return;
    }
    const data = (await res.json()) as { id: string };
    router.push(`/case/${data.id}/upload`);
  }

  return (
    <div className="panel p-6 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900">케이스 생성</h1>
      <p className="mt-1 text-sm text-slate-600">방향/케이스 타입과 기본 정보를 입력하세요.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Direction</span>
            <select
              className="input"
              value={direction}
              onChange={(e) => {
                const next = e.target.value as Direction;
                setDirection(next);
                const candidate = caseCards.find((c) => c.direction === next);
                if (candidate) setCaseType(candidate.caseType);
              }}
            >
              <option value="KR_TO_US">KR_TO_US</option>
              <option value="US_TO_KR">US_TO_KR</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Case Type</span>
            <select className="input" value={caseType} onChange={(e) => setCaseType(e.target.value as CaseType)}>
              {filteredCases.map((c) => (
                <option key={c.caseType} value={c.caseType}>
                  {c.caseType} ({c.subtitle})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">출국/입국 예정일</span>
            <input className="input" type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">체류 기간(예정)</span>
            <input className="input" value={stayDuration} onChange={(e) => setStayDuration(e.target.value)} placeholder="예: 6개월" required />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">여권 만료일</span>
            <input className="input" type="date" value={passportExpiry} onChange={(e) => setPassportExpiry(e.target.value)} required />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">직업</span>
            <input className="input" value={occupation} onChange={(e) => setOccupation(e.target.value)} required />
          </label>
        </div>

        <label className="space-y-1">
          <span className="text-sm font-medium">동반가족 유무</span>
          <select className="input" value={withFamily} onChange={(e) => setWithFamily(e.target.value as "YES" | "NO")}>
            <option value="NO">없음</option>
            <option value="YES">있음</option>
          </select>
        </label>

        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <p className="text-sm font-semibold text-blue-800">케이스별 추가 질문</p>
          <div className="mt-3 grid gap-3">
            {(caseQuestions[caseType] ?? []).map((q, i) => {
              const key = `q${i}`;
              return (
                <label key={key} className="space-y-1">
                  <span className="text-sm text-slate-700">{q}</span>
                  <input
                    className="input"
                    value={extra[key] ?? ""}
                    onChange={(e) => setExtra((prev) => ({ ...prev, [key]: e.target.value }))}
                    required
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "생성 중..." : "케이스 생성"}
          </button>
        </div>
      </form>
    </div>
  );
}
