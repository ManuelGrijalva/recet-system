import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon, EmojiHappyIcon, ThumbUpIcon } from '@/shared/components/ui/icons';
import { ShareRecipeButton } from '@/features/recipe-share';
import type { ReactionCounts } from '@/shared/types';

interface RecipeCardActionsProps {
  recipeId: string;
  title: string;
  reactionCounts: ReactionCounts;
}

function Stat({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}): React.JSX.Element {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300">
      {icon}
      <span>{label}</span>
    </span>
  );
}

/**
 * Resumen de interacción en la tarjeta del feed. Es de solo lectura: la
 * reacción real vive en la página de detalle (slice `reactions`). Al tocar la
 * tarjeta se navega al detalle.
 */
export function RecipeCardActions({
  recipeId,
  title,
  reactionCounts,
}: RecipeCardActionsProps): React.JSX.Element {
  return (
    <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
      <Link
        href={`/recipe/${recipeId}`}
        className="flex items-center gap-1 sm:gap-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors"
        aria-label="Ver receta y reaccionar"
      >
        <Stat icon={<ThumbUpIcon />} label={`Me gusta (${reactionCounts.like})`} />
        <Stat icon={<EmojiHappyIcon />} label={`Delicioso (${reactionCounts.yummy})`} />
        <Stat icon={<CheckCircleIcon />} label={`La preparé (${reactionCounts.triedIt})`} />
      </Link>

      <ShareRecipeButton recipeId={recipeId} title={title} />
    </div>
  );
}
