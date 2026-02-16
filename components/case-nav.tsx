import Link from "next/link";

export function CaseNav({ caseId }: { caseId: string }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Link className="btn-secondary" href={`/case/${caseId}/upload`}>
        업로드
      </Link>
      <Link className="btn-secondary" href={`/case/${caseId}/analyze`}>
        분석
      </Link>
      <Link className="btn-secondary" href={`/case/${caseId}/report`}>
        리포트
      </Link>
      <Link className="btn-secondary" href={`/case/${caseId}/timeline`}>
        타임라인
      </Link>
      <Link className="btn-secondary" href={`/case/${caseId}/templates`}>
        템플릿
      </Link>
    </div>
  );
}
