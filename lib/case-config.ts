import { CaseType, Direction } from "@/lib/types";

export const caseCards: Array<{
  caseType: CaseType;
  direction: Direction;
  title: string;
  subtitle: string;
}> = [
  { caseType: "F1", direction: "KR_TO_US", title: "F-1", subtitle: "유학" },
  { caseType: "B1B2", direction: "KR_TO_US", title: "B1/B2", subtitle: "출장/관광" },
  { caseType: "J1", direction: "KR_TO_US", title: "J-1", subtitle: "교환/연수" },
  { caseType: "D2", direction: "US_TO_KR", title: "D-2", subtitle: "유학" },
  { caseType: "C3", direction: "US_TO_KR", title: "C-3", subtitle: "단기방문/비즈" },
  { caseType: "E2", direction: "US_TO_KR", title: "E-2", subtitle: "외국어강사" }
];

export const caseQuestions: Record<CaseType, string[]> = {
  F1: ["학교명", "I-20 보유 여부", "재정 증빙 형태(잔고/장학/후원)"],
  B1B2: ["방문 목적(출장/관광)", "초청장 유무", "회사/거래처 정보"],
  J1: ["DS-2019 보유 여부", "스폰서", "재정/후원 형태"],
  D2: ["학교/프로그램", "표준입학허가서/입학허가 보유", "재정 형태(잔고/장학)"],
  C3: ["방문 목적", "체류기간", "초청/숙소 정보"],
  E2: ["고용기관(학원/학교)", "학위/경력 요건 충족 여부", "범죄경력/건강검진 준비 여부"]
};

export const documentChecklist: Record<
  CaseType,
  Array<{ name: string; requiredLevel: "required" | "recommended" }>
> = {
  F1: [
    { name: "Passport", requiredLevel: "required" },
    { name: "I-20", requiredLevel: "recommended" },
    { name: "Bank Statement", requiredLevel: "recommended" }
  ],
  B1B2: [
    { name: "Passport", requiredLevel: "required" },
    { name: "Employment Proof", requiredLevel: "recommended" },
    { name: "Financial Proof", requiredLevel: "recommended" }
  ],
  J1: [
    { name: "Passport", requiredLevel: "required" },
    { name: "DS-2019", requiredLevel: "recommended" },
    { name: "Sponsor Letter", requiredLevel: "recommended" }
  ],
  D2: [
    { name: "Passport", requiredLevel: "required" },
    { name: "Admission Letter", requiredLevel: "recommended" },
    { name: "Financial Proof", requiredLevel: "recommended" }
  ],
  C3: [
    { name: "Passport", requiredLevel: "required" },
    { name: "Itinerary", requiredLevel: "recommended" },
    { name: "Accommodation/Invitation", requiredLevel: "recommended" }
  ],
  E2: [
    { name: "Passport", requiredLevel: "required" },
    { name: "Degree Certificate", requiredLevel: "recommended" },
    { name: "Employment Contract", requiredLevel: "recommended" },
    { name: "Criminal Background Check", requiredLevel: "recommended" }
  ]
};
