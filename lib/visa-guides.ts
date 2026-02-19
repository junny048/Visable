export type Lang = "ko" | "en";

type LocalizedText = {
  ko: string;
  en: string;
};

export type VisaGuide = {
  slug: string;
  visaCode: string;
  title: LocalizedText;
  audience: LocalizedText;
  overview: LocalizedText;
  steps: LocalizedText[];
  requiredDocs: LocalizedText[];
  tips: LocalizedText[];
};

export const visaGuides: VisaGuide[] = [
  {
    slug: "f-1",
    visaCode: "F-1",
    title: {
      ko: "유학생 비자 가이드",
      en: "Student Visa Guide"
    },
    audience: {
      ko: "미국 인가 학교에 정규 등록하는 학생 대상",
      en: "For full-time students attending approved US schools"
    },
    overview: {
      ko: "미국 학위/어학 등 학업 과정을 위해 입국하며 학교에서 I-20를 발급받는 경우에 해당합니다.",
      en: "Use this track when you are entering the US for an academic program and your school issues Form I-20."
    },
    steps: [
      {
        ko: "SEVP 인증 학교에서 입학 허가를 받고 I-20를 발급받습니다.",
        en: "Receive admission from an SEVP-certified school and get Form I-20."
      },
      {
        ko: "I-901 SEVIS 비용을 납부하고 영수증을 보관합니다.",
        en: "Pay the I-901 SEVIS fee and keep the payment receipt."
      },
      {
        ko: "DS-160을 작성하고 사진 업로드 후 제출합니다.",
        en: "Complete DS-160, upload a photo, and submit the form."
      },
      {
        ko: "비자 신청 수수료를 납부하고 인터뷰 일정을 예약합니다.",
        en: "Pay the visa application fee and schedule your embassy interview."
      },
      {
        ko: "서류를 준비해 인터뷰에 참석합니다.",
        en: "Prepare documents and attend the interview."
      },
      {
        ko: "비자 발급 후 프로그램 시작일 기준 30일 이전부터 입국 가능합니다.",
        en: "After issuance, enter the US no earlier than 30 days before program start."
      }
    ],
    requiredDocs: [
      {
        ko: "체류 예정 기간 이후 최소 6개월 이상 유효한 여권",
        en: "Passport valid for at least 6 months beyond intended stay"
      },
      {
        ko: "학교/학생 서명이 포함된 I-20 원본",
        en: "Form I-20 signed by student and school official"
      },
      {
        ko: "DS-160 확인 페이지",
        en: "DS-160 confirmation page"
      },
      {
        ko: "인터뷰 예약 확인서",
        en: "Interview appointment confirmation"
      },
      {
        ko: "SEVIS 납부 영수증(I-901)",
        en: "SEVIS fee payment receipt (I-901)"
      },
      {
        ko: "학업 성적 자료 및 재정 증빙",
        en: "Academic records and financial proof"
      }
    ],
    tips: [
      {
        ko: "I-20, DS-160, 인터뷰 예약의 날짜/정보를 일치시켜 두세요.",
        en: "Keep dates aligned across I-20, DS-160, and interview booking."
      },
      {
        ko: "학비와 생활비를 설명할 수 있는 자금 증빙을 명확히 준비하세요.",
        en: "Prepare clear funding evidence for tuition and living expenses."
      },
      {
        ko: "학업 목적과 귀국 계획을 일관되게 설명하세요.",
        en: "Explain study intent and return plan consistently."
      }
    ]
  },
  {
    slug: "j-1",
    visaCode: "J-1",
    title: {
      ko: "교환방문 비자 가이드",
      en: "Exchange Visitor Visa Guide"
    },
    audience: {
      ko: "인턴, 트레이니, 연구 등 교환 프로그램 참가자 대상",
      en: "For exchange programs such as intern, trainee, and research"
    },
    overview: {
      ko: "지정 스폰서 프로그램을 통해 DS-2019를 발급받아 입국하는 경우에 해당합니다.",
      en: "Use this track when you are sponsored by a designated exchange visitor program and receive Form DS-2019."
    },
    steps: [
      {
        ko: "지정 스폰서 프로그램에 합격하고 DS-2019를 발급받습니다.",
        en: "Get accepted by a designated sponsor program and receive DS-2019."
      },
      {
        ko: "해당 카테고리에 따라 I-901 SEVIS 비용을 납부합니다.",
        en: "Pay the I-901 SEVIS fee if your category requires it."
      },
      {
        ko: "DS-160 작성 후 비자 신청 수수료를 납부합니다.",
        en: "Complete DS-160 and pay the visa application fee."
      },
      {
        ko: "인터뷰를 예약하고 스폰서 관련 서류를 준비합니다.",
        en: "Book interview and prepare sponsor-related documents."
      },
      {
        ko: "인터뷰에서 프로그램 목적과 기간을 명확히 설명합니다.",
        en: "Attend interview and explain program purpose and timeline."
      }
    ],
    requiredDocs: [
      {
        ko: "여권",
        en: "Passport"
      },
      {
        ko: "DS-2019 원본",
        en: "Form DS-2019"
      },
      {
        ko: "DS-160 확인 페이지",
        en: "DS-160 confirmation"
      },
      {
        ko: "SEVIS 납부 영수증(해당 시)",
        en: "SEVIS fee receipt (if applicable)"
      },
      {
        ko: "스폰서 레터 및 프로그램 세부자료",
        en: "Sponsor letter and program details"
      },
      {
        ko: "재정 또는 지원금 증빙",
        en: "Financial or funding support documents"
      }
    ],
    tips: [
      {
        ko: "2년 본국 거주 의무(212(e)) 적용 여부를 확인하세요.",
        en: "Check whether the 2-year home residency rule may apply."
      },
      {
        ko: "모든 서류의 스폰서 연락처/정보를 일치시켜 두세요.",
        en: "Confirm sponsor contact details in all documents."
      },
      {
        ko: "DS-2019 업데이트 이력을 모두 보관하세요.",
        en: "Keep copies of DS-2019 versions and updates."
      }
    ]
  },
  {
    slug: "h-1b",
    visaCode: "H-1B",
    title: {
      ko: "전문직 취업 비자 가이드",
      en: "Specialty Occupation Work Visa Guide"
    },
    audience: {
      ko: "미국 고용주의 청원으로 전문직 근무 예정인 신청자 대상",
      en: "For professional employment with a US petitioning employer"
    },
    overview: {
      ko: "미국 고용주가 H-1B 청원을 제출해 승인(I-797)을 받은 뒤 진행하는 절차입니다.",
      en: "Use this track when a US employer files and receives approved H-1B petition for your role."
    },
    steps: [
      {
        ko: "고용주가 H-1B 청원을 제출하고 I-797 승인 통지를 받습니다.",
        en: "Employer files H-1B petition and receives approval notice (I-797)."
      },
      {
        ko: "DS-160을 작성하고 MRV 수수료를 납부합니다.",
        en: "Complete DS-160 and pay MRV visa fee."
      },
      {
        ko: "청원 승인 반영 후 인터뷰 일정을 예약합니다.",
        en: "Schedule visa interview after petition approval is reflected."
      },
      {
        ko: "고용 관련 패키지와 학력/자격 서류를 준비합니다.",
        en: "Collect employment package and qualification documents."
      },
      {
        ko: "인터뷰에서 직무, 고용주, 근무지를 일관되게 설명합니다.",
        en: "Attend interview and explain role, employer, and work location."
      }
    ],
    requiredDocs: [
      {
        ko: "여권",
        en: "Passport"
      },
      {
        ko: "DS-160 확인 페이지",
        en: "DS-160 confirmation"
      },
      {
        ko: "I-797 승인서 사본",
        en: "I-797 approval notice copy"
      },
      {
        ko: "재직/채용 확인서 및 고용주 서포트 레터",
        en: "Employment verification/support letter"
      },
      {
        ko: "학위증/성적증명서",
        en: "Degree certificates and transcripts"
      },
      {
        ko: "최근 급여 내역(연장/이직의 경우)",
        en: "Recent pay records (for renewals/transfers)"
      }
    ],
    tips: [
      {
        ko: "직함과 직무 내용이 청원서와 일치해야 합니다.",
        en: "Job title and duties should match petition details."
      },
      {
        ko: "고용주 연락처/회사 정보 전체를 지참하세요.",
        en: "Carry complete employer contact information."
      },
      {
        ko: "갱신이라면 과거 비자와 I-94 이력을 함께 준비하세요.",
        en: "If renewing, include prior visa and I-94 history."
      }
    ]
  },
  {
    slug: "b-1-b-2",
    visaCode: "B-1/B-2",
    title: {
      ko: "비즈니스/관광 비자 가이드",
      en: "Business / Tourism Visa Guide"
    },
    audience: {
      ko: "단기 출장, 관광, 가족 방문 목적의 방문자 대상",
      en: "For short business visits, tourism, or family visits"
    },
    overview: {
      ko: "미국 내 취업이나 장기 학업이 아닌, 임시 방문 목적일 때 사용하는 경로입니다.",
      en: "Use this track for temporary travel where you are not taking US employment or long-term study."
    },
    steps: [
      {
        ko: "DS-160을 작성하고 규격에 맞는 사진을 업로드합니다.",
        en: "Complete DS-160 and upload a compliant photo."
      },
      {
        ko: "MRV 수수료를 납부하고 인터뷰를 예약합니다.",
        en: "Pay MRV fee and schedule interview."
      },
      {
        ko: "여행 계획, 자금 증빙, 본국 연고 자료를 준비합니다.",
        en: "Prepare trip plan, funding proof, and home-country ties."
      },
      {
        ko: "인터뷰에서 임시 방문 목적임을 분명히 설명합니다.",
        en: "Attend interview and explain temporary purpose of travel."
      }
    ],
    requiredDocs: [
      {
        ko: "여권",
        en: "Passport"
      },
      {
        ko: "DS-160 확인 페이지",
        en: "DS-160 confirmation"
      },
      {
        ko: "인터뷰 예약 확인서",
        en: "Appointment confirmation"
      },
      {
        ko: "여행 일정표(있는 경우)",
        en: "Travel itinerary (if available)"
      },
      {
        ko: "경비 지출 가능 재정 증빙",
        en: "Proof of financial ability"
      },
      {
        ko: "본국 복귀 의사를 뒷받침하는 연고 증빙",
        en: "Evidence of ties to home country"
      }
    ],
    tips: [
      {
        ko: "체류 기간과 귀국 예정일을 구체적으로 준비하세요.",
        en: "Be specific about trip duration and return date."
      },
      {
        ko: "서류와 인터뷰 답변의 방문 목적을 일치시키세요.",
        en: "Show consistent purpose across documents and interview answers."
      },
      {
        ko: "취업/장기 체류로 해석될 수 있는 계획은 피하세요.",
        en: "Avoid presenting plans that imply work or long-term stay."
      }
    ]
  }
];

export const visaGuideMap = Object.fromEntries(visaGuides.map((guide) => [guide.slug, guide]));
