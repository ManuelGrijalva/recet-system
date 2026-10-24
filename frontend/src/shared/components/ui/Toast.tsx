'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { CheckCircleIcon, ExclamationCircleIcon } from './icons';

type ToastTone = 'success' | 'danger' | 'neutral';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const DURATION_MS = 2800;

// Aviso breve y uniforme para confirmar acciones (guardar, copiar, seguir); se lee en lectores de pantalla
export function ToastProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const nextId = useRef(0);

  const show = useCallback((message: string, tone: ToastTone = 'success') => {
    nextId.current += 1;
    setToast({ id: nextId.current, message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Sobre la barra inferior en el celular y abajo al centro en escritorio */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 md:bottom-6">
        {toast && (
          <div
            key={toast.id}
            className={cn(
              'flex max-w-sm items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium shadow-lg animate-rise-in',
              toast.tone === 'success' && 'border-success bg-success-soft text-success-soft-foreground',
              toast.tone === 'danger' && 'border-danger bg-danger-soft text-danger-soft-foreground',
              toast.tone === 'neutral' && 'border-zinc-700 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
            )}
          >
            {toast.tone === 'danger' ? (
              <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircleIcon className="h-4 w-4 shrink-0" />
            )}
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

// Fuera del proveedor no hace nada: los componentes siguen funcionando sin avisos
export function useToast(): ToastContextValue {
  return useContext(ToastContext) ?? { show: () => undefined };
}
