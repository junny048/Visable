import { CaseType, TimelineItem } from "@/lib/types";

const milestones: Record<CaseType, string[]> = {
  F1: ["문서 확보", "DS-160 작성", "수수료/인터뷰 예약", "인터뷰 준비", "출국"],
  B1B2: ["여행 목적 정리", "DS-160 작성", "수수료/예약", "인터뷰 준비", "출국"],
  J1: ["DS-2019 확보", "신청서 작성", "수수료/예약", "인터뷰 준비", "출국"],
  D2: ["입학허가 확보", "서류 준비", "비자 신청/발급", "입국", "외국인등록 체크"],
  C3: ["입국 준비", "일정/숙소/재정 점검", "입국", "체류 중 체크", "귀국/종료 정리"],
  E2: ["고용계약/서류", "범죄경력/학위 준비", "신청 준비", "입국", "입국 후 절차 체크"]
};

export function buildTimeline(caseType: CaseType, travelDate: string): TimelineItem[] {
  const base = new Date(travelDate || Date.now());
  const labels = milestones[caseType];
  const offsets = [-60, -45, -30, -14, 0];
  return labels.map((title, idx) => {
    const date = new Date(base);
    date.setDate(base.getDate() + offsets[idx]);
    return {
      id: `${caseType}-${idx}`,
      title,
      date: date.toISOString().slice(0, 10),
      note: "확인 필요 라벨: 케이스/기관별 공식 요건을 최신 기준으로 재확인하세요."
    };
  });
}
