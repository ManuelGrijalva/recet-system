'use client';

import React, { useState } from 'react';
import { Avatar } from '../../shared/components/ui/Avatar';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';

export default function ProfilePage(): React.JSX.Element {
  const [name, setName] = useState('Manuel Ernesto Grijalva Tenas');
  const [email] = useState('manuel.grijalva@umg.edu.gt');
  const [phone, setPhone] = useState('+502 5555-1234');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Mi perfil de usuario
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Gestiona tus datos personales y configuración de privacidad en la plataforma.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-zinc-100">
          Perfil y teléfono actualizados exitosamente.
        </div>
      )}

      {/* Cabecera del Perfil con Avatar (unico con rounded-full) */}
      <div className="p-5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] flex items-center gap-4">
        <Avatar alt={name} fallbackName={name} size="lg" />
        <div>
          <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
            {name}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {email} · Investigador / Colaborador Jutiapa
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
              Autenticado con Google
            </span>
          </div>
        </div>
      </div>

      {/* Formulario de Datos Personales */}
      <form onSubmit={handleSave} className="p-5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-4">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Datos de contacto y privacidad
        </h3>

        <Input
          label="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          <p className="text-[11px] text-zinc-400">
            Vinculado a tu cuenta de Google.
          </p>
        </div>

        {/* Telefono Editable y Privado */}
        <div className="space-y-1.5">
          <Input
            label="Número de teléfono (Privado y editable)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+502 xxxx-xxxx"
          />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Tu número telefónico es estrictamente privado y no es visible para otros miembros de la comunidad en recetas o comentarios.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" size="md">
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
