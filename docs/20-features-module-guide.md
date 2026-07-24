# features 모듈 구조 및 shared 컴포넌트

> 대상: 개발자  
> features/ 폴더 구조 규칙, features/shared/ 컴포넌트 전체 목록, 공통 훅을 다룹니다.

---

## 1. features 폴더 구조 규칙

각 도메인은 아래 구조를 따릅니다.

```
features/[domain]/
├── [screen]/
│   ├── [ScreenName]Page.tsx        # 데이터 페칭 컨테이너 (개발자)
│   ├── [ScreenName]View.tsx        # UI 표현층 (퍼블리셔)
│   └── components/                 # 해당 화면 전용 서브컴포넌트
│       └── [SubComponent].tsx
├── services/
│   └── [domain]Api.ts              # apiClient 래퍼 (API 호출 함수 모음)
├── hooks/
│   └── use[Feature].ts             # 화면·기능 전용 훅
└── types/
    └── index.ts                    # 도메인 타입 (API 응답, 엔티티 등)
```

### 도메인 목록

| 폴더 | 도메인 | IA 섹션 |
|---|---|---|
| `features/auth/` | 인증 | common |
| `features/intro/` | 온보딩 | common |
| `features/main/` | 메인 홈·알림·검색 | main |
| `features/member/` | 회원가입·계정 | member |
| `features/earn/` | 적립 | earn |
| `features/use/` | 사용 | use |
| `features/pay/` | 결제 | pay |
| `features/my/` | 마이페이지 | my |
| `features/settings/` | 설정 | settings |
| `features/footer/` | 고객센터·공지 | footer |
| `features/menu/` | 레거시 메뉴 | (IA 미등록, `23-ia-navigator.md` 3장 참고) |
| `features/search/` | 통합검색 | main(통합검색) |
| `features/video/` | 동영상 진행률 추적 훅·타입 | — (여러 도메인에서 공용) |
| `features/shared/` | **도메인 공통** | — |
| `features/_templates/` | **신규 도메인 스캐폴딩 템플릿**(`ExamplePage.tsx`/`ExampleView.tsx` 등) — 실제 도메인 아님 | — |

---

## 2. 도메인 간 코드 공유 원칙

| 상황 | 위치 |
|---|---|
| 비즈니스 컨텍스트 없는 순수 UI 컴포넌트 | `components/common/ui/` |
| 여러 도메인에서 쓰이는 비즈니스 컴포넌트·훅·서비스 | `features/shared/` |
| 특정 도메인 내에서만 쓰이는 컴포넌트 | 해당 `features/[domain]/[screen]/components/` |

도메인 간 직접 import는 금지합니다.  
`features/earn/`에서 `features/my/`를 import하지 않습니다.  
공유가 필요하면 `features/shared/`로 이동합니다.

---

## 3. features/shared/components/ 목록

### 앱 상태 관련

| 컴포넌트 | 역할 |
|---|---|
| `AppUpdateGuide` | 앱 업데이트 안내 UI (강제/선택적 업데이트). `useAppUpdate` 훅과 함께 사용 |
| `NetworkStatus` | 네트워크 연결 상태 감지 및 오프라인 안내 |
| `ServiceInspection` | 서비스 점검 중 안내 페이지 |

### 가이드 / 에러

| 컴포넌트 | 역할 |
|---|---|
| `ErrorPage` | API 에러·네트워크 에러 등 전체 화면 에러 UI |
| `LoginRequiredGuide` | 비로그인 상태 접근 시 로그인 유도 UI |

### 미디어

| 컴포넌트 | 역할 |
|---|---|
| `AudioPlayer` | 오디오 재생 UI (재생/일시정지/탐색) |
| `ImageAttachment` | 이미지 첨부 미리보기 + 삭제 UI |
| `ImagePicker` | 카메라/갤러리 선택 바텀시트 + `useCameraCapture` 연동 |
| `MapView` | 지도 뷰 (제휴처 지도 등에서 사용) |
| `CopyButton` | 클립보드 복사 버튼. `useCopyToClipboard` 훅 래퍼 |

### 팝업 / 모달

