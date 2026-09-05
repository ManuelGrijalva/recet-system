'use client';

import React from 'react';
import {
  CheckCircleIcon,
  EmojiHappyIcon,
  ThumbUpIcon,
} from '@/shared/components/ui/icons';
import type { ReactionCounts } from '@/shared/types';
import { useReactions } from '../hooks/useReactions';
import type { ReactionType } from '../types';
import { ReactionButton } from './ReactionButton';

interface ReactionButtonsProps {
  recipeId: string;
  initialStats: ReactionCounts;
  initialUserReaction?: ReactionType | null;
}

const ICON_SIZE = 'w-3.5 h-3.5';

export function ReactionButtons({
  recipeId,
  initialStats,
  initialUserReaction = null,
}: ReactionButtonsProps): React.JSX.Element {
  const { stats, userReaction, isPending, toggle } = useReactions({
    recipeId,
    initialStats,
    initialUserReaction,
  });

  const buttons: {
    type: ReactionType;
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    { type: 'LIKE', label: 'Me gusta', icon: <ThumbUpIcon className={ICON_SIZE} />, count: stats.like },
    { type: 'YUMMY', label: 'Delicioso', icon: <EmojiHappyIcon className={ICON_SIZE} />, count: stats.yummy },
    { type: 'TRIED_IT', label: 'La preparé', icon: <CheckCircleIcon className={ICON_SIZE} />, count: stats.triedIt },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {buttons.map((btn) => (
        <ReactionButton
          key={btn.type}
          icon={btn.icon}
          label={btn.label}
          count={btn.count}
          active={userReaction === btn.type}
          disabled={isPending}
          onClick={() => toggle(btn.type)}
        />
      ))}
    </div>
  );
}
