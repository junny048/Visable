import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-blue-100/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="VISABLE logo" width={44} height={44} />
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-700">VISABLE</p>
            <p className="text-xs text-slate-500">HanMi DocKit MVP</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <Link className="btn-secondary" href="/case/new">
            새 케이스
          </Link>
        </nav>
      </div>
    </header>
  );
}
