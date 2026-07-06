'use client';
import { useLoginHistory } from './hooks/useLoginHistory';
import { LoginHistoryView } from './components/LoginHistoryView/LoginHistoryView';
export default function LoginHistoryPage() { const { history, isLoading } = useLoginHistory(); return <LoginHistoryView history={history} isLoading={isLoading} />; }
