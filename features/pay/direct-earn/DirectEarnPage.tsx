'use client';
import { useDirectEarn } from './hooks/useDirectEarn';
import { DirectEarnView } from './components/DirectEarnView/DirectEarnView';
export default function DirectEarnPage() { const { submit, isLoading } = useDirectEarn(); return <DirectEarnView onSubmit={(type, data) => submit({ type, payload: data })} isLoading={isLoading} />; }
