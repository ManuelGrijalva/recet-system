'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@/shared/components/ui/icons';
import { ReactionButtons } from '@/features/reactions';
import { CommentSection } from '@/features/comments';
import { BookmarkButton } from '@/features/saved-recipes';
import { RecipePdfButton } from '@/features/recipe-export';
import { ShareRecipeButton } from '@/features/recipe-share';
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
import { AdminDeleteRecipeButton } from './AdminDeleteRecipeButton';
import { RelatedRecipes } from './RelatedRecipes';
import { Skeleton, SkeletonList, LoadingRegion } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';

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
      <LoadingRegion label="Cargando receta" className="space-y-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
        <SkeletonList rows={4} />
      </LoadingRegion>
    );
  }

  if (error || !recipe) {
    return (
      <EmptyState
        title="No encontramos esta receta"
        description={
          !error || /no encontrada/i.test(error)
            ? 'Puede que la hayan retirado o que el enlace esté incompleto.'
            : error
        }
        action={{ href: '/', label: 'Volver al recetario' }}
      />
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

      {/* En el celular las acciones principales quedan fijas sobre la barra inferior mientras se lee la receta */}
      <div className="sticky bottom-[4.5rem] z-30 flex flex-wrap items-center justify-end gap-2 rounded-lg border border-zinc-200 bg-white/95 p-2 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-[#1c1712]/95 md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
        <ShareRecipeButton recipeId={recipe.id} title={recipe.title} variant="button" />
        <RecipePdfButton recipeId={recipe.id} />
        <BookmarkButton recipeId={recipe.id} initialBookmarked={recipe.isBookmarked ?? false} />
      </div>

      {user && (user.id === recipe.author.id || user.role === 'ADMIN') && (
        <div className="flex flex-wrap justify-end gap-2">
          {user.role === 'ADMIN' && user.id !== recipe.author.id && (
            <AdminDeleteRecipeButton recipeId={recipe.id} />
          )}
          {user.id === recipe.author.id && (
            <Link
              href={`/recipe/${recipe.id}/edit`}
              className="inline-flex h-8 items-center rounded-md border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Editar receta
            </Link>
          )}
        </div>
      )}

      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1712]">
        <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          ¿Has probado esta receta? Reacciona para la comunidad:
        </h3>
        <ReactionButtons
          recipeId={recipe.id}
          initialStats={recipe.reactionCounts}
          initialUserReaction={recipe.userReaction}
        />
      </div>

      <RelatedRecipes recipeId={recipe.id} region={recipe.originRegion} />

      {commentsLoaded && (
        <CommentSection recipeId={recipe.id} initialComments={comments} />
      )}
    </article>
  );
}
