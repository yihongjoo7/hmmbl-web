/**
 * features/auth/services/authApi.ts
 *
 * 인증 관련 REST API 호출 모음
 */

import { apiClient } from '@/lib/api/apiClient';
import { createDPoPProof } from '@/lib/auth/dpop/proofGenerator';
import { toApiError } from '@/lib/api/parseApiError';
import type { User } from '@/features/auth/types';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface LoginResult {
  accessToken:  string;
  expiresIn?:   number;
  user:         User;
}

export const authApi = {
  /**
   * 이메일/비밀번호로 로그인한다. 토큰 발급 엔드포인트라 apiClient(토큰 게이팅)를
   * 거치지 않고 DPoP proof를 항상 첨부해 직접 호출한다(POST /auth/login, refresh
   * 토큰은 httpOnly 쿠키로 수신 — `credentials:'include'`).
   */
  login: async (email: string, password: string): Promise<LoginResult> => {
    const proof = await createDPoPProof(`${baseUrl}/auth/login`, 'POST');

    const res = await fetch(`${baseUrl}/auth/login`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json', DPoP: proof },
      body:        JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      throw await toApiError(res, 'LOGIN_FAILED');
    }

    const data = (await res.json()) as {
      access_token: string;
      expires_in?:  number;
      user:         User;
    };

    return { accessToken: data.access_token, expiresIn: data.expires_in, user: data.user };
  },

  /**
   * 서버에 로그아웃을 알리고 서버 세션을 만료시킨다.
   * 클라이언트 측 상태 초기화는 useAuth.ts의 logout()이 담당.
   */
  logout: () =>
    apiClient.post<{ message: string }>('/auth/logout'),
};
