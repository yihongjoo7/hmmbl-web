// features/earn/example/services/exampleApi.ts
import { apiClient } from '@/lib/api/apiClient';
import type { ApiListResponse } from '@/types/api';
import type { ExampleItem } from '../types';

// TODO(백엔드 준비되면 삭제): /earn/examples 목업 응답
// 실제 apiClient.get() 대신 Promise.resolve()로 동일한 응답 형태를 흉내낸다.
function mockGetList(): Promise<ApiListResponse<ExampleItem>> {
  return Promise.resolve({
    data: [
      { id: '1', title: '목업 아이템 1' },
      { id: '2', title: '목업 아이템 2' },
      { id: '3', title: '목업 아이템 3' },
    ],
    total: 3,
    page: 1,
    size: 20,
  });
}

export const exampleApi = {
  getList: () => mockGetList(),
  //getList: () => apiClient.get<ApiListResponse<ExampleItem>>('/earn/examples'),
};

