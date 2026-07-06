'use client';
import { useGiftSend } from './hooks/useGiftSend';
import { GiftView } from './components/GiftView/GiftView';
export default function GiftPage() { const { step, goNext, goPrev, submit, isLoading } = useGiftSend(); return <GiftView step={step} onNext={goNext} onPrev={goPrev} onSubmit={() => submit(undefined)} isLoading={isLoading} />; }
