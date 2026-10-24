import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from './icons';
import type { StatusTone } from './StatusBadge';

interface NoticeProps {
  tone: StatusTone;
  children: React.ReactNode;
  role?: 'status' | 'alert';
  className?: string;
}

const TONES: Record<StatusTone, string> = {
  success: 'bg-success-soft text-success-soft-foreground border-success',
  danger: 'bg-danger-soft text-danger-soft-foreground border-danger',
  warning: 'bg-warning-soft text-warning-soft-foreground border-warning-soft-foreground',
  neutral: 'bg-zinc-50 text-zinc-800 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700',
};

// Aviso en bloque con ícono; reemplaza los recuadros grises de estado
export function Notice({ tone, children, role, className }: NoticeProps): React.JSX.Element {
  return (
    <div role={role} className={cn('flex gap-2.5 rounded-md border p-3 text-xs', TONES[tone], className)}>
      {tone === 'success' && <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />}
      {tone === 'danger' && <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />}
      {tone === 'warning' && <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" />}
      <div className="min-w-0 flex-1 space-y-1">{children}</div>
    </div>
  );
}
