/**
 * DPoP 키 로테이션
 *
 * Native Bridge의 keyRotation 이벤트 수신 시 기존 키쌍을 폐기하고
 * 새 키쌍을 생성합니다. apiClient의 다음 요청 시 자동으로 새 키가 사용됩니다.
 */

import { deleteDPoPKeyPair, generateDPoPKeyPair } from './proofGenerator';

export async function rotateDPoPKey(): Promise<void> {
  await deleteDPoPKeyPair();
  await generateDPoPKeyPair();
}
