# apiClient 수정 계획 — 백엔드(login-server) 정합성

> 대상: 개발자
> `nextjs-new` ↔ `hpoint-mobile`의 API 클라이언트 비교와 `login-server`(FastAPI) 실제 동작 검증으로 도출한 수정 항목을 누락 없이 정리합니다.
> 관련 문서: `15-api-client.md`, `13-auth-system.md`
> 대상 파일: `lib/api/apiClient.ts`, `lib/api/fileUploadClient.ts`, `lib/auth/token/tokenRefresh.ts`, `lib/auth/authService.ts`, `lib/utils/errorMessages.ts`

---

## 0. 한눈에 보기

| # | 항목 | 심각도 | 유형 | 대상 |
|---|---|---|---|---|
| A1 | 에러 응답 `detail` 중첩 미파싱 | 🔴 치명 | 버그 | `apiClient.ts` |
| A2 | `ApiError.fields` 미전달 | 🟠 높음 | 버그 | `apiClient.ts` |
| A3 | 에러 메시지 폴백 부재 | 🟡 중간 | 버그/UX | `apiClient.ts`, `errorMessages.ts` |
| A4 | 동일 에러 파싱 문제가 다른 파일에도 존재 | 🟠 높음 | 버그 | `tokenRefresh.ts`, `authService.ts` |
| F1 | 업로드 클라이언트: `ApiError` 미사용 + 401 갱신 재시도 없음 | 🟠 높음 | 버그/정합 | `fileUploadClient.ts` |
| B1 | DPoP 무조건 첨부 (토큰 게이팅 없음) | 🟡 중간 | 개선 | `apiClient.ts`, `fileUploadClient.ts` |
| B2 | 204 No Content 미처리 | 🟢 낮음 | 방어 | `apiClient.ts` |
| B3 | ~~PUT/DELETE 제거~~ → **폐기**(실사용 중이라 유지) | ⛔ 폐기 | 정합 | — |
| B4 | `cache: 'no-store'` 누락 | 🟡 중간 | 방어 | 모든 fetch 클라이언트 |
| B5 | 쿼리 파라미터 배열 직렬화 차이 | 🟢 낮음 | 잠재 | `apiClient.ts` |
| C1 | `fields` 백엔드 계약 부재 | 🟠 높음 | 협의 | login-server |
| D1 | nonce 미구현 — 현재 안전 | ✅ 유지 | 확인됨 | — |
| D2 | `X-Client-Type` 제거 — 로깅만 | ✅ 무영향 | 확인됨 | — |
| E1 | `15-api-client.md` 동기화 | 🟢 낮음 | 문서 | docs |
| G1 | `apiClient - 복사본.ts` 백업 파일 — 유지(참고용) | ⚪ 정보 | 정리 | `lib/api/` |

> 권장 순서: **A1·A4·F1 → A2·A3 → C1 → B1 → B4 → B2 → B5 → E1.**
> A1·A2·A3·A4·F1·C1은 함께 처리해야 에러 처리·폼 에러 매핑·업로드가 끝까지 동작한다.
> 에러 파싱은 **공용 헬퍼(`toApiError`)로 통일**해 4개 파일에 일괄 적용하는 것을 전제로 한다(부록 A).

---

## 1. 검증 기준 (백엔드 DPoP 정책)

`login-server`(FastAPI)는 엔드포인트를 3종류로 나눠 DPoP를 적용한다.

| 종류 | 예 | 인증/DPoP | 미로그인 + DPoP만 보낼 때 |
|---|---|---|---|
| 공개 | `/members/*` | 의존성 없음 | DPoP 헤더를 **읽지도 검증도 안 함**(무시) |
| 보호 리소스 | `users`, `orders`, `files` | `Depends(get_current_user)` | `Authorization` 없으면 **즉시 401** (DPoP 무관) |
| 토큰 발급 | `/auth/login`, `/auth/token`, `/auth/social/google` | `DPOP_VERIFY` 시 DPoP 필수 | 없으면 401 `DPOP_REQUIRED` |

추가 사실:

