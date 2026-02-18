"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { caseCards, caseQuestions } from "@/lib/case-config";
import { CaseType, Direction } from "@/lib/types";

function NewCaseForm() {
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

  const filteredCases = useMemo(() => caseCards.filter((c) => c.direction === direction), [direction]);

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
      alert("Case creation failed.");
      return;
    }

    const data = (await res.json()) as { id: string };
    router.push(`/case/${data.id}/upload`);
  }

  return (
    <div className="panel p-6 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Create Case</h1>
      <p className="mt-1 text-sm text-slate-600">Select route/case type and enter basic information.</p>

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
            <span className="text-sm font-medium">Travel Date</span>
            <input className="input" type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Planned Stay Duration</span>
            <input className="input" value={stayDuration} onChange={(e) => setStayDuration(e.target.value)} placeholder="e.g. 6 months" required />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Passport Expiry Date</span>
            <input className="input" type="date" value={passportExpiry} onChange={(e) => setPassportExpiry(e.target.value)} required />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Occupation</span>
            <input className="input" value={occupation} onChange={(e) => setOccupation(e.target.value)} required />
          </label>
        </div>

        <label className="space-y-1">
          <span className="text-sm font-medium">With Family</span>
          <select className="input" value={withFamily} onChange={(e) => setWithFamily(e.target.value as "YES" | "NO") }>
            <option value="NO">No</option>
            <option value="YES">Yes</option>
          </select>
        </label>

        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <p className="text-sm font-semibold text-blue-800">Case-specific Questions</p>
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
            {loading ? "Creating..." : "Create Case"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewCasePage() {
  return (
    <Suspense fallback={<div className="panel p-6 text-sm text-slate-600">Loading form...</div>}>
      <NewCaseForm />
    </Suspense>
  );
}
