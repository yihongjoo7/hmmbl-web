/** [퍼블리셔] 선물하기 화면 레이아웃 (3단계) */
interface GiftViewProps { step?: number; onNext?: () => void; onPrev?: () => void; onSubmit?: () => void; isLoading?: boolean; }
export function GiftView({ step = 1, onNext, onPrev, onSubmit, isLoading }: GiftViewProps) {
  const STEPS = ['상품 선택', '카드 꾸미기', '수신자 정보'];
  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <div className="flex gap-2">{STEPS.map((s, i) => <div key={i} className={`flex-1 h-1 rounded-full ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />)}</div>
      <h2 className="text-lg font-bold">{STEPS[step - 1]}</h2>
      <div className="min-h-40 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm">단계 {step} 콘텐츠 영역</div>
      <div className="fixed bottom-6 left-6 right-6 flex gap-3">
        {step > 1 && <button onClick={onPrev} className="flex-1 py-4 border border-blue-600 text-blue-600 rounded-xl font-bold">이전</button>}
        <button onClick={step === 3 ? onSubmit : onNext} disabled={isLoading}
          className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50">
          {step === 3 ? '선물하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