- 전역 DPoP 미들웨어 없음 — `main.py`는 CORS + 업로드 크기 제한 미들웨어만 등록.
- `/auth/refresh`는 **DPoP 검증 안 함** — 쿠키 `refreshToken`만 검증(`service.refresh`).
- 모든 에러는 `HTTPException(detail={"message","code"})` → 응답 본문이 `{"detail":{...}}`로 중첩됨.

근거 파일: `core/security.py`, `domains/members/router.py`, `domains/auth/service.py`, `domains/files/router.py`, `main.py`.

---

## 2. 반드시 수정 (Must fix)

### A1. 에러 응답 `detail` 중첩 미파싱 🔴

**증상.** 모든 에러에서 `error.code`가 항상 `'UNKNOWN'`, `error.message`가 항상 영문 `res.statusText`로 떨어진다. → `error.code === ErrorCode.XXX` 분기(`15-api-client.md` §4)가 전부 무력화되고, 사용자에게 서버의 한국어 메시지 대신 `"Unauthorized"` 같은 영문이 노출된다.

**원인.** FastAPI는 `HTTPException(detail={...})`를 `{"detail":{...}}`로 감싼다. 그런데 apiClient는 최상위 `body.code`/`body.message`를 읽는다.

```ts
// 현재 (lib/api/apiClient.ts, withRefresh 내부) — 최상위를 읽어 항상 undefined
const body = await res.json().catch(() => ({ message: res.statusText }));
throw new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? res.statusText);
```

**근거.** 백엔드 자체 테스트가 `detail` 중첩을 전제로 읽는다.

```python
# login-server/login-test.py:300
if status == 401 and body.get("detail", {}).get("code") == "DPOP_REQUIRED":
```

`core/security.py`도 `detail={"message": ..., "code": ...}` 형태로만 raise 하며, 백엔드에 `detail`을 평탄화하는 예외 핸들러는 없다(`main.py`에 `RateLimitExceeded` 핸들러뿐).

**수정.** `detail`이 객체면 그 안에서, 아니면 최상위에서 읽도록 공용 헬퍼 `toApiError`로 통일한다(부록 A).

```ts
if (!res.ok) throw await toApiError(res);
```

---

### A2. `ApiError.fields` 미전달 🟠

**증상.** `applyFieldErrors()`가 항상 `false`를 반환 → 폼 필드 에러 매핑(`15-api-client.md` §5)이 동작하지 않는다.

**원인.** `withRefresh`가 `ApiError` 생성 시 4번째 인자 `fields`를 넘기지 않는다(위 §A1 현재 코드). `ApiError` 시그니처(`types/api.ts`)와 `applyFieldErrors`는 `fields`를 기대한다.

**수정.** 공용 헬퍼 `toApiError`가 `d.fields`를 4번째 인자로 채운다. 단, **현재 백엔드는 `fields`를 반환하지 않으므로 C1과 함께 처리**해야 실제 폼 에러가 채워진다.

---

### A3. 에러 메시지 폴백 부재 🟡

**증상.** 서버가 메시지를 주지 않거나 비-JSON·네트워크 오류일 때, 사용자에게 영문 `statusText`가 노출된다.

**원인.** 현재 폴백이 `res.statusText`(영문).

**수정.** `getHttpErrorMessage()`(부록 A)를 헬퍼에 내장하고, `fallbackMessages`를 확장한다. (현재 `errorMessages.ts`에는 `server` 키만 존재.)

```ts
// lib/utils/errorMessages.ts — forbidden / unknown 추가
export const fallbackMessages = {
  server:    '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  forbidden: '접근 권한이 없습니다.',
  unknown:   '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.',
};
```

---

### A4. 동일 에러 파싱 문제가 다른 파일에도 존재 🟠

**A1의 평탄 파싱·하드코딩 문제는 apiClient.ts에만 있는 게 아니다.** 토큰 교환·인증 경로도 같은 결함을 가진다.