| 컴포넌트 | 역할 |
|---|---|
| `AdRewardPopup` | 광고 리워드 팝업 |
| `AffiliatePopup` | 제휴처 상세 팝업 |
| `DonationCompletePopup` | 기부 완료 팝업 |
| `FriendListPopup` | 친구 목록 팝업 |
| `PayConfirmPopup` | 결제 확인 팝업 |
| `PushPermissionPopup` | 푸시 알림 권한 요청 팝업 |
| `RewardPopup` | 리워드 지급 팝업 |
| `SystemAlert` | `useSystemAlert` Store 기반 전역 Alert/Confirm 다이얼로그 |

### 커뮤니티

| 컴포넌트 | 역할 |
|---|---|
| `Comment` | 댓글 단일 아이템 (작성자·내용·액션) |
| `CommentThread` | 댓글 스레드 (목록 + 더보기 + 입력 폼) |
| `Report` | 신고 모달 (댓글·콘텐츠 신고) |

---

## 4. features/shared/hooks/ 목록

### 미디어·하드웨어 훅

**`useCameraCapture()`**

카메라/갤러리에서 이미지를 캡처해 `File` 객체로 반환합니다(`<input type="file">` 기반).

```ts
const { capture, isCapturing, error } = useCameraCapture();

// 카메라 촬영 (capture=environment 힌트)
const file = await capture('camera');

// 갤러리 선택
const file = await capture('gallery');
```

**`useLocation()`**

GPS 위치 요청 훅입니다. `navigator.geolocation` 기반입니다.

```ts
const { location, isLoading, error, requestLocation } = useLocation();

await requestLocation();
// location: { latitude, longitude, accuracy } | null
```

### UI 인터랙션 훅

**`useHaptic()`**

햅틱 피드백 훅입니다. `navigator.vibrate` 기반입니다(미지원 브라우저에서는 무동작).

```ts
const { trigger, light, medium, heavy } = useHaptic();

light();   // 10ms — 탭, 선택
medium();  // 25ms — 성공, 완료
heavy();   // 50ms — 에러, 삭제 확인
```

**`useCopyToClipboard()`**

클립보드 복사 훅입니다.  
`navigator.clipboard` → `execCommand` 순서로 폴백합니다.  
성공 시 햅틱 피드백(light)이 자동 실행됩니다.

```ts
const { copy, isCopied, error } = useCopyToClipboard();

await copy('복사할 텍스트');
// isCopied: true (2초 후 자동 false)
```

### 파일 업로드 훅

**`useFileUpload(kind)`** — 자세한 내용은 `06-api-client.md` 참고

```ts
const { mutate: upload, progress, isPending } = useFileUpload('image');
```

---

## 5. features/shared/services/fileApi.ts

파일 관련 API 서비스입니다.  
`lib/api/fileUploadClient`와 `apiClient`를 조합해 features 레이어에서 사용하기 편리한 인터페이스를 제공합니다.

```ts
import { fileApi } from '@/features/shared/services/fileApi';

await fileApi.upload(file, onProgress);
await fileApi.uploadImage(file, onProgress);
await fileApi.delete(fileId);
const { url, expiresIn } = await fileApi.getDownloadUrl(fileId);
```

---

## 6. Page 컴포넌트 작성 패턴

```tsx
// features/earn/mission/MissionPage.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MissionView }  from './MissionView';
import { missionApi }   from './services/missionApi';

export function MissionPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['earn', 'mission', id],
    queryFn:  () => missionApi.getDetail(id),
  });

  return (
    <MissionView
      mission={data?.data}
      isLoading={isLoading}
      errorMessage={error ? '미션 정보를 불러오지 못했습니다.' : undefined}
    />
  );
}
```

---

## 7. 신규 도메인 추가 절차

1. `features/[newDomain]/` 폴더 생성
2. `types/index.ts` 작성 (API 응답 타입)
3. `services/[newDomain]Api.ts` 작성 (apiClient 래퍼)
4. 화면별 `[Screen]Page.tsx` + `[Screen]View.tsx` 작성
5. `app/(protected)/[newDomain]/page.tsx` 라우트 파일 생성
6. `app/dev/ia/_data/ia.ts`에 IA 항목 추가
