import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from './icons';

export type StatusTone = 'success' | 'danger' | 'warning' | 'neutral';

interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
}

const TONES: Record<StatusTone, string> = {
  success: 'bg-success-soft text-success-soft-foreground border-success',
  danger: 'bg-danger-soft text-danger-soft-foreground border-danger',
  warning: 'bg-warning-soft text-warning-soft-foreground border-warning-soft-foreground',
  neutral: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800',
};

// El color nunca va solo: cada tono lleva su ícono y su texto
export function StatusBadge({ tone, children, className }: StatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {tone === 'success' && <CheckCircleIcon className="h-3.5 w-3.5" />}
      {tone === 'danger' && <ExclamationCircleIcon className="h-3.5 w-3.5" />}
      {tone === 'warning' && <ClockIcon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
