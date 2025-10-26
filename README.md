# SAPIENTIA MVP

**정보를 지혜로 전환하는 가치 기반 학습 플랫폼**

사피엔티아는 타인의 정보를 나의 관점으로 재해석하고, 72시간 내 실행 가능한 행동으로 전환하는 지적 인프라입니다.

## 핵심 기능

- **가치 렌즈**: 개인의 가치관(자율성, 성장, 연대, 안정성, 미학, 진실성)에 따라 정보를 개인화
- **재해석 시스템**: LLM 또는 직접 작성을 통해 타인의 언어를 나의 언어로 전환
- **행동 전환**: 재해석한 통찰을 72시간 내 실행 가능한 3개의 작은 행동으로 변환
- **지식 그래프**: 누적된 노드와 통찰을 시각화하여 개인의 세계관 성장 추적

## 기술 스택

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS** (커스텀 디자인 토큰)
- **localforage** (IndexedDB)
- **lucide-react** (아이콘)
- **OpenAI GPT-4o-mini** (선택사항)

## 로컬 실행

### 1. 설치

```bash
npm install
```

### 2. 환경변수 설정 (선택사항)

`.env.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.example .env.local
```

OpenAI API 키가 없어도 템플릿 모드로 작동합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 프로젝트 구조

```
/app
  /(public)/page.tsx        # 랜딩 페이지
  /(app)/page.tsx           # 메인 앱
  /(app)/onboarding/        # 온보딩 (가치 선택)
  /(app)/graph/             # 지식 그래프
  /(api)/generate/          # LLM 프록시
/components                 # 재사용 컴포넌트
/lib                        # 핵심 로직
  schemas.ts                # 타입 정의
  storage.ts                # IndexedDB 어댑터
  scoring.ts                # 개인화 점수 함수
  prompts.ts                # LLM 프롬프트
  guards.ts                 # 가드레일
  sampleData.ts             # 샘플 노드
/styles
  globals.css               # 글로벌 스타일 + 디자인 토큰
```

## 사용 흐름

1. **온보딩**: 6개 가치 중 3개 선택 + 닉네임·PIN 설정
2. **메인 화면**: 
   - 상단: 가치 렌즈 토글
   - 좌측: 추천 노드 5개
   - 중앙: 재해석 에디터
   - 우측: 행동 체크리스트
3. **재해석**: LLM 제안 또는 직접 작성
4. **행동 실행**: 72시간 내 완료 가능한 3개 행동 체크
5. **그래프**: 누적 노드와 통찰 시각화

## 데이터 저장

- **로컬 전용**: localStorage + IndexedDB
- **인증**: 닉네임 + 4자리 PIN (로컬 저장)
- **마이그레이션 대비**: Supabase 테이블 구조와 호환

## 배포

### Vercel 배포

```bash
npm run build
vercel
```

환경변수 설정:
- `OPENAI_API_KEY` (선택사항)
- `NEXT_PUBLIC_APP_NAME=SAPIENTIA`

## 설계 원칙

- **개인 우선**: 평균값이 아닌 나의 맥락과 가치
- **사유→행동**: 통찰은 반드시 작은 실행으로
- **재현 가능성**: 좋은 실행은 패턴으로 남긴다
- **증거와 겸허**: 출처·가정·한계를 드러낸다
- **권리·비폭력**: 자발성과 절차적 정당성 우선

## 의사결정 필터

모든 기능은 다음 기준을 통과해야 합니다:

1. 10분 안에 명료성 상승 여부
2. 72시간 안 실행 가능 여부
3. 다른 사람도 따라 할 패턴 여부
4. 권리·비폭력 원칙 준수 여부
5. 측정 가능한 지표 여부

## 성공 지표

- **재해석 완료율**: "내 언어로 재정리"까지 도달한 세션 비율
- **IAR** (Insight→Action Rate): 재해석 후 72시간 내 실행 비율
- **Purpose Clarity Δ**: 전·후 명료성 점수 변화

## 라이선스

MIT

## 문의

프로젝트 관련 문의: SAPIENTIA Team

