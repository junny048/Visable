export type Direction = "KR_TO_US" | "US_TO_KR";
export type CaseType = "F1" | "B1B2" | "J1" | "D2" | "C3" | "E2";

export type OnboardingAnswers = {
  travelDate: string;
  stayDuration: string;
  passportExpiry: string;
  occupation: string;
  withFamily: "YES" | "NO";
  extra: Record<string, string>;
};

export type MissingDoc = {
  name: string;
  requiredLevel: "required" | "recommended";
  reason: string;
};

export type Inconsistency = {
  field: string;
  values: string[];
  whyItMatters: string;
  fix: string;
};

export type ActionItem = {
  priority: 1 | 2 | 3 | 4 | 5;
  title: string;
  steps: string[];
};

export type QAReportShape = {
  riskLevel: "LOW" | "MED" | "HIGH";
  missingDocs: MissingDoc[];
  inconsistencies: Inconsistency[];
  actionItems: ActionItem[];
};

export type TimelineItem = {
  id: string;
  title: string;
  date: string;
  note: string;
};
