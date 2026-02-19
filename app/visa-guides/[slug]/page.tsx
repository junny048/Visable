import Link from "next/link";
import { notFound } from "next/navigation";
import { Lang, visaGuideMap, visaGuides } from "@/lib/visa-guides";

type VisaGuideDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export function generateStaticParams() {
  return visaGuides.map((guide) => ({ slug: guide.slug }));
}

function resolveLang(lang?: string): Lang {
  return lang === "en" ? "en" : "ko";
}

export default async function VisaGuideDetailPage({ params, searchParams }: VisaGuideDetailPageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const currentLang = resolveLang(lang);
  const guide = visaGuideMap[slug];

  if (!guide) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/visa-guides?lang=${currentLang}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              {currentLang === "ko" ? "비자 목록으로" : "Back to Visa List"}
            </Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-700">{guide.visaCode}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{guide.title[currentLang]}</h1>
            <p className="mt-2 text-sm text-slate-600">{guide.overview[currentLang]}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/visa-guides/${guide.slug}?lang=ko`}
              className={currentLang === "ko" ? "btn" : "btn-secondary"}
            >
              KO
            </Link>
            <Link
              href={`/visa-guides/${guide.slug}?lang=en`}
              className={currentLang === "en" ? "btn" : "btn-secondary"}
            >
              EN
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="panel p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            {currentLang === "ko" ? "단계별 절차" : "Step-by-Step Process"}
          </h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-700">
            {guide.steps.map((step, index) => (
              <li key={step.en} className="rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-900">{index + 1}.</span> {step[currentLang]}
              </li>
            ))}
          </ol>
        </article>

        <article className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {currentLang === "ko" ? "필수 서류" : "Required Documents"}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {guide.requiredDocs.map((doc) => (
              <li key={doc.en} className="rounded-xl bg-slate-50 px-3 py-2">
                {doc[currentLang]}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {currentLang === "ko" ? "인터뷰/서류 준비 팁" : "Interview and Filing Tips"}
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
          {guide.tips.map((tip) => (
            <li key={tip.en} className="rounded-xl bg-slate-50 px-3 py-2">
              {tip[currentLang]}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
