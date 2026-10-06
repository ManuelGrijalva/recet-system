import type {
  AuthorSummary,
  Difficulty,
  ReactionCounts,
  RecipeStatus,
} from '@/shared/types';

export interface PendingRecipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  coverImageUrl: string | null;
  originRegion: string;
  status: RecipeStatus;
  reviewNotes?: string | null;
  createdAt: string;
  author: AuthorSummary;
  reactionCounts: ReactionCounts;
  commentsCount: number;
}

export type ReviewDecision =
  | { decision: 'APPROVE' }
  | { decision: 'RETURN'; notes: string };
