import Image from "next/image";
import Link from "next/link";
import { caseCards } from "@/lib/case-config";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-4">
            <p className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              KR_TO_US / US_TO_KR 지원
            </p>
            <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              HanMi DocKit MVP
            </h1>
            <p className="text-slate-600">
              문서 정리, QA 리포트, 개인화 타임라인, EN/KO 템플릿 패키지를 한 번에 생성합니다.
            </p>
            <Link href="/case/new" className="btn">
              새 케이스 시작
            </Link>
          </div>
          <div className="mx-auto rounded-3xl border border-blue-200 bg-gradient-to-br from-sky-50 to-blue-100 p-6">
            <Image src="/logo.png" alt="VISABLE" width={180} height={180} className="mx-auto" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">지원 플로우 (MVP 6개)</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {caseCards.map((item) => (
            <Link
              key={`${item.direction}-${item.caseType}`}
              href={`/case/new?direction=${item.direction}&caseType=${item.caseType}`}
              className="panel p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-semibold text-blue-700">{item.direction}</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-600">{item.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
