/** [퍼블리셔] AI 챗봇 대화 화면 */
interface Message { id: string; role: 'user' | 'bot'; content: string; }
interface ChatbotViewProps { messages: Message[]; onSend: (text: string) => void; isLoading?: boolean; }

export function ChatbotView({ messages, onSend, isLoading }: ChatbotViewProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'self-end bg-blue-600 text-white' : 'self-start bg-gray-100 text-gray-800'}`}>
            {m.content}
          </div>
        ))}
        {isLoading && <div className="self-start bg-gray-100 px-4 py-2 rounded-2xl text-sm text-gray-400">답변 중...</div>}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input className="flex-1 px-4 py-2 border rounded-xl text-sm" placeholder="메시지를 입력하세요"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { onSend((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ''; }}} />
      </div>
    </div>
  );
}
