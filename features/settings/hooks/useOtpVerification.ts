'use client';
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

interface OtpState { isRequested: boolean; expiresAt: number | null; }

export function useOtpVerification() {
  const [state, setState] = useState<OtpState>({ isRequested: false, expiresAt: null });

  const { mutate: requestOtp, isPending: isRequesting } = useMutation({
    mutationFn: (phone: string) => apiClient.post<{ expiresIn: number }>('/auth/otp/request', { phone }),
    onSuccess: (data) => setState({ isRequested: true, expiresAt: Date.now() + data.expiresIn * 1000 }),
  });

  const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) => apiClient.post('/auth/otp/verify', { phone, code }),
  });

  const reset = useCallback(() => setState({ isRequested: false, expiresAt: null }), []);

  const remainingSec = state.expiresAt ? Math.max(0, Math.floor((state.expiresAt - Date.now()) / 1000)) : 0;

  return { isRequested: state.isRequested, remainingSec, requestOtp, verifyOtp, reset, isRequesting, isVerifying };
}
