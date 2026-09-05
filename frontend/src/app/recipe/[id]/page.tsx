'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '../../../shared/components/ui/Avatar';
import { ReactionButtons } from '../../../features/reactions/ReactionButtons';
import { CommentSection } from '../../../features/comments/CommentSection';

export default function RecipeDetailPage(): React.JSX.Element {
  const recipe = {
    id: '1',
    title: 'Quesadilla de Arroz Tradicional de Jutiapa',
    author: {
      name: 'Doña Rosalía Gómez',
      role: 'Cocinera tradicional jutiapaneca',
    },
    region: 'Jutiapa, Jutiapa',
    timeMinutes: 60,
    cookTimeMinutes: 40,
    prepTimeMinutes: 20,
    servings: 12,
    difficulty: 'Media',
    description:
      'La quesadilla de arroz jutiapaneca es una de las joyas de la repostería criolla tradicional del oriente de Guatemala. Se hornea con queso artesanal fresco seco o duro, crema de leche de vaca criolla, azúcar, huevos frescos y harina de arroz fina, decorada con ajonjolí dorado.',
    ingredients: [
      { name: 'Harina de arroz fina', quantity: '1', unit: 'libra' },
      { name: 'Queso criollo artesanal de Jutiapa (rallado)', quantity: '1/2', unit: 'libra' },
      { name: 'Crema fresca pura de vaca', quantity: '1', unit: 'taza' },
      { name: 'Azúcar refinada o de caña', quantity: '1', unit: 'libra' },
      { name: 'Huevos de patio', quantity: '4', unit: 'unidades' },
      { name: 'Polvo de hornear', quantity: '1', unit: 'cucharadita' },
      { name: 'Ajonjolí tostado para decorar', quantity: '2', unit: 'cucharadas' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'En un recipiente amplio, bata los huevos hasta que adquieran una consistencia espumosa y color claro.',
      },
      {
        stepNumber: 2,
        instruction:
          'Incorpore el azúcar de forma gradual sin dejar de batir, hasta que se disuelva por completo.',
      },
      {
        stepNumber: 3,
        instruction:
          'Agregue la crema fresca de vaca y el queso artesanal finamente rallado, mezclando de manera envolvente.',
      },
      {
        stepNumber: 4,
        instruction:
          'Cierna la harina de arroz junto con el polvo de hornear y añádala poco a poco a la preparación hasta lograr una mezcla homogénea sin grumos.',
      },
      {
        stepNumber: 5,
        instruction:
          'Vierta la mezcla en moldes metálicos previamente engrasados, espolvoree el ajonjolí en la superficie y hornee a 180°C durante 40 a 45 minutos hasta que adquiera un tono dorado.',
      },
    ],
    stats: {
      likes: 42,
      yummy: 68,
      triedIt: 19,
    },
    comments: [
      {
        id: 'c1',
        content: 'El queso artesanal de Jutiapa le da ese sabor saladito y dulce tan característico. ¡Una delicia!',
        createdAt: new Date().toISOString(),
        parentId: null,
        author: {
          id: 'u1',
          name: 'Carlos Menéndez',
          avatarUrl: null,
        },
        replies: [
          {
            id: 'c1-1',
            content: 'Así es, si consiguen queso de cincho de la región sale todavía más auténtica.',
            createdAt: new Date().toISOString(),
            parentId: 'c1',
            author: {
              id: 'u2',
              name: 'Doña Rosalía Gómez',
              avatarUrl: null,
            },
          },
        ],
      },
    ],
  };

  return (
    <article className="space-y-6">
      {/* Navegacion de retorno */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← Volver al recetario
        </Link>
      </div>

      {/* Cabecera del Platillo */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{recipe.region}</span>
          <span>•</span>
          <span>Tradición viva</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          {recipe.title}
        </h1>

        <div className="flex items-center gap-3 pt-1">
          <Avatar alt={recipe.author.name} fallbackName={recipe.author.name} size="md" />
          <div>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {recipe.author.name}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {recipe.author.role}
            </p>
          </div>
        </div>
      </div>

      {/* Metadatos de Coccion */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs">
        <div>
          <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">
            Preparación
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {recipe.prepTimeMinutes} min
          </span>
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">
            Cocción
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {recipe.cookTimeMinutes} min
          </span>
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">
            Rendimiento
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {recipe.servings} porciones
          </span>
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">
            Dificultad
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Descripcion Cultural */}
      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
        <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
          Reseña e historia
        </h2>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {recipe.description}
        </p>
      </div>

      {/* Ingredientes Requeridos */}
      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-3">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Ingredientes requeridos
        </h2>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx} className="py-2 flex items-center justify-between">
              <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                {ing.name}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {ing.quantity} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pasos de Preparacion */}
      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] space-y-3">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Modo de preparación
        </h2>
        <div className="space-y-3">
          {recipe.steps.map((step) => (
            <div key={step.stepNumber} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step.stepNumber}
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed pt-0.5">
                {step.instruction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interacciones y Reacciones */}
      <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
        <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          ¿Has probado esta receta? Reacciona para la comunidad:
        </h3>
        <ReactionButtons
          recipeId={recipe.id}
          initialStats={recipe.stats}
          initialUserReaction="YUMMY"
        />
      </div>

      {/* Seccion de Comentarios con Hilos */}
      <CommentSection
        recipeId={recipe.id}
        initialComments={recipe.comments}
      />
    </article>
  );
}
