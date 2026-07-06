export default function BridgeIndexPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Bridge 테스트</h1>
      <p className="text-sm text-gray-500">
        좌측 사이드바에서 테스트할 항목을 선택하세요.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h2 className="font-semibold text-sm text-gray-700 mb-1">Native → Web</h2>
          <p className="text-xs text-gray-500">네이티브에서 웹뷰로 전달하는 이벤트 테스트</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <h2 className="font-semibold text-sm text-gray-700 mb-1">Web → Native</h2>
          <p className="text-xs text-gray-500">웹뷰에서 네이티브로 호출하는 메서드 테스트</p>
        </div>
      </div>
    </div>
  );
}
