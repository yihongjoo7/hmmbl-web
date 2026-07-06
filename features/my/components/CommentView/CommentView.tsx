/** [퍼블리셔] 댓글 레이아웃 */
interface Comment { id: string; contentTitle: string; text: string; createdAt: string; }
export function CommentView({ comments = [], isLoading }: { comments?: Comment[]; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return (
    <div className="flex flex-col divide-y">
      {comments.map(c => (
        <div key={c.id} className="px-4 py-4">
          <p className="text-xs text-blue-500">{c.contentTitle}</p>
          <p className="text-sm mt-1">{c.text}</p>
          <p className="text-xs text-gray-400 mt-1">{c.createdAt}</p>
        </div>
      ))}
      {comments.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">작성한 댓글이 없습니다.</p>}
    </div>
  );
}
