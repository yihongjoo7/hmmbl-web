'use client';
/**
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  [개발자 레퍼런스]  hooks/useExampleMutation.ts                  │
 * │                                                                  │
 * │  역할 : 쓰기 작업 (좋아요, 삭제, 제출 등) 처리                  │
 * │  사용처: ExampleDetailPage.tsx 또는 ExamplePage.tsx              │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * useMutation vs useQuery
 *   - 데이터 조회(GET)   → useQuery
 *   - 데이터 변경(POST/PUT/DELETE) → useMutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { exampleApi } from '../services/exampleApi';
import { exampleQueryKeys } from './useExampleList';

// ─────────────────────────────────────────────────────────────────────────────
// 좋아요 토글
// ─────────────────────────────────────────────────────────────────────────────

export function useExampleLike() {
  // queryClient: 뮤테이션 성공 후 캐시 무효화(invalidate)에 사용
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    // mutationFn: 실제 API 호출 함수. mutate(id) 호출 시 id 가 인자로 전달됨.
    mutationFn: (id: string) => exampleApi.like(id),

    // onSuccess: 요청 성공 시 실행
    // 성공 후 상세 캐시를 무효화 → 화면이 최신 데이터로 자동 갱신됨
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: exampleQueryKeys.detail(id) });
    },

    // onError: 요청 실패 시 실행
    // 토스트 메시지, 롤백 등 처리
    onError: (error) => {
      console.error('좋아요 실패:', error);
      // toast.error('좋아요 처리에 실패했습니다');
    },
  });

  return {
    like: mutate,       // like(id) 로 호출
    isLiking: isPending,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 삭제
// 서버 삭제 API 가 DELETE 가 아닌 POST 를 사용하는 경우 패턴:
//   POST /example/:id/delete  또는  POST /example/delete { id }
// ─────────────────────────────────────────────────────────────────────────────

export function useExampleDelete() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    // DELETE 메서드 대신 POST 로 삭제 요청
    // 예: POST /example/:id/delete
    mutationFn: (id: string) => exampleApi.deleteById(id),

    onSuccess: () => {
      // 목록 전체 캐시 무효화 (모든 필터 포함)
      queryClient.invalidateQueries({ queryKey: exampleQueryKeys.all });
    },
  });

  return {
    // mutateAsync: Promise 를 반환 → await 로 결과 처리 가능
    // 삭제 후 라우터 이동처럼 비동기 순서가 중요할 때 사용
    deleteItem: mutateAsync,
    isDeleting: isPending,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 폼 제출 (POST 요청 예시)
// ─────────────────────────────────────────────────────────────────────────────

interface SubmitPayload {
  title: string;
  content: string;
}

export function useExampleSubmit() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (payload: SubmitPayload) => exampleApi.create(payload),

    onSuccess: (newItem) => {
      // 전략 1: 캐시 무효화 (서버에서 최신 목록 재요청)
      queryClient.invalidateQueries({ queryKey: exampleQueryKeys.all });

      // 전략 2: 옵티미스틱 업데이트 (서버 재요청 없이 캐시 직접 수정)
      // 빠른 UI 응답이 필요할 때 전략 1 대신 사용
      // queryClient.setQueryData(exampleQueryKeys.list('all'), (old: any) => ({
      //   ...old,
      //   items: [newItem, ...(old?.items ?? [])],
      // }));
    },
  });

  return {
    submit: mutateAsync,
    isSubmitting: isPending,
    submitError: isError ? (error as Error).message : null,
  };
}
