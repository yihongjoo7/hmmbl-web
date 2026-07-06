'use client';
/**
 * 댓글·대댓글·신고·차단 공통 컴포넌트 (컬처 등에서 사용)
 */

interface Comment { id: string; author: string; content: string; createdAt: string; likeCount: number; replies?: Comment[]; }
interface CommentThreadProps { comments?: Comment[]; onLike?: (id: string) => void; onReport?: (id: string) => void; onReply?: (id: string) => void; onSubmit?: (content: string) => void; isLoading?: boolean; }

export function CommentThread({ comments = [], onLike, onReport, onReply, onSubmit, isLoading }: CommentThreadProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 작성 폼 */}
      <div className="flex gap-2 px-4 pt-2">
        <input className="flex-1 border rounded-xl px-3 py-2 text-sm" placeholder="댓글을 입력하세요"
          onKeyDown={e => { if (e.key === 'Enter') { onSubmit?.((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; }}} />
        <button className="text-blue-600 text-sm font-medium px-2">등록</button>
      </div>

      {isLoading && <div className="px-4 animate-pulse text-sm text-gray-400">불러오는 중...</div>}

      {/* 댓글 목록 */}
      <ul className="flex flex-col divide-y">
        {comments.map(c => (
          <li key={c.id} className="px-4 py-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-700">{c.author}</p>
                <p className="text-sm mt-1 text-gray-800 leading-relaxed">{c.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => onLike?.(c.id)} className="text-xs text-gray-400 hover:text-blue-500">❤ {c.likeCount}</button>
                  <button onClick={() => onReply?.(c.id)} className="text-xs text-gray-400 hover:text-blue-500">답글</button>
                  <span className="text-xs text-gray-300">{c.createdAt}</span>
                </div>
              </div>
              <button onClick={() => onReport?.(c.id)} className="text-xs text-gray-300 hover:text-red-400 shrink-0">신고</button>
            </div>

            {/* 대댓글 */}
            {c.replies && c.replies.length > 0 && (
              <ul className="ml-4 mt-3 flex flex-col gap-3 border-l-2 border-gray-100 pl-3">
                {c.replies.map(r => (
                  <li key={r.id}>
                    <p className="text-xs font-bold text-gray-700">{r.author}</p>
                    <p className="text-sm mt-0.5 text-gray-700">{r.content}</p>
                    <p className="text-xs text-gray-300 mt-1">{r.createdAt}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
