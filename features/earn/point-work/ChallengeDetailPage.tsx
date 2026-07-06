'use client';
import { useChallenge } from './hooks/useChallenge';
import { ChallengeDetailView } from './components/ChallengeDetailView/ChallengeDetailView';
export default function ChallengeDetailPage({ challengeId }: { challengeId: string }) {
  const { challenge, isLoading, join } = useChallenge(challengeId);
  return <ChallengeDetailView challenge={challenge} isLoading={isLoading} onJoin={join} />;
}
