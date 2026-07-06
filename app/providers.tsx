'use client';
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { useToastStore } from '@/hooks/useToastStore';
import { fallbackMessages } from '@/lib/utils/errorMessages';
import { ApiError } from '@/types/api';
import { ToastContainer } from '@/components/common/ui/overlay/Toast';

export function Providers({ children, nonce: _nonce }: { children: ReactNode; nonce?: string }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { staleTime: 0, gcTime: 5 * 60_000, retry: 1 },
      },
      queryCache: new QueryCache({
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.status >= 500) {
              useToastStore.getState().addToast(fallbackMessages.server, 'error');
              console.error('[ApiError]', {
                api_status: String(error.status),
                api_code: error.code ?? 'unknown',
                error,
              });
            }
            // 4xx는 개별 화면에서 처리 - 전역 전송 불필요
          } else {
            // ApiError 외 예상치 못한 에러
            console.error('[UnexpectedError]', error);
          }
        },
      }),
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 전역 토스트 렌더러 — useToastStore.addToast(...) 노출용 (앱 셸에 1회 마운트) */}
      <ToastContainer />
    </QueryClientProvider>
  );
}