```ts
// lib/auth/token/tokenRefresh.ts:51 — 서버 detail.code/message를 완전히 버리고 하드코딩
throw new ApiError(res.status, 'TOKEN_EXCHANGE_FAILED', 'Token exchange failed');

// lib/auth/authService.ts:42 — 최상위 평탄 파싱(detail 미대응) + fields 없음
const body = await res.json().catch(() => ({ message: res.statusText }));
throw new ApiError(res.status, body.code ?? 'TOKEN_EXCHANGE_FAILED', body.message ?? res.statusText);
```

이 경로들은 `/auth/token` 실패 시 서버가 주는 `DPOP_REQUIRED`/`DPOP_INVALID`/`INVALID_CODE` 등을 손실한다 → 로그인·토큰 갱신 실패 원인 진단 불가.

**수정.** A1과 동일한 공용 `toApiError(res, fallbackCode)`로 4개 파일을 통일한다:
`apiClient.ts`, `tokenRefresh.ts`(fallback `'TOKEN_EXCHANGE_FAILED'`), `authService.ts`(동일), `fileUploadClient.ts`(F1).

---

### F1. 업로드 클라이언트: `ApiError` 미사용 + 401 갱신 재시도 없음 🟠

`lib/api/fileUploadClient.ts`는 에러를 **`ApiError`가 아닌 일반 `Error`로** 던지고, **401 토큰 갱신·재시도 로직이 전혀 없다.**

```ts
// fetch 경로 (147행 부근)
if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

// XHR 경로 (126행 부근)
reject(new Error(`Upload failed: ${xhr.status}`));
```

**문제 1 — 에러 시스템 우회.** `instanceof ApiError`가 거짓이 되어 `status`/`code`/`message`/`fields`를 모두 잃는다. `15-api-client.md` §2의 전역 에러 전략, `applyFieldErrors`, 한국어 메시지가 업로드에는 적용되지 않는다.

**문제 2 — 토큰 만료 시 업로드 하드 실패.** `/files/upload`·`/files/image`는 `Depends(get_current_user)` 보호 엔드포인트다. 액세스 토큰이 만료된 상태로 업로드하면 401이 나는데, `uploadFile`도 상위 `fileApi.ts`도 갱신·재시도를 하지 않아 그대로 실패한다. `nextjs-new`는 이 케이스를 위해 `ensureRefreshedToken`(single-flight refresh)을 export 해 업로드 XHR에서 재사용했다 — hpoint-mobile에는 해당 장치가 없다.

**수정.**

1. 두 경로(fetch·XHR) 모두 비-2xx 시 `toApiError`로 `ApiError`를 던진다(XHR은 `xhr.responseText` 파싱).
2. 401 시 `lib/auth/interceptor.ts`의 갱신 로직을 재사용해 새 토큰으로 1회 재시도한다. interceptor에 `ensureRefreshedToken` 상응 함수를 export 하거나, 업로드 호출을 `onUnauthorized` 흐름에 태운다.
3. DPoP proof 생성도 토큰 게이팅(B1)을 적용한다(아래).

---

## 3. 정합성 개선 (Should fix)

### B1. DPoP 토큰 게이팅 🟡

**현재.** `apiClient.buildHeaders`와 `fileUploadClient.uploadFile` 모두 토큰 유무와 무관하게 `createDPoPProof`를 호출한다 → 미로그인 공개 API 호출에도 proof를 만들고, 내부 `getOrCreateKeyPair()`로 **DPoP 키쌍이 선제 생성**된다. 비보안 컨텍스트(SubtleCrypto 미지원)에서는 공개 API 호출까지 throw로 깨진다.

**백엔드 사실.** 공개 엔드포인트는 DPoP를 무시하고, 보호 엔드포인트는 `Authorization`이 없으면 DPoP가 있어도 401이다. 즉 **토큰 없는 요청에 DPoP는 무의미**하다. 토큰 발급 경로(`/auth/token`)의 proof는 `tokenRefresh.ts`/`authService.ts`가 직접 생성하므로 영향 없다(이쪽은 의도된 무-토큰 DPoP).

**수정.** `apiClient.buildHeaders`에서 토큰이 있을 때만 proof를 생성·첨부한다(`nextjs-new`와 동일). `fileUploadClient`도 동일 적용.

