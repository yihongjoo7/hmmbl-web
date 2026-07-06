'use client';
import { AppVersionView } from './components/AppVersionView/AppVersionView';
export default function AppVersionPage() { return <AppVersionView version={process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0'} />; }
