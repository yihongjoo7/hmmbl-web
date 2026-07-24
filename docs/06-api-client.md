# API 클라이언트 및 에러 처리

> 대상: 개발자  
> apiClient DI 패턴, React Query 설정, 파일 업로드, 에러 타입, formErrors를 다룹니다.  
> 2026-06 갱신: DPoP 토큰 게이팅·에러 `detail` 파싱·업로드 ApiError 적용 — 상세는 `200`/`201` 문서 참조.

---

## 1. apiClient 구조 (`lib/api/apiClient.ts`)

### 초기화 (DI 패턴)

`apiClient`는 Zustand에 직접 의존하지 않습니다.  
앱 시작 시 콜백을 주입해 인증을 연결합니다.

```ts
import { configureApiClient } from '@/lib/api/apiClient';
import { getAccessToken, useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { createAuthInterceptor } from '@/lib/auth/interceptor';

configureApiClient({
  // 현재 Access Token 동기 반환 (module-level getter, Zustand 미구독)
  getToken: getAccessToken,

  // 401 수신 시 토큰 갱신 후 새 토큰 반환
  onUnauthorized: createAuthInterceptor((token, user) => setAuth(user, token)),

  // 갱신 실패 시 로그아웃
  onClearAuth: () => useAuthStore.getState().clearAuth(),
});
```

`configureApiClient()`는 `features/auth/hooks/useAuthInterceptor.ts`의 `useEffect`에서 호출합니다.  
`accessToken`은 Zustand state가 아니라 모듈 변수이므로 `getAccessToken()`으로 동기 조회합니다(상세: `05-auth-system.md` 2장).

### 요청 메서드

```ts
import { apiClient } from '@/lib/api/apiClient';

// GET
const data = await apiClient.get<MissionList>('/earn/missions');

// POST
const result = await apiClient.post<MissionDetail>('/earn/missions', { id: '123' });
```

### DPoP 헤더 자동 첨부

액세스 토큰이 있을 때만 DPoP Proof가 첨부됩니다(미로그인 요청에는 생성·첨부하지 않음).

```
Authorization: DPoP <access_token>
DPoP: <proof_jwt>             ← 토큰 보유 시, 요청마다 새로 생성 (RFC 9449)
Content-Type: application/json
```

### 401 자동 재시도

```
요청 → 401 응답
  → onUnauthorized() 호출 (토큰 갱신)
  → 새 토큰으로 동일 요청 1회 재시도
  → 재시도도 401이면 onClearAuth() 호출 (로그아웃)
```

동시에 여러 요청이 401을 받으면, 첫 번째 요청만 갱신을 시도하고 나머지는 갱신 완료 후 재시도합니다.

---

## 2. React Query 설정 (`app/providers.tsx`)

### QueryClient 기본 설정

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,         // 항상 서버에서 새 데이터 조회
      gcTime:    5 * 60_000, // 5분 후 캐시에서 제거
      retry:     1,          // 실패 시 1회 재시도
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.status >= 500) {
          // 500+: 전역 Toast
          useToastStore.getState().addToast(fallbackMessages.server, 'error');
          console.error('[ApiError]', { api_status: String(error.status), ... });
        }
        // 4xx: 화면별 처리 (전역 토스트 없음)
      }
    },
  }),
})
```

### 에러 처리 전략

| 에러 종류 | 처리 위치 | 방법 |
|---|---|---|
| 500+ (서버 에러) | 전역 (`QueryCache.onError`) | Toast 메시지 표시 |
| 4xx (클라이언트 에러) | 각 화면 | `useQuery`의 `error` 상태로 처리 |
| 네트워크 에러 | 전역 | 동일 (instanceof ApiError 아닌 경우 console.error) |

### useQuery 패턴

```ts
import { useQuery } from '@tanstack/react-query';
import { missionApi } from '@/features/earn/mission/services/missionApi';

function useMissionList() {
  return useQuery({
    queryKey: ['earn', 'missions'],
    queryFn:  () => missionApi.getList(),
  });
}