```ts
// apiClient.buildHeaders — after
const token = _getToken?.() ?? null;
const headers: Record<string, string> = { 'Content-Type': 'application/json' };
if (token) {
  headers.Authorization = `DPoP ${token}`;
  headers.DPoP = await createDPoPProof(url, method);
}
return headers;
```

---

### B2. 204 No Content 미처리 🟢

**현재.** `withRefresh`가 항상 `res.json()`을 호출 → 빈 본문이면 파싱 throw. 현재 백엔드는 전부 `response_model`로 JSON 본문을 반환하므로 거의 발생하지 않지만, 방어적으로 가드한다.

```ts
if (res.status === 204 || res.headers.get('content-length') === '0') {
  return undefined as T;
}
return res.json();
```

---

### B3. PUT/DELETE 메서드 — 폐기(철회) ⛔

> **결정: 이 항목은 폐기한다. PUT/DELETE를 그대로 유지한다.**

`login-server`는 auth·users·orders·members·files만 구현한 **부분(개발용) 백엔드**이고, "POST-only"는 그 서버 한정 규칙이었다. 프론트엔드는 실제로 `apiClient.put`(`/settings/profile`)·`apiClient.delete`(`/pay/cards`, `/my/wishlist`, `/my/interest-points`)를 사용 중이므로 메서드를 제거하면 해당 기능이 깨진다. 따라서 PUT/DELETE는 유지한다.

---

### B4. `cache: 'no-store'` 누락 🟡

`nextjs-new`는 **모든 fetch에 `cache: 'no-store'`**를 명시했지만, hpoint-mobile의 fetch 클라이언트(`apiClient.ts`·`fileUploadClient.ts`·`authService.ts`·`tokenRefresh.ts`)는 전부 미설정이다.

**영향.** Next.js 14.2.x App Router는 `fetch`를 패치해, 서버 사이드(RSC·route handler)에서 GET 응답을 기본 캐시(Data Cache)한다. apiClient가 서버 측에서 호출될 경우 **인증 응답이 캐시되어 stale·교차 사용자 노출** 위험이 있다. 클라이언트(React Query) 전용 호출이면 영향은 작다.

> 참고: `lib/i18n/translate.ts`는 이미 `next: { revalidate: 86400 }`로 캐시를 의식적으로 다루고 있다(주석에 `cache: 'no-store'` 대체라 명시). apiClient 계열만 누락된 상태.

**수정.** 데이터 신선도가 중요한 API 호출에 `cache: 'no-store'`를 추가한다(최소한 GET).

---

### B5. 쿼리 파라미터 배열 직렬화 차이 🟢

`apiClient.get`은 값을 `String(v)`로 변환하므로 **배열이 콤마 결합**된다(`{ ids: [1,2] }` → `?ids=1,2`). `nextjs-new`는 `flatMap`으로 **반복 파라미터**를 만든다(`?ids=1&ids=2`).

**현재 영향 없음.** 백엔드 GET은 `/orders/order-list`의 스칼라 파라미터(`from`/`to`/`productCode`)뿐이라 배열 쿼리 엔드포인트가 없다. 다만 향후 배열 파라미터가 필요해지면 직렬화 방식을 합의해야 한다(반복 vs 콤마).

---

## 4. 백엔드 협의 필요

### C1. `fields` 계약 부재 🟠

현재 `login-server`는 **어떤 엔드포인트에서도 `fields` 배열을 반환하지 않는다.** Pydantic 유효성 오류(422)도 FastAPI 기본형 `{"detail":[{"loc","msg","type"}]}`이다. 따라서 A2를 고쳐도 백엔드가 `detail.fields`를 주지 않으면 폼 필드 에러는 비어 있다.

선택지:

1. (권장) 백엔드가 유효성 오류를 `detail: { code, message, fields: [{ field, message }] }`로 통일 → 프론트 계약과 일치, A2가 그대로 동작.
2. 프론트 `applyFieldErrors`가 422 기본형(`detail[].loc`/`msg`)을 `{ field, message }`로 변환하도록 보강.

→ 둘 중 하나로 결정한 뒤 A2를 마무리한다.

---

## 5. 수정 불필요 — 확인 완료

