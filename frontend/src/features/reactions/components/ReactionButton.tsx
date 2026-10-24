import React from 'react';
import { cn } from '@/shared/lib/utils';

interface ReactionButtonProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  disabled?: boolean;
  compact?: boolean;
  onClick: () => void;
}

export function ReactionButton({
  icon,
  label,
  count,
  active,
  disabled,
  compact = false,
  onClick,
}: ReactionButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={`${label} (${count})`}
      title={label}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all active:scale-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        active
          ? 'bg-brand-soft text-brand-soft-foreground border-brand font-semibold'
          : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900',
      )}
    >
      {icon}
      {compact ? (
        <span>
          <span className="hidden sm:inline">{label} </span>
          {count}
        </span>
      ) : (
        <span>
          {label} ({count})
        </span>
      )}
    </button>
  );
}