// 화면에서 사용
function MissionPage() {
  const { data, isLoading, error } = useMissionList();

  return (
    <MissionView
      items={data?.data ?? []}
      isLoading={isLoading}
      errorMessage={error ? '미션 목록을 불러오지 못했습니다.' : undefined}
    />
  );
}
```

### useMutation 패턴

`useMutation`은 데이터를 변경하는 요청(생성·수정·삭제 등)에 사용합니다.  
`onSuccess`에서 관련 쿼리를 `invalidateQueries`로 무효화해 최신 데이터를 자동 재조회하고, `onError`에서는 `applyFieldErrors`(5장)로 필드별 유효성 에러를 먼저 적용한 뒤 필드 에러가 없을 때만 전역 토스트로 에러 메시지를 표시합니다.  
`form`(react-hook-form의 `useForm()`)과 토스트 호출은 `useMutation` 자체가 아니라 이를 사용하는 컴포넌트에서 주입합니다(토스트 사용법: `07-state-management.md` 2장).

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/types/api';
import { useToastStore } from '@/hooks/useToastStore';

function useMissionComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => missionApi.complete(id),
    onSuccess: () => {
      // 관련 쿼리 무효화 → 자동 재조회
      queryClient.invalidateQueries({ queryKey: ['earn', 'missions'] });
    },
    onError: (error: unknown) => {
      if (!applyFieldErrors(error, form.setError)) {
        // 필드 에러가 없으면 전역 토스트로 에러 메시지 표시
        const message = error instanceof ApiError ? error.message : '오류가 발생했습니다.';
        useToastStore.getState().addToast(message, 'error');
      }
    },
  });
}
```

---

## 3. API 응답 타입 (`types/api.ts`)

### 기본 응답

```ts
// 단건 응답
interface ApiResponse<T> {
  data:    T;
  message: string;
}

// 페이지네이션 목록 응답
interface ApiListResponse<T> {
  data:  T[];
  total: number;
  page:  number;
  size:  number;
}

// 커서 기반 무한 스크롤 응답
interface CursorResponse<T> {
  data:       T[];
  nextCursor: string | null;
}
```

### 에러 응답

```ts
interface ErrorResponse {
  code:    string;
  message: string;
  detail?: Record<string, string>;
  fields?: Array<{ field: string; message: string }>;  // 필드별 유효성 에러
}

class ApiError extends Error {
  constructor(
    public readonly status:  number,   // HTTP 상태 코드
    public readonly code:    string,   // 비즈니스 에러 코드
    message:                 string,
    public readonly fields?: Array<{ field: string; message: string }>,
  ) { ... }
}
```

### ApiError 생성 (공용 헬퍼 `lib/api/parseApiError.ts`)

에러 응답 파싱은 `toApiError`로 통일한다.  
백엔드(FastAPI)는 오류를 `{"detail": {...}}`로 감싸므로, `detail`(배열 아닌 객체)이면 그 안에서, 아니면 최상위에서 `code`/`message`/`fields`를 읽는다.

```ts
// apiClient·tokenRefresh·authService·fileUploadClient 공통
if (!res.ok) throw await toApiError(res);
```

---

## 4. 에러 코드 상수 (`types/errors.ts`)

```ts
import { ErrorCode } from '@/types/errors';

ErrorCode.UNAUTHORIZED               // 'UNAUTHORIZED'
ErrorCode.FORBIDDEN                  // 'FORBIDDEN'
ErrorCode.NOT_FOUND                  // 'NOT_FOUND'
ErrorCode.VALIDATION_ERROR           // 'VALIDATION_ERROR'
ErrorCode.INTERNAL_SERVER_ERROR      // 'INTERNAL_SERVER_ERROR'
ErrorCode.MEMBER_NOT_FOUND           // 'MEMBER_NOT_FOUND'
ErrorCode.MEMBER_ALREADY_EXISTS      // 'MEMBER_ALREADY_EXISTS'
ErrorCode.APPROVAL_ALREADY_PROCESSED // 'APPROVAL_ALREADY_PROCESSED'
ErrorCode.APPROVAL_NOT_FOUND         // 'APPROVAL_NOT_FOUND'

// 에러 코드 체크
if (error instanceof ApiError && error.code === ErrorCode.MEMBER_NOT_FOUND) {
  // 회원 없음 처리
}
```

