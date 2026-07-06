'use client';
import { useDonationList } from './hooks/useDonationList';
import { DonationListView } from './components/DonationListView/DonationListView';
export default function DonationListPage() { const { donations, isLoading } = useDonationList(); return <DonationListView donations={donations} isLoading={isLoading} />; }
