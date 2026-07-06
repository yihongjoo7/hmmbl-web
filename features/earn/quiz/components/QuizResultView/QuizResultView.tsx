/** [퍼블리셔] 퀴즈 결과 (정답·오답) */
export function QuizResultView({ isCorrect, answer, reward }: { isCorrect: boolean; answer: string; reward?: number }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className={`text-6xl ${isCorrect ? 'text-green-500' : 'text-red-400'}`}>{isCorrect ? '🎉' : '😢'}</div>
      <h2 className="text-xl font-bold">{isCorrect ? '정답입니다!' : '오답입니다'}</h2>
      <p className="text-sm text-gray-500">정답: {answer}</p>
      {isCorrect && reward && <p className="text-blue-600 font-bold">+{reward}P 적립!</p>}
    </div>
  );
}