---

## 5. 폼 에러 매핑 (`lib/utils/formErrors.ts`)

서버가 필드별 유효성 에러(`ApiError.fields`)를 반환할 때, react-hook-form의 `setError`에 자동 매핑합니다.

```ts
import { applyFieldErrors } from '@/lib/utils/formErrors';
import { ApiError } from '@/types/api';

// useMutation onError에서 사용
onError: (error: unknown) => {
  const hasFieldErrors = applyFieldErrors(error, form.setError);

  if (!hasFieldErrors) {
    // fields 에러가 없을 때만 전역 에러 메시지 표시 (예: 토스트 — 07-state-management.md 2장)
    const message = error instanceof ApiError ? error.message : '오류가 발생했습니다.';
    useToastStore.getState().addToast(message, 'error');
  }
},
```

`applyFieldErrors()` 내부:

1. `error instanceof ApiError` 확인
2. `error.fields?.length` 확인
3. 각 `{ field, message }`를 `setError(field, { message })` 호출
4. 필드 에러를 적용했으면 `true`, 없으면 `false` 반환

서버 응답 예시:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "입력값을 확인해 주세요.",
  "fields": [
    { "field": "email",    "message": "이미 사용 중인 이메일입니다." },
    { "field": "nickname", "message": "닉네임은 2자 이상이어야 합니다." }
  ]
}
```

---

## 6. 파일 업로드 (`lib/api/fileUploadClient.ts`)

> 업로드 실패는 `ApiError`로 던지며, 401 시 `onUnauthorized`로 토큰을 갱신해 1회 재시도한다(일반 API와 동일).

### 초기화

```ts
import { configureFileUploadClient } from '@/lib/api/fileUploadClient';

// useAuthInterceptor에서 apiClient와 동일한 getToken·onUnauthorized를 공유(single-flight)
configureFileUploadClient({
  getToken: getAccessToken,
  onUnauthorized,
});
```

### 파일 검증

```ts
import { validateFile } from '@/lib/api/fileUploadClient';

const error = validateFile(file, {
  maxSizeBytes:     10 * 1024 * 1024,         // 기본 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
});

if (error) {
  toast.show(error); // "파일 크기는 10MB 이하여야 합니다." 등
  return;
}
```

### 직접 업로드 (`features/shared/services/fileApi.ts`)

```ts
import { fileApi } from '@/features/shared/services/fileApi';

// 일반 파일 업로드
const result = await fileApi.upload(file, (percent) => {
  console.log(`${percent}% 완료`);
});
// returns: { fileId, url, mimeType, size }

// 이미지 업로드 (이미지 전용 엔드포인트)
const result = await fileApi.uploadImage(imageFile, setProgress);

// 파일 삭제
await fileApi.delete(fileId);

// 다운로드 URL 발급 (서명 URL, 만료 시간 있음)
const { url, expiresIn } = await fileApi.getDownloadUrl(fileId);
```

### useFileUpload 훅 (`features/shared/hooks/useFileUpload.ts`)

React Query `useMutation` 기반 업로드 훅입니다.

```ts
import { useFileUpload } from '@/features/shared/hooks/useFileUpload';

function ImageUploadButton() {
  const { mutate: upload, progress, isPending } = useFileUpload('image');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      {isPending && <ProgressBar value={progress} />}
    </div>
  );
}
```

| 파라미터 | 값 | 설명 |
|---|---|---|
| `kind` | `'general'` | 일반 파일 업로드 (`/files/upload`) |
| `kind` | `'image'` | 이미지 업로드 (`/files/image`) |

반환값은 `useMutation` 반환값 + `progress: number` (0~100)입니다.
