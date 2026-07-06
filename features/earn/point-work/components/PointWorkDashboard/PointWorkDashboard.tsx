/** [퍼블리셔] 걷기 대시보드 */
export function PointWorkDashboard({ steps, goalSteps, todayPoint }: { steps: number; goalSteps: number; todayPoint: number }) {
  return <div className="bg-blue-50 rounded-2xl p-6 text-center"><p className="text-5xl font-bold text-blue-600">{steps.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">/{goalSteps.toLocaleString()} 걸음 · 오늘 +{todayPoint}P</p></div>;
}
