import React from 'react';
import { DownloadIcon } from '@/shared/components/ui/icons';

interface PdfDownloadLinkProps {
  href: string;
  label: string;
}

// Enlace con aspecto de boton: la descarga la hace el navegador con la cookie de sesion
export function PdfDownloadLink({ href, label }: PdfDownloadLinkProps): React.JSX.Element {
  return (
    <a
      href={href}
      download
      rel="nofollow"
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
    >
      <DownloadIcon className="w-3.5 h-3.5" />
      {label}
    </a>
  );
}
