/**
 * Tipos de dominio compartidos entre slices que hablan de recetas.
 * Cada slice extiende estos tipos con lo que necesita en su propio `types.ts`.
 */

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type RecipeStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'ARCHIVED';

export interface AuthorSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ReactionCounts {
  like: number;
  yummy: number;
  triedIt: number;
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: 'Fácil',
  MEDIUM: 'Media',
  HARD: 'Difícil',
};
