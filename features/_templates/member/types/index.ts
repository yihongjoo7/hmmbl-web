export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

// apiClient.get(params)의 매개변수 타입이 Record<string, unknown>이므로
// interface 대신 type 별칭을 사용한다(암묵적 인덱스 시그니처 확보).
export type MemberListParams = {
  page?: number;
  size?: number;
  status?: Member['status'];
  keyword?: string;
};

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
