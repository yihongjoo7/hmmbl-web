'use client';
/**
 * [개발자] 홈 메인 Container
 * useHome 훅에서 데이터를 받아 MainView에 주입합니다.
 */
import { useHome } from './hooks/useHome';
import { MainView } from './components/MainView/MainView';

export default function MainPage() {
  const { banners, isLoading } = useHome();
  return <MainView banners={banners} isLoading={isLoading} />;
}
