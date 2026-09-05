import type { ReactionCounts } from '@/shared/types';

export type ReactionType = 'LIKE' | 'YUMMY' | 'TRIED_IT';

/** Alias histórico; la forma canónica vive en `@/shared/types`. */
export type ReactionStats = ReactionCounts;

export interface ToggleReactionResponse {
  action: 'ADDED' | 'REMOVED' | 'SWITCHED';
  currentType: ReactionType | null;
}

export interface ReactionState {
  stats: ReactionCounts;
  userReaction: ReactionType | null;
}