### D1. nonce 미구현 — 현재 안전 ✅

백엔드 `verify_dpop_proof`에는 nonce 단계가 없고(구조·typ·alg·jwk·서명·htm·htu·iat·jti 9단계), 401 응답도 `WWW-Authenticate: DPoP`만 보낸다(`nonce="..."` 없음). `service.py` 주석도 "현 서버는 nonce 미구현"이라 명시한다. 따라서 빈 `lib/auth/dpop/nonce.ts` 스텁과 nonce 재시도 미구현은 **현재 정상**이다. `nextjs-new`의 `use_dpop_nonce` 재시도 분기는 이 서버에선 죽은 코드.

⚠️ **잠재 트랩.** 백엔드가 향후 nonce를 도입하면 즉시 깨진다. 도입 시 `use_dpop_nonce` 응답을 감지해 nonce로 재서명·재시도하는 분기를 추가할 것.

### D2. `X-Client-Type` 제거 — 무영향 ✅

`nextjs-new`는 `X-Client-Type: webview|web`을 보냈지만 `hpoint-mobile`은 제거했다. 백엔드는 이 헤더를 `files/router.py`에서 **로그 출력용으로만** 읽는다(`request.headers.get("X-Client-Type", "-")`). 비즈니스 로직 없음 → 동작 무영향.

🔸 선택: 업로드 로그에서 webview/web 구분이 필요하면 `buildHeaders`에 한 줄로 복원 가능(필수 아님).

---

## 6. 연계 문서 갱신·정리

### E1. `15-api-client.md` 동기화 🟢

- §1 "모든 요청에 자동으로 DPoP Proof 첨부" → "**액세스 토큰이 있을 때만** 첨부"로 변경(B1).
- §3 / §5의 에러·`fields` 동작을 A1/A2/A4/C1 반영해 갱신.
- §6 업로드 에러가 `ApiError`로 통일됨을 반영(F1).

### G1. `apiClient - 복사본.ts` 백업 파일 — 유지 ⚪

`lib/api/apiClient - 복사본.ts`는 `apiClient.ts`의 백업 복사본으로, **어디서도 import되지 않는다**(전역 검색 결과 자기 자신만 매치). **사용자 결정에 따라 삭제하지 않고 유지한다.**

단, 이 파일은 동일한 A1/A2 버그를 그대로 포함하므로 다음에 유의한다.

- 본 수정 계획의 적용 대상에서 **제외**한다(백업 스냅샷이므로 수정하지 않음).
- 실수로 import하지 않도록 주의한다 — 실제 사용 파일은 `apiClient.ts`다.

---

## 7. 적용 체크리스트

- [ ] **공용 헬퍼** `lib/api/parseApiError.ts` 신설(`toApiError`, `getHttpErrorMessage`) — 부록 A
- [ ] **A1/A2** `apiClient.ts`: `withRefresh` 에러 처리를 `toApiError`로 교체(첫 시도·재시도 공통 지점)
- [ ] **A3** `errorMessages.ts`에 `forbidden`/`unknown` 추가
- [ ] **A4** `tokenRefresh.ts`·`authService.ts`의 에러 생성도 `toApiError`로 통일
- [ ] **F1** `fileUploadClient.ts`: fetch·XHR 양쪽을 `ApiError`로 전환 + 401 토큰 갱신·재시도 추가
- [ ] **B1** `buildHeaders`·`uploadFile`: 토큰이 있을 때만 DPoP proof 생성·첨부
- [ ] **B2** `withRefresh`: 204/빈 본문 가드 추가
- [x] **B3** 폐기(철회) — PUT/DELETE 유지(실사용 중), 변경 없음
- [ ] **B4** fetch 클라이언트에 `cache: 'no-store'` 추가(최소 GET)
- [ ] **B5** 배열 쿼리 직렬화 방식 합의(필요 시 `flatMap` 반복 파라미터로)
- [ ] **C1** 백엔드와 `fields` 계약 합의 → A2 검증
- [ ] **E1** `15-api-client.md` 갱신 (G1 백업 파일은 유지 — 조치 없음)
- [ ] **검증**: ① 미로그인 공개 API 호출 시 DPoP/키 미생성 ② 401 시 `error.code`·한국어 메시지 정상(일반 API·토큰 교환·업로드 모두) ③ 폼 필드 에러 매핑 동작 ④ 토큰 만료 후 업로드가 갱신·재시도로 성공 ⑤ `npm run build` / `type-check` 통과

