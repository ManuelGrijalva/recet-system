'use client';

import React, { useState } from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';

interface CommentComposerProps {
  authorName?: string;
  onSubmit: (content: string) => void;
}

export function CommentComposer({
  authorName = 'Manuel Grijalva',
  onSubmit,
}: CommentComposerProps): React.JSX.Element {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Avatar alt="Tú" fallbackName={authorName} size="md" />
      <div className="flex-1 space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Añade un comentario sobre esta preparación..."
          rows={2}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!text.trim()}>
            Comentar
          </Button>
        </div>
      </div>
    </form>
  );
}
