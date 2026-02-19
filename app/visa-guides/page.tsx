import Link from "next/link";
import { Lang, visaGuides } from "@/lib/visa-guides";

export const metadata = {
  title: "Visa Guides | VISABLE"
};

type VisaGuidesPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function resolveLang(lang?: string): Lang {
  return lang === "en" ? "en" : "ko";
}

export default async function VisaGuidesPage({ searchParams }: VisaGuidesPageProps) {
  const { lang } = await searchParams;
  const currentLang = resolveLang(lang);

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {currentLang === "ko" ? "비자 유형별 프로세스 가이드" : "Visa-by-Visa Process Guide"}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              {currentLang === "ko" ? "비자 유형 선택" : "Choose a Visa Type"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {currentLang === "ko"
                ? "비자 유형을 선택하면 실무형 체크리스트, 필요 서류, 인터뷰 준비 포인트를 확인할 수 있습니다."
                : "Select your visa type to see a practical checklist, required documents, and interview prep points."}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/visa-guides?lang=ko" className={currentLang === "ko" ? "btn" : "btn-secondary"}>
              KO
            </Link>
            <Link href="/visa-guides?lang=en" className={currentLang === "en" ? "btn" : "btn-secondary"}>
              EN
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {visaGuides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/visa-guides/${guide.slug}?lang=${currentLang}`}
            className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-semibold text-blue-700">{guide.visaCode}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{guide.title[currentLang]}</p>
            <p className="mt-2 text-sm text-slate-600">{guide.audience[currentLang]}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
