'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@/shared/components/ui/icons';
import { ReactionButtons } from '@/features/reactions';
import { CommentSection } from '@/features/comments';
import { BookmarkButton } from '@/features/saved-recipes';
import { useSession } from '@/shared/session';
import { useRecipeDetail } from '../hooks/useRecipeDetail';
import { useRecipeComments } from '../hooks/useRecipeComments';
import { RecipeDetailHeader } from './RecipeDetailHeader';
import { RecipeCookingMeta } from './RecipeCookingMeta';
import { RecipeStory } from './RecipeStory';
import { IngredientChecklist } from './IngredientChecklist';
import { PreparationSteps } from './PreparationSteps';
import { RecipeSourceNote } from './RecipeSourceNote';
import { RecipeReviewNotice } from './RecipeReviewNotice';

interface RecipeDetailScreenProps {
  recipeId: string;
}

export function RecipeDetailScreen({
  recipeId,
}: RecipeDetailScreenProps): React.JSX.Element {
  const { recipe, isLoading, error } = useRecipeDetail(recipeId);
  const { comments, isLoaded: commentsLoaded } = useRecipeComments(recipeId);
  const { user } = useSession();

  if (isLoading) {
    return (
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Cargando receta...
      </p>
    );
  }

  if (error || !recipe) {
    return (
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {error ?? 'Receta no encontrada.'}
      </p>
    );
  }

  return (
    <article className="space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Volver al recetario
        </Link>
      </div>

      <RecipeReviewNotice status={recipe.status} reviewNotes={recipe.reviewNotes} />

      <RecipeDetailHeader recipe={recipe} />

      <RecipeCookingMeta
        prepTimeMinutes={recipe.prepTimeMinutes}
        cookTimeMinutes={recipe.cookTimeMinutes}
        servings={recipe.servings}
        difficulty={recipe.difficulty}
      />

      <RecipeStory description={recipe.description} />

      <IngredientChecklist ingredients={recipe.ingredients} />

      <PreparationSteps steps={recipe.steps} />

      <RecipeSourceNote
        sourceType={recipe.sourceType}
        sourceName={recipe.sourceName}
        sourceUrl={recipe.sourceUrl}
      />

      <div className="flex justify-end gap-2">
        {user && (user.id === recipe.author.id || user.role === 'ADMIN') && (
          <Link
            href={`/recipe/${recipe.id}/edit`}
            className="inline-flex h-8 items-center rounded-md border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Editar receta
          </Link>
        )}
        <BookmarkButton recipeId={recipe.id} initialBookmarked={recipe.isBookmarked ?? false} />
      </div>

      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
        <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          ¿Has probado esta receta? Reacciona para la comunidad:
        </h3>
        <ReactionButtons
          recipeId={recipe.id}
          initialStats={recipe.reactionCounts}
          initialUserReaction={recipe.userReaction}
        />
      </div>

      {commentsLoaded && (
        <CommentSection recipeId={recipe.id} initialComments={comments} />
      )}
    </article>
  );
}
