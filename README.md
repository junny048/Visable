# HanMi DocKit (KRUS) MVP

한국-미국 이동자를 위한 문서 정리 + QA 리포트 + 타임라인 + EN/KO 템플릿 웹앱 MVP입니다.

## Stack
- Next.js (App Router) + TypeScript
- TailwindCSS (`from-sky-50 to-blue-100` 배경)
- Prisma + SQLite
- 파일 업로드: 로컬 `/uploads` + TTL 삭제
- OpenAI API (옵션): 필드 추출 / QA 리포트 / 템플릿 생성

## Quick Start
1. 의존성 설치
```bash
npm install
```
2. 환경변수 설정
```bash
cp .env.example .env
```
3. Prisma 초기화
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```
4. 실행
```bash
npm run dev
```

## Env
- `OPENAI_API_KEY=...`
- `UPLOAD_DIR=./uploads`
- `MAX_FILE_MB=10`
- `FILE_TTL_HOURS=24`

## Routes
- `/` 랜딩
- `/case/new` 케이스 생성
- `/case/[id]/upload` 문서 업로드
- `/case/[id]/analyze` 분석 실행
- `/case/[id]/report` QA 리포트
- `/case/[id]/timeline` 타임라인 + ICS 다운로드
- `/case/[id]/templates` 템플릿 패키지 (EN/KO)

## APIs
- `POST /api/case`
- `GET/POST /api/case/:id/upload`
- `POST /api/case/:id/analyze`
- `GET /api/case/:id/report`
- `GET /api/case/:id/timeline`
- `GET /api/case/:id/templates`

## Notes
- 본 앱은 법률 자문/대행 서비스가 아니며, 승인/거절 예측을 하지 않습니다.
- `OPENAI_API_KEY` 미설정 시 기본 휴리스틱 기반 fallback으로 동작합니다.
- 업로드 파일 TTL 정리는 업로드 시 자동 수행되며, 수동 실행은 아래 명령으로 가능합니다.
```bash
npm run cleanup:uploads
```

## Python API (FastAPI)

You can run chat inference through Python and let Next.js proxy to it.

1. Install Python dependencies
```bash
pip install -r requirements.txt
```

2. Set env values in `.env`
```env
OPENAI_API_KEY=sk-...
PYTHON_API_URL=http://127.0.0.1:8000
```

3. Run Python API server
```bash
uvicorn python.chat_api:app --host 127.0.0.1 --port 8000 --reload
```

4. Run Next.js app
```bash
npm run dev
```

5. Optional API key sanity test (Python)
```bash
python python/chat_test.py
```

Notes:
- If `PYTHON_API_URL` is set, `app/api/chat` calls Python first.
- If `PYTHON_API_URL` is empty, `app/api/chat` falls back to direct Node OpenAI call.
