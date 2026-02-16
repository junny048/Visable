import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "VISABLE | HanMi DocKit",
  description: "한국-미국 이동자를 위한 문서 QA/타임라인/템플릿 패키지"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-slate-500">
          본 서비스는 정보 제공 및 서류 품질 점검용이며 법률 자문/대행 서비스가 아닙니다.
        </footer>
      </body>
    </html>
  );
}
