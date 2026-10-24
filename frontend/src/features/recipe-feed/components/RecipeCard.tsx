import React from 'react';
import Link from 'next/link';
import { RecipeCardAuthor } from './RecipeCardAuthor';
import { RecipeMetaTags } from './RecipeMetaTags';
import { RecipeCardActions } from './RecipeCardActions';
import { RecipeCoverPlaceholder } from '@/shared/components/ui/RecipeCoverPlaceholder';
import { PhotoCredit } from '@/shared/components/ui/PhotoCredit';
import type { ReactionType } from '@/features/reactions';
import type { FeedRecipe } from '../types';

interface RecipeCardProps {
  recipe: FeedRecipe;
  // Reaccion propia, si el usuario tiene sesion
  userReaction?: ReactionType | null;
  isBookmarked?: boolean;
}

export function RecipeCard({ recipe, userReaction = null, isBookmarked = false }: RecipeCardProps): React.JSX.Element {
  const totalTimeMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15110d] overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-700">
      <RecipeCardAuthor author={recipe.author} originRegion={recipe.originRegion} />

      <div className="relative mb-3">
        <Link href={`/recipe/${recipe.id}`} className="block">
          {recipe.coverImageUrl ? (
            <img
              src={recipe.coverImageUrl}
              alt={recipe.title}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover border-y border-zinc-200 dark:border-zinc-800"
            />
          ) : (
            <RecipeCoverPlaceholder
              title={recipe.title}
              className="w-full aspect-[16/7] border-y border-zinc-200 dark:border-zinc-800"
            />
          )}
        </Link>
        {recipe.coverImageUrl && (
          <PhotoCredit credit={recipe.coverImageCredit} url={recipe.coverImageCreditUrl} />
        )}
      </div>

      <div className="px-4 pb-3">
        <h2 className="font-serif text-lg font-semibold leading-snug text-zinc-950 dark:text-zinc-50 mb-1.5">
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
        isBookmarked={isBookmarked}
      />
    </article>
  );
}
