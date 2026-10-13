import type { RecipeStatus } from '@/shared/types';

export interface MyRecipe {
  id: string;
  title: string;
  originRegion: string;
  status: RecipeStatus;
  reviewNotes?: string | null;
  createdAt: string;
}
