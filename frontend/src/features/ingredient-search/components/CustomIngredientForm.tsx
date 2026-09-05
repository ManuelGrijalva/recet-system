'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';

interface CustomIngredientFormProps {
  onAdd: (name: string) => void;
}

export function CustomIngredientForm({
  onAdd,
}: CustomIngredientFormProps): React.JSX.Element {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Escribe otro ingrediente..."
        className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />
      <Button type="submit" size="sm" variant="secondary" disabled={!value.trim()}>
        Agregar
      </Button>
    </form>
  );
}
