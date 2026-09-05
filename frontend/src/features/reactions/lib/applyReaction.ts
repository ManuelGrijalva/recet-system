import type { ReactionCounts } from '@/shared/types';
import type { ReactionState, ReactionType } from '../types';

const KEY_BY_TYPE: Record<ReactionType, keyof ReactionCounts> = {
  LIKE: 'like',
  YUMMY: 'yummy',
  TRIED_IT: 'triedIt',
};

function decrement(
  stats: ReactionCounts,
  type: ReactionType | null,
): ReactionCounts {
  if (!type) return stats;
  const key = KEY_BY_TYPE[type];
  return { ...stats, [key]: Math.max(0, stats[key] - 1) };
}

function increment(stats: ReactionCounts, type: ReactionType): ReactionCounts {
  const key = KEY_BY_TYPE[type];
  return { ...stats, [key]: stats[key] + 1 };
}

/**
 * Reducer puro del toggle de reacción. No toca red ni estado de React:
 * dado el estado actual y el tipo pulsado, devuelve el siguiente estado.
 *
 * - Pulsar la reacción activa -> la quita.
 * - Pulsar otra -> mueve el conteo de la anterior a la nueva.
 */
export function applyReaction(
  state: ReactionState,
  type: ReactionType,
): ReactionState {
  if (state.userReaction === type) {
    return {
      stats: decrement(state.stats, type),
      userReaction: null,
    };
  }

  return {
    stats: increment(decrement(state.stats, state.userReaction), type),
    userReaction: type,
  };
}
