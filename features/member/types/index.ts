export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface MemberListParams {
  page?: number;
  size?: number;
  status?: Member['status'];
  keyword?: string;
}

export interface CreateMemberRequest {
  name: string;
  email: string;
  role: Member['role'];
}

export interface UpdateMemberRequest {
  name?: string;
  role?: Member['role'];
  status?: Member['status'];
}

/** GET /members/server-time 응답 타입. 백엔드 ServerTimeResponse 스키마와 1:1 대응. */
export interface ServerTimeResponse {
  year:   number;
  month:  number;
  day:    number;
  hour:   number;
  minute: number;
  second: number;
}
export interface Affiliate { id: string; name: string; logoUrl?: string; isConnected: boolean; }
export interface Club      { id: string; name: string; benefit: string; isJoined: boolean; isSubscribed?: boolean; }
