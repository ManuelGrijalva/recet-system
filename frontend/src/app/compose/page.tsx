'use client';

import React, { useState } from 'react';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';

interface IngredientRow {
  name: string;
  quantity: string;
  unit: string;
}

interface StepRow {
  stepNumber: number;
  instruction: string;
}

export default function ComposePage(): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeMinutes, setTimeMinutes] = useState(45);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { name: '', quantity: '', unit: 'tazas' },
  ]);

  const [steps, setSteps] = useState<StepRow[]>([
    { stepNumber: 1, instruction: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: 'tazas' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof IngredientRow, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: '' }]);
  };

  const removeStep = (index: number) => {
    setSteps(
      steps
        .filter((_, i) => i !== index)
        .map((s, idx) => ({ ...s, stepNumber: idx + 1 })),
    );
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index].instruction = value;
    setSteps(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        status === 'PUBLISHED'
          ? '¡Tu receta ha sido enviada para validación y publicación comunitaria!'
          : 'Borrador guardado exitosamente.',
      );
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Publicar receta tradicional
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Comparte las recetas y secretos gastronómicos ancestrales de tu familia y de la región de Jutiapa.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-zinc-100">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informacion Principal */}
        <div className="space-y-4 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
          <Input
            label="Título de la receta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ejemplo: Marquesote de Jutiapa al comal"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Descripción e historia cultural
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el platillo, su ocasión tradicional de consumo o el contexto en el municipio..."
              rows={3}
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Tiempo de preparación (min)"
              type="number"
              min={1}
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(parseInt(e.target.value, 10))}
              required
            />
            <Input
              label="Número de porciones"
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value, 10))}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Dificultad
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
                className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="EASY">Fácil</option>
                <option value="MEDIUM">Media</option>
                <option value="HARD">Difícil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ingredientes Dinamicos */}
        <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Ingredientes
            </h2>
            <button
              type="button"
              onClick={addIngredient}
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              + Agregar ingrediente
            </button>
          </div>

          <div className="space-y-2.5">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nombre (ej. Queso criollo)"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  className="flex-2 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Cantidad (ej. 1/2)"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  className="w-24 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Unidad (ej. libra)"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="w-24 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  required
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    aria-label="Eliminar ingrediente"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pasos de Preparacion */}
        <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Pasos de preparación
            </h2>
            <button
              type="button"
              onClick={addStep}
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              + Agregar paso
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center shrink-0 mt-1">
                  {step.stepNumber}
                </span>
                <textarea
                  placeholder={`Describe la instrucción del paso ${step.stepNumber}...`}
                  value={step.instruction}
                  onChange={(e) => updateStep(index, e.target.value)}
                  rows={2}
                  className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                  required
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mt-1"
                    aria-label="Eliminar paso"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Acciones de Publicacion */}
        <div className="flex items-center justify-between p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="draft-toggle"
              checked={status === 'DRAFT'}
              onChange={(e) => setStatus(e.target.checked ? 'DRAFT' : 'PUBLISHED')}
              className="rounded-xs border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0"
            />
            <label htmlFor="draft-toggle" className="text-xs text-zinc-700 dark:text-zinc-300">
              Guardar solo como borrador personal
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="md"
              variant="primary"
              isLoading={isSubmitting}
            >
              {status === 'PUBLISHED' ? 'Publicar receta' : 'Guardar borrador'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
