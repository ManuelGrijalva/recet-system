'use client';

import React from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import type { ProfileFormValues } from '../types';

const BIO_MAX = 300;

interface ProfileEditModalProps {
  isOpen: boolean;
  values: ProfileFormValues;
  isSaving: boolean;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function ProfileEditModal({
  isOpen,
  values,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}: ProfileEditModalProps): React.JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar perfil">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Input label="Nombre" value={values.name} onChange={(e) => onChange('name', e.target.value)} maxLength={100} required />

        <div className="space-y-1.5">
          <label htmlFor="profile-bio" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Presentación
          </label>
          <textarea
            id="profile-bio"
            value={values.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            maxLength={BIO_MAX}
            rows={3}
            placeholder="Cuéntale a la comunidad de dónde eres y qué cocinas. Ejemplo: Aprendí a hacer tamales con mi abuela en Asunción Mita."
            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-right">
            {values.bio.length}/{BIO_MAX} · Visible para todos
          </p>
        </div>

        <div className="space-y-1.5">
          <Input
            label="Teléfono"
            type="tel"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+502 xxxx-xxxx"
            maxLength={25}
          />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Privado: nadie más lo ve.</p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" size="md" isLoading={isSaving}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
