import type { MemberListParams } from '../types';

export const memberKeys = {
  all: ['member'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (params?: MemberListParams) => [...memberKeys.lists(), params] as const,
  details: () => [...memberKeys.all, 'detail'] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
};
