'use client';
import { useSecuritySettings } from './hooks/useSecuritySettings';
import { SecurityView } from './components/SecurityView/SecurityView';
export default function SecurityPage() { const { settings, isLoading, toggleBiometric } = useSecuritySettings(); return <SecurityView settings={settings} isLoading={isLoading} onToggleBiometric={toggleBiometric} />; }
