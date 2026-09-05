import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import type { ProfileFormValues } from '../types';

interface ProfileContactFormProps {
  values: ProfileFormValues;
  email: string;
  isSaving: boolean;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  onSubmit: () => void;
}

export function ProfileContactForm({
  values,
  email,
  isSaving,
  onChange,
  onSubmit,
}: ProfileContactFormProps): React.JSX.Element {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="p-5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-4"
    >
      <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Datos de contacto y privacidad
      </h3>

      <Input
        label="Nombre completo"
        value={values.name}
        onChange={(e) => onChange('name', e.target.value)}
        required
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-3 text-sm text-zinc-500 cursor-not-allowed"
        />
        <p className="text-[11px] text-zinc-400">Vinculado a tu cuenta de Google.</p>
      </div>

      <div className="space-y-1.5">
        <Input
          label="Número de teléfono (Privado y editable)"
          type="tel"
          value={values.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+502 xxxx-xxxx"
        />
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Tu número telefónico es estrictamente privado y no es visible para otros miembros de la comunidad en recetas o comentarios.
        </p>
      </div>

      <div className="pt-2 flex justify-end">
        <Button type="submit" size="md" isLoading={isSaving}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
