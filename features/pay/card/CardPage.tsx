'use client';
import { useCardList } from './hooks/useCardList';
import { CardView } from './components/CardView/CardView';
export default function CardPage() { const { cards, isLoading } = useCardList(); return <CardView cards={cards} isLoading={isLoading} />; }
