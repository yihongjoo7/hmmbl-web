/**
 * @deprecated [P2] 삭제 예정 — 빈 스텁, 역할 없음.
 *
 * 원래 의도: EC P-256 키쌍 생성·JWK 변환·저장
 * 실제 구현: proofGenerator.ts에 완전히 통합되어 있음
 *   - generateDPoPKeyPair()
 *   - getDPoPKeyPair()
 *   - getOrCreateKeyPair()
 *   - deleteDPoPKeyPair()
 *
 * 이 파일을 import하는 곳이 없으므로 안전하게 삭제 가능.
 * 삭제 전 `grep -r "lib/auth/dpop/keyPair" .` 로 미사용 확인 후 제거.
 */
export {};
