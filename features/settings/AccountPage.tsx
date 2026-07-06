'use client';
import { useAccountManagement } from './hooks/useAccountManagement';
import { AccountView } from './components/AccountView/AccountView';
export default function AccountPage() { const { accounts, isLoading, unlink, withdraw } = useAccountManagement(); return <AccountView accounts={accounts} isLoading={isLoading} onUnlink={unlink} onWithdraw={withdraw} />; }
