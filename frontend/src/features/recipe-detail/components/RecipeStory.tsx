import React from 'react';

interface RecipeStoryProps {
  description: string;
}

export function RecipeStory({ description }: RecipeStoryProps): React.JSX.Element {
  return (
    <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
      <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
        Reseña e historia
      </h2>
      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
