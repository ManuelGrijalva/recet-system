import React from 'react';
import Link from 'next/link';
import { RecipeCardAuthor } from './RecipeCardAuthor';
import { RecipeMetaTags } from './RecipeMetaTags';
import { RecipeCardActions } from './RecipeCardActions';
import type { FeedRecipe } from '../types';

interface RecipeCardProps {
  recipe: FeedRecipe;
}

export function RecipeCard({ recipe }: RecipeCardProps): React.JSX.Element {
  const totalTimeMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <RecipeCardAuthor author={recipe.author} originRegion={recipe.originRegion} />

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
        reactionCounts={recipe.reactionCounts}
      />
    </article>
  );
}
