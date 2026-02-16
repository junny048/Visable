import path from "path";

export const APP_NAME = "HanMi DocKit";
export const APP_TAGLINE = "한국-미국 이동 문서 정리와 서류 QA 자동화";

export const uploadDir = process.env.UPLOAD_DIR ?? "./uploads";
export const maxFileMb = Number(process.env.MAX_FILE_MB ?? "10");
export const fileTtlHours = Number(process.env.FILE_TTL_HOURS ?? "24");

export const resolvedUploadDir = path.resolve(process.cwd(), uploadDir);
