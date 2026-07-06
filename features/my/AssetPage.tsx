'use client';
import { useAssetManagement } from './hooks/useAssetManagement';
import { AssetView } from './components/AssetView/AssetView';
export default function AssetPage() { const { asset, isLoading } = useAssetManagement(); return <AssetView asset={asset} isLoading={isLoading} />; }
