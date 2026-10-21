import React from 'react';
import Link from 'next/link';
import { RecipeCardAuthor } from './RecipeCardAuthor';
import { RecipeMetaTags } from './RecipeMetaTags';
import { RecipeCardActions } from './RecipeCardActions';
import type { ReactionType } from '@/features/reactions';
import type { FeedRecipe } from '../types';

interface RecipeCardProps {
  recipe: FeedRecipe;
  // Reaccion propia, si el usuario tiene sesion
  userReaction?: ReactionType | null;
}

export function RecipeCard({ recipe, userReaction = null }: RecipeCardProps): React.JSX.Element {
  const totalTimeMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <RecipeCardAuthor author={recipe.author} originRegion={recipe.originRegion} />

      {recipe.coverImageUrl && (
        <Link href={`/recipe/${recipe.id}`} className="block mb-3">
          <img
            src={recipe.coverImageUrl}
            alt={recipe.title}
            loading="lazy"
            className="w-full aspect-[16/10] object-cover border-y border-zinc-200 dark:border-zinc-800"
          />
        </Link>
      )}

      <div className="px-4 pb-3">
        <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-1.5">
          <Link href={`/recipe/${recipe.id}`} className="hover:underline">
            {recipe.title}
          </Link>
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
          {recipe.description}
        </p>
        <RecipeMetaTags
          totalTimeMinutes={totalTimeMinutes}
          servings={recipe.servings}
          difficulty={recipe.difficulty}
        />
      </div>

      <RecipeCardActions
        recipeId={recipe.id}
        title={recipe.title}
        reactionCounts={recipe.reactionCounts}
        commentsCount={recipe.commentsCount}
        userReaction={userReaction}
      />
    </article>
  );
}
