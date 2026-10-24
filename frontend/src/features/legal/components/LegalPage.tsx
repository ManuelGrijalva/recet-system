import React from 'react';
import { TextileBand } from '@/shared/components/ui/TextileBand';

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({ title, updatedAt, intro, sections }: LegalPageProps): React.JSX.Element {
  return (
    <article className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{title}</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Última actualización: {updatedAt}</p>
        <TextileBand scale={0.375} className="!mt-3 rounded-sm" />
      </header>

      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{intro}</p>

      {sections.map((section) => (
        <section key={section.heading} className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
