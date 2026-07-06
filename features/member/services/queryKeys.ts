import type { MemberListParams } from '../types';

export const memberKeys = {
  all: ['member'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (params?: MemberListParams) => [...memberKeys.lists(), params] as const,
  details: () => [...memberKeys.all, 'detail'] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
};
export const memberQueryKeys = {
  all:                () => ['member'] as const,
  affiliates:         () => [...memberQueryKeys.all(), 'affiliates'] as const,
  clubs:              () => [...memberQueryKeys.all(), 'clubs'] as const,
  clubSubscription:   (id: string) => [...memberQueryKeys.all(), 'clubs', id, 'subscription'] as const,
};
