'use client';

import { useState } from 'react';
import { useAuthStore, getAccessToken } from '@/features/auth/hooks/useAuthStore';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { createDPoPProof } from '@/lib/auth/dpop/proofGenerator';
import { config } from '@/lib/config';
import type { AuthResponse } from '@/features/auth/types';

export default function AuthDevPage() {
  const user            = useAuthStore((s) => s.user);
  const setAuth         = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { logout }      = useAuth();

  const [refreshStatus, setRefreshStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [logoutStatus,  setLogoutStatus]  = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg,      setErrorMsg]      = useState('');

  const handleRefresh = async () => {
    setRefreshStatus('loading');
    setErrorMsg('');
    try {
      const baseUrl = config.apiBaseUrl;
      const proof   = await createDPoPProof(`${baseUrl}/auth/refresh`, 'POST');
      const res     = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', DPoP: proof },
        cache: 'no-store',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data: AuthResponse = await res.json();
      setAuth(data.user, data.accessToken);
      setRefreshStatus('ok');
    } catch (e) {
      setErrorMsg((e as Error).message);
      setRefreshStatus('error');
    }
  };

  const handleLogout = async () => {
    setLogoutStatus('loading');
    setErrorMsg('');
    try {
      await logout();
      setLogoutStatus('ok');
    } catch (e) {
      setErrorMsg((e as Error).message);
      setLogoutStatus('error');
    }
  };

  const accessToken = getAccessToken();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">인증 디버그</h1>
        <p className="text-sm text-gray-500">토큰 상태, DPoP 키쌍, 사용자 정보를 확인합니다.</p>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
        <h2 className="text-base font-bold text-gray-800">로그인 상태</h2>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={`text-sm font-medium ${isAuthenticated ? 'text-green-700' : 'text-gray-500'}`}>
            {isAuthenticated ? '로그인됨' : '미로그인'}
          </span>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
        <h2 className="text-base font-bold text-gray-800">사용자 정보</h2>
        {isAuthenticated && user ? (
          <table className="text-sm w-full">
            <tbody>
              {([
                ['ID', user.id], ['이름', user.name], ['이메일', user.email], ['역할', user.role],
                ['프로필 이미지', user.profileImage || '(없음)'],
              ] as [string, string][]).map(([label, value]) => (
                <tr key={label} className="border-b border-gray-100 last:border-0">
                  <td className="py-1.5 pr-4 text-gray-500 w-28 shrink-0">{label}</td>
                  <td className="py-1.5 text-gray-900 break-all">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">사용자 정보 없음</p>
        )}
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
        <h2 className="text-base font-bold text-gray-800">Access Token</h2>
        {accessToken
          ? <p className="text-xs text-gray-600 font-mono break-all bg-gray-50 rounded p-3">{accessToken}</p>
          : <p className="text-sm text-gray-400">토큰 없음</p>}
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-800">액션</h2>
        {errorMsg && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{errorMsg}</p>}
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleRefresh} disabled={refreshStatus === 'loading'}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {refreshStatus === 'loading' ? '갱신 중…' : '🔄 Refresh'}
          </button>
          <button onClick={handleLogout} disabled={logoutStatus === 'loading' || !isAuthenticated}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors">
            {logoutStatus === 'loading' ? '로그아웃 중…' : '🚪 Logout'}
          </button>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          {refreshStatus !== 'idle' && (
            <span className={refreshStatus === 'ok' ? 'text-green-600' : refreshStatus === 'error' ? 'text-red-500' : ''}>
              Refresh: {refreshStatus === 'ok' ? '성공' : refreshStatus === 'error' ? '실패' : '처리 중'}
            </span>
          )}
          {logoutStatus !== 'idle' && (
            <span className={logoutStatus === 'ok' ? 'text-green-600' : logoutStatus === 'error' ? 'text-red-500' : ''}>
              Logout: {logoutStatus === 'ok' ? '성공' : logoutStatus === 'error' ? '실패' : '처리 중'}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
