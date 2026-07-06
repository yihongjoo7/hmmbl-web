'use client';
import { Button } from '@/components/common/ui/action/Button';
import { BubbleButton } from '@/components/common/ui/action/BubbleButton';

export default function ButtonDevPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold">Button</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-700">Variants</h2>
        <div className="flex gap-3 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-700">Sizes</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-700">States</h2>
        <div className="flex gap-3 flex-wrap">
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </section>

      {/* ── BubbleButton ─────────────────────────────── */}
      <h1 className="text-xl font-bold">BubbleButton</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-700">Tail Position</h2>
        <div className="flex gap-8 flex-wrap items-end">
          <BubbleButton tailPosition="top">Top</BubbleButton>
          <BubbleButton tailPosition="bottom">Bottom</BubbleButton>
          <BubbleButton tailPosition="left">Left</BubbleButton>
          <BubbleButton tailPosition="right">Right</BubbleButton>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-700">Variants</h2>
        <div className="flex gap-8 flex-wrap items-end">
          <BubbleButton variant="primary">Primary</BubbleButton>
          <BubbleButton variant="secondary">Secondary</BubbleButton>
          <BubbleButton variant="outline">Outline</BubbleButton>
          <BubbleButton variant="danger">Danger</BubbleButton>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-gray-700">Sizes</h2>
        <div className="flex gap-8 flex-wrap items-end">
          <BubbleButton size="sm">Small</BubbleButton>
          <BubbleButton size="md">Medium</BubbleButton>
          <BubbleButton size="lg">Large</BubbleButton>
        </div>
      </section>
    </div>
  );
}