---

## 부록 A. 수정 후 핵심 코드 (참고)

```ts
// lib/api/parseApiError.ts (신규) — 모든 ApiError 생성 지점이 공유
import { ApiError } from '@/types/api';
import { fallbackMessages } from '@/lib/utils/errorMessages';

type RawErrorBody = {
  detail?: { code?: string; message?: string; fields?: ApiError['fields'] };
  code?: string;
  message?: string;
  fields?: ApiError['fields'];
};

export function getHttpErrorMessage(status: number): string {
  if (status >= 500)  return fallbackMessages.server;
  if (status === 403) return fallbackMessages.forbidden;
  return fallbackMessages.unknown;
}

/** Response → ApiError. FastAPI의 detail 중첩과 평탄 형태를 모두 수용한다. */
export async function toApiError(res: Response, fallbackCode = 'UNKNOWN'): Promise<ApiError> {
  const raw = (await res.json().catch(() => null)) as RawErrorBody | null;
  const d = raw && typeof raw.detail === 'object' && raw.detail ? raw.detail : (raw ?? {});
  return new ApiError(
    res.status,
    d.code ?? fallbackCode,
    d.message ?? getHttpErrorMessage(res.status),
    d.fields,
  );
}
```

```ts
// lib/api/apiClient.ts (발췌)
async function buildHeaders(url: string, method: string): Promise<HeadersInit> {
  const token = _getToken?.() ?? null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `DPoP ${token}`;
    headers.DPoP = await createDPoPProof(url, method);
  }
  return headers;
}

// withRefresh 응답 처리부 (401 재시도 이후 경로와 공유되는 단일 지점)
if (!res.ok) throw await toApiError(res);
if (res.status === 204 || res.headers.get('content-length') === '0') {
  return undefined as T;
}
return res.json();
```

```ts
// tokenRefresh.ts / authService.ts — 하드코딩·평탄 파싱을 헬퍼로 교체
if (!res.ok) throw await toApiError(res, 'TOKEN_EXCHANGE_FAILED');
```

> 주의: 동일한 에러 파싱·204 가드가 401 재시도 **이후** 경로에도 적용되어야 한다. `withRefresh`의 최종 `if (!res.ok)` / `return` 한 곳에서 처리하면 첫 시도와 재시도가 모두 커버된다.

---

## 부록 B. 근거 위치

| 주제 | 파일 |
|---|---|
| 에러 `detail` 중첩 (테스트가 증명) | `login-server/login-test.py:300` |
| 에러 raise 형태 | `login-server/core/security.py:46-72` |
| 공개 엔드포인트 DPoP 무시 정책 | `login-server/domains/members/router.py:6-16` |
| 토큰 발급 DPoP 필수 / nonce 미구현 | `login-server/domains/auth/service.py` |
| `X-Client-Type` 로깅 전용 | `login-server/domains/files/router.py:44-60` |
| 백엔드 GET은 스칼라 쿼리만 | `login-server/domains/orders/router.py:11-15` |
| 전역 핸들러 부재 | `login-server/main.py:60-61` |
| 일반 API 에러 파싱 | `hpoint-mobile/lib/api/apiClient.ts:124-133` |
| 토큰 교환 에러 하드코딩 | `hpoint-mobile/lib/auth/token/tokenRefresh.ts:50-51` |
| 인증 코드 교환 평탄 파싱 | `hpoint-mobile/lib/auth/authService.ts:40-46` |
| 업로드 `Error`·401 미처리 | `hpoint-mobile/lib/api/fileUploadClient.ts:118-147` |
| 백업 파일(유지) | `hpoint-mobile/lib/api/apiClient - 복사본.ts` |
| 폼 에러 매핑 기대치 | `hpoint-mobile/docs/15-api-client.md` §5 |
