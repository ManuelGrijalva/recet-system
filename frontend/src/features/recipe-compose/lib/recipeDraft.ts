import type { Difficulty } from '@/shared/types';
import type {
  IngredientDraft,
  RecipeDraft,
  StepDraft,
} from '../types';

export const EMPTY_INGREDIENT: IngredientDraft = {
  name: '',
  quantity: '',
  unit: 'tazas',
};

export function emptyStep(stepNumber: number): StepDraft {
  return { stepNumber, instruction: '' };
}

export function createEmptyDraft(): RecipeDraft {
  return {
    title: '',
    description: '',
    timeMinutes: 45,
    servings: 4,
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    ingredients: [{ ...EMPTY_INGREDIENT }],
    steps: [emptyStep(1)],
  };
}

// --- Ingredientes (operaciones puras sobre el arreglo) ---

export function addIngredient(rows: IngredientDraft[]): IngredientDraft[] {
  return [...rows, { ...EMPTY_INGREDIENT }];
}

export function removeIngredientAt(
  rows: IngredientDraft[],
  index: number,
): IngredientDraft[] {
  return rows.filter((_, i) => i !== index);
}

export function updateIngredientAt(
  rows: IngredientDraft[],
  index: number,
  field: keyof IngredientDraft,
  value: string,
): IngredientDraft[] {
  return rows.map((row, i) => (i === index ? { ...row, [field]: value } : row));
}

// --- Pasos (se renumeran siempre tras cada cambio estructural) ---

function renumber(rows: StepDraft[]): StepDraft[] {
  return rows.map((row, i) => ({ ...row, stepNumber: i + 1 }));
}

export function addStep(rows: StepDraft[]): StepDraft[] {
  return renumber([...rows, emptyStep(rows.length + 1)]);
}

export function removeStepAt(rows: StepDraft[], index: number): StepDraft[] {
  return renumber(rows.filter((_, i) => i !== index));
}

export function updateStepAt(
  rows: StepDraft[],
  index: number,
  instruction: string,
): StepDraft[] {
  return rows.map((row, i) => (i === index ? { ...row, instruction } : row));
}

export const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'EASY', label: 'Fácil' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HARD', label: 'Difícil' },
];
