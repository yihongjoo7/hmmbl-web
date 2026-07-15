# apiClient 수정 반영 결과 (구현)

<<<<<<< HEAD
> 대상: 개발자  
> `200-apiclient-fix-plan.md`의 수정 항목을 소스에 반영한 결과 기록. 결정 사항·변경 파일·검증 결과를 담는다.  
> 작업일: 2026-06-21 · 관련 문서: `200-apiclient-fix-plan.md`, `06-api-client.md`
=======
> 대상: 개발자
> `200-apiclient-fix-plan.md`의 수정 항목을 소스에 반영한 결과 기록. 결정 사항·변경 파일·검증 결과를 담는다.
> 작업일: 2026-06-21 · 관련 문서: `200-apiclient-fix-plan.md`, `15-api-client.md`
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

---

## 1. 결정 사항 (사용자 확인)

- **B3 (PUT/DELETE): 폐기.** 프론트가 실사용 중(`apiClient.put` → `/settings/profile`, `apiClient.delete` → `/pay/cards`·`/my/wishlist`·`/my/interest-points`)이고, `login-server`는 auth·users·orders·members·files만 구현한 부분(개발용) 백엔드라 "POST-only"는 그 서버 한정 규칙이었다. 메서드 유지, 변경 없음.
- **선택 항목: B4·B5 모두 반영.**
- **C1 (fields 계약): 옵션 1 — 전역 422 핸들러.** 백엔드가 유효성 오류를 `detail:{code,message,fields}`로 통일 반환.

---

## 2. 변경 파일

<<<<<<< HEAD
### 프론트엔드 (hmmbl-web)
=======
### 프론트엔드 (hpoint-mobile)
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

| 파일 | 변경 내용 | 항목 |
|---|---|---|
| `lib/api/parseApiError.ts` *(신규)* | `toApiError`·`getHttpErrorMessage` 공용 헬퍼. `detail` 중첩/평탄 모두 수용 | A1·A2·A3 |
| `lib/utils/errorMessages.ts` | `forbidden`·`unknown` 폴백 메시지 추가 | A3 |
| `lib/api/apiClient.ts` | `buildHeaders` 토큰 게이팅 / `withRefresh`→`toApiError` / 204 가드 / GET `cache:'no-store'`·배열 직렬화 | A1·A2·A3·B1·B2·B4·B5 |
| `lib/auth/token/tokenRefresh.ts` | 하드코딩 에러 → `toApiError` 통일 | A4 |
| `lib/auth/authService.ts` | 평탄 파싱 → `toApiError` 통일 | A4 |
| `lib/api/fileUploadClient.ts` | `ApiError` 전환 + 401 갱신 재시도 + DPoP 게이팅 + XHR/fetch를 `Response`로 정규화 | F1·B1 |
| `features/auth/hooks/useAuthInterceptor.ts` | `configureFileUploadClient`에 `onUnauthorized` 주입 | F1 |

### 백엔드 (login-server)

| 파일 | 변경 내용 | 항목 |
|---|---|---|
| `main.py` | 전역 `RequestValidationError` 핸들러 → `detail:{code:'VALIDATION_ERROR', message, fields:[{field,message}]}` | C1 |

---

## 3. 항목별 반영 결과

| # | 항목 | 결과 |
|---|---|---|
| A1 | 에러 `detail` 중첩 파싱 | ✅ `toApiError`로 통일 |
| A2 | `ApiError.fields` 전달 | ✅ (백엔드 C1이 `fields` 공급) |
| A3 | 에러 메시지 폴백 | ✅ `getHttpErrorMessage` + 메시지 확장 |
| A4 | 토큰 교환·인증 경로 에러 통일 | ✅ tokenRefresh·authService |
| F1 | 업로드 `ApiError` + 401 재시도 | ✅ |
| B1 | DPoP 토큰 게이팅 | ✅ apiClient·fileUploadClient |
| B2 | 204/빈 본문 가드 | ✅ |
| B3 | PUT/DELETE | ⛔ 폐기(유지, 변경 없음) |
| B4 | `cache:'no-store'` | ✅ GET에 적용 |
| B5 | 쿼리 배열 직렬화 | ✅ 반복 파라미터 |
| C1 | 백엔드 `fields` 계약 | ✅ 전역 422 핸들러 |
| D1 | nonce | ✅ 현행 유지(안전) |
| D2 | `X-Client-Type` | ✅ 현행 유지(무영향) |
<<<<<<< HEAD
| E1 | `06-api-client.md` 동기화 | ✅ |
=======
| E1 | `15-api-client.md` 동기화 | ✅ |
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
| G1 | `apiClient - 복사본.ts` | ✅ 유지(미변경) |

---

## 4. 검증

- **프론트 타입체크** `npx tsc --noEmit`: **통과 (exit 0)**.
- **백엔드** `python -m py_compile main.py`: 통과. AST로 핸들러 함수·등록·import 존재 확인.
- **C1 변환 단위 테스트**(FastAPI 없이 로직만): `("body","email")→email`, `("body","user","age")→user.age`, `("query","page")→page` 매핑 정상.
- **동작 변화 요약**
  - 미로그인 요청: DPoP proof·키쌍 미생성 (B1).
  - 401: `error.code`·서버 한국어 `message` 정상 노출 — 일반 API·토큰 교환·업로드 전 구간 (A1·A4·F1).
  - 폼 필드 에러: 백엔드 422 → `detail.fields` → `applyFieldErrors` 동작 (A2+C1).
  - 토큰 만료 후 업로드: `onUnauthorized` 갱신 → 1회 재시도 (F1).

---

## 5. 주의·후속

- **줄바꿈 정규화(부수 효과).** 수정한 일부 `.ts`가 CRLF였으나 LF로 통일되었다. 저장소 표준(`.prettierrc` `endOfLine: "lf"`, 미수정 파일들도 LF)과 일치하므로 의도된 정합이다. 대상: `apiClient.ts`, `authService.ts`, `tokenRefresh.ts`, `useAuthInterceptor.ts`, `errorMessages.ts`, `fileUploadClient.ts`.
- **C1은 `login-server`(개발용) 한정.** 실제 프로덕션 백엔드(별도, `/settings`·`/pay`·`/my` 등 제공)도 동일하게 422를 `detail:{code,message,fields}`로 통일해야 폼 에러가 전 구간 동작한다 → 백엔드팀 공유 필요.
- **G1 백업 파일 유지.** `apiClient - 복사본.ts`는 요청대로 보존. 단 구버전 버그를 포함하며 본 수정에서 제외했으므로 import 금지(실사용 파일은 `apiClient.ts`).
- **B4 적용 범위.** `cache:'no-store'`는 GET에만 적용(POST/PUT/DELETE는 캐시 대상이 아님).

---

## 6. 미적용 / 제외

- **B3**: 폐기(위 결정) — 코드 변경 없음.
- **G1**: 유지 — 파일 미삭제.
