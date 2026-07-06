'use client';
/** [개발자] AI 챗봇 Container */
import { useChatbot } from './hooks/useChatbot';
import { ChatbotView } from './components/ChatbotView/ChatbotView';

export default function ChatbotPage() {
  const { messages, send, isLoading } = useChatbot();
  return <ChatbotView messages={messages} onSend={send} isLoading={isLoading} />;
}
