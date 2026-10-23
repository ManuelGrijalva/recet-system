import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/shared/components/ui/Avatar';
import { RecipeCoverPlaceholder } from '@/shared/components/ui/RecipeCoverPlaceholder';
import { RecipeGallery } from './RecipeGallery';
import type { RecipeDetail } from '../types';

interface RecipeDetailHeaderProps {
  recipe: RecipeDetail;
}

export function RecipeDetailHeader({
  recipe,
}: RecipeDetailHeaderProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{recipe.originRegion}</span>
        <span>•</span>
        <span>Tradición viva</span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
        {recipe.title}
      </h1>

      <Link href={`/user/${recipe.author.id}`} className="flex items-center gap-3 pt-1 group w-fit">
        <Avatar
          src={recipe.author.avatarUrl}
          alt={recipe.author.name}
          fallbackName={recipe.author.name}
          size="md"
        />
        <div>
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline">
            {recipe.author.name}
          </p>
          {recipe.author.role && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {recipe.author.role}
            </p>
          )}
        </div>
      </Link>

      {recipe.coverImageUrl ? (
        <RecipeGallery
          title={recipe.title}
          images={[recipe.coverImageUrl, ...(recipe.galleryImageUrls ?? [])]}
          coverCredit={recipe.coverImageCredit}
          coverCreditUrl={recipe.coverImageCreditUrl}
        />
      ) : (
        <RecipeCoverPlaceholder
          title={recipe.title}
          className="w-full aspect-[16/7] rounded-lg border border-zinc-200 dark:border-zinc-800 mt-2"
        />
      )}
    </div>
  );
}
