import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface ReactionButtonProps {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  disabled?: boolean;
  compact?: boolean;
  onClick: () => void;
}

export function ReactionButton({
  icon,
  activeIcon,
  label,
  count,
  active,
  disabled,
  compact = false,
  onClick,
}: ReactionButtonProps): React.JSX.Element {
  // El rebote solo suena al activar por el usuario, no cuando la reaccion llega del servidor
  const [justActivated, setJustActivated] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setJustActivated(!active);
        onClick();
      }}
      disabled={disabled}
      aria-pressed={active}
      aria-label={`${label} (${count})`}
      title={label}
      className={cn(
        'inline-flex min-h-10 sm:min-h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium tabular-nums',
        'transition-[color,background-color,border-color,transform] duration-150 ease-out-strong active:scale-[0.97] motion-reduce:active:scale-100 disabled:opacity-60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        active
          ? 'border-brand bg-brand-soft text-brand-soft-foreground'
          : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100',
      )}
    >
      <span className={cn('inline-flex', active && justActivated && 'animate-reaction-pop')}>
        {active ? activeIcon : icon}
      </span>
      {/* En móvil compacto solo el ícono y el contador; el contador se oculta en cero */}
      <span>
        <span className={compact ? 'hidden sm:inline' : undefined}>{label}</span>
        {count > 0 && <span className={compact ? 'sm:ml-1' : 'ml-1'}>{count}</span>}
      </span>
    </button>
  );
}
