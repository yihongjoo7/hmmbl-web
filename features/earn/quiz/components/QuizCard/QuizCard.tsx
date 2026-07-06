/** [퍼블리셔] 퀴즈 카드 */
interface QuizCardProps { title: string; reward: number; onClick?: () => void; }
export function QuizCard({ title, reward, onClick }: QuizCardProps) {
  return <div onClick={onClick} className="p-4 border rounded-xl cursor-pointer flex justify-between"><span className="text-sm font-medium">{title}</span><span className="text-xs text-blue-600 font-bold">+{reward}P</span></div>;
}
