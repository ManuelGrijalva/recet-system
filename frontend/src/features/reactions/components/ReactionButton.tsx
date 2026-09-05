import React from 'react';
import { cn } from '@/shared/lib/utils';

interface ReactionButtonProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ReactionButton({
  icon,
  label,
  count,
  active,
  disabled,
  onClick,
}: ReactionButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors disabled:opacity-60',
        active
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
          : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900',
      )}
    >
      {icon}
      <span>
        {label} ({count})
      </span>
    </button>
  );
}
