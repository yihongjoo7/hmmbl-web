/** [퍼블리셔] 퀴즈 목록 화면 레이아웃 */
export function QuizListView({ quizzes = [], isLoading }: { quizzes?: unknown[]; isLoading?: boolean }) {
  if (isLoading) return <div className="p-6 animate-pulse">로딩 중...</div>;
  return <div className="p-4">{quizzes.length === 0 && <p className="text-gray-400 text-sm text-center">참여 가능한 퀴즈가 없습니다.</p>}</div>;
}
