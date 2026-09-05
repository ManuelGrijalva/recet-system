'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';

interface ReplyComposerProps {
  toName: string;
  onSubmit: (content: string) => void;
}

export function ReplyComposer({
  toName,
  onSubmit,
}: ReplyComposerProps): React.JSX.Element {
  const [text, setText] = useState('');

  return (
    <div className="ml-10 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Responder a ${toName}...`}
        className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 py-1 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />
      <Button
        size="sm"
        onClick={() => onSubmit(text)}
        disabled={!text.trim()}
      >
        Enviar
      </Button>
    </div>
  );
}
