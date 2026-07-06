// features/earn/example/ExamplePage.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { ExampleView } from './ExampleView';
import { exampleApi } from './services/exampleApi';

export function ExamplePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['earn', 'examples'],
    queryFn: () => exampleApi.getList(),
  });

  return (
    <ExampleView
      items={data?.data ?? []}
      isLoading={isLoading}
      errorMessage={error ? '목록을 불러오지 못했습니다.' : undefined}
    />
  );
}