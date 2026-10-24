'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Notice } from '@/shared/components/ui/Notice';
import { useContributorRequest } from '../hooks/useContributorRequest';
import {
  CONTRIBUTOR_BENEFITS,
  CONTRIBUTOR_RULES,
  CONTRIBUTOR_WARNING,
} from '../lib/contributorGuidelines';

const MOTIVATION_MAX = 500;

const dateFormatter = new Intl.DateTimeFormat('es-GT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const boxClass =
  'p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15110d] space-y-3';

function GuidelineList({ items }: { items: string[] }): React.JSX.Element {
  return (
    <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ContributorRequestSection(): React.JSX.Element | null {
  const { request, isLoading, isSubmitting, error, submit } = useContributorRequest();
  const [isOpen, setIsOpen] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [accepted, setAccepted] = useState(false);

  if (isLoading) return null;

  if (request?.status === 'PENDING') {
    return (
      <section className={boxClass}>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Solicitud de colaborador en revisión</h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          La enviaste el {dateFormatter.format(new Date(request.createdAt))}. Cuando el administrador la apruebe,
          recarga la página para empezar a publicar recetas.
        </p>
      </section>
    );
  }

  // El rol se relee al recargar; mientras tanto se avisa que ya fue aprobada
  if (request?.status === 'APPROVED') {
    return (
      <section className={boxClass}>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Solicitud aprobada</h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Ya eres colaborador. Recarga la página para ver la opción de publicar recetas.
        </p>
      </section>
    );
  }

  return (
    <section className={boxClass}>
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">¿Quieres compartir tus recetas?</h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Solicita el rol de colaborador para publicar recetas tradicionales en Memoria del Comal.
        </p>
      </div>

      {request?.status === 'REJECTED' && (
        <Notice tone="danger">
          <p className="font-semibold">Tu solicitud anterior no fue aprobada</p>
          {request.reviewNotes && <p className="whitespace-pre-line">{request.reviewNotes}</p>}
          <p>Puedes volver a solicitarlo.</p>
        </Notice>
      )}

      {!isOpen ? (
        <Button type="button" size="sm" variant="primary" onClick={() => setIsOpen(true)}>
          Solicitar ser colaborador
        </Button>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (accepted) void submit(motivation);
          }}
        >
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Qué podrás hacer</h3>
            <GuidelineList items={CONTRIBUTOR_BENEFITS} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Normas de contenido</h3>
            <GuidelineList items={CONTRIBUTOR_RULES} />
          </div>

          <p className="p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200">
            <span className="font-semibold">Importante: </span>
            {CONTRIBUTOR_WARNING}
          </p>

          <div className="space-y-1.5">
            <label htmlFor="contributor-motivation" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              ¿Qué recetas te gustaría compartir? (opcional)
            </label>
            <textarea
              id="contributor-motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              maxLength={MOTIVATION_MAX}
              rows={3}
              placeholder="Ejemplo: recetas de mi abuela de Asunción Mita, como el tamal de viaje y los dulces de Semana Santa."
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15110d] p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-right">
              {motivation.length}/{MOTIVATION_MAX}
            </p>
          </div>

          <label className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 rounded-xs border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0"
            />
            <span>Leí y acepto las normas de contenido. Entiendo que mis recetas serán revisadas y que el contenido que no cumpla puede ser eliminado.</span>
          </label>

          {error && <p className="text-xs text-zinc-700 dark:text-zinc-300">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" disabled={!accepted} isLoading={isSubmitting}>
              Enviar solicitud
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
