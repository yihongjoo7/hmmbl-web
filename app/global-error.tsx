'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px', textAlign: 'center', padding: '32px' }}>
          <p style={{ color: '#4b5563' }}>일시적인 오류가 발생했습니다.</p>
          <button
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}
            onClick={reset}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
