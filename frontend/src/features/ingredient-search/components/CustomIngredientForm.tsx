'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { capitalizeIngredientName } from '../lib/capitalizeIngredientName';

interface CustomIngredientFormProps {
  suggestions: string[];
  isAdding: boolean;
  notice: string | null;
  onAdd: (name: string) => Promise<void>;
}

export function CustomIngredientForm({
  suggestions,
  isAdding,
  notice,
  onAdd,
}: CustomIngredientFormProps): React.JSX.Element {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    void onAdd(value).then(() => setValue(''));
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          list="ingredient-catalog"
          autoComplete="off"
          aria-label="Escribe un ingrediente"
          placeholder="Escribe un ingrediente, por ejemplo: tomate, frijol, masa..."
          className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
        <datalist id="ingredient-catalog">
          {suggestions.map((name) => (
            <option key={name} value={capitalizeIngredientName(name)} />
          ))}
        </datalist>
        <Button type="submit" size="sm" variant="secondary" disabled={!value.trim()} isLoading={isAdding}>
          Agregar
        </Button>
      </form>
      {notice && (
        <p role="status" className="text-xs text-zinc-600 dark:text-zinc-400">
          {notice}
        </p>
      )}
    </div>
  );
}
