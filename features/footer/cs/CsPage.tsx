'use client';
import { useCs } from '../hooks/useCs';
import { CsView } from '../components/CsView/CsView';
export default function CsPage() { const { faqs, isLoading } = useCs(); return <CsView faqs={faqs} isLoading={isLoading} />; }
