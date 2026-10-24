'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/shared/session';
import {
  CheckCircleIcon,
  CheckCircleSolidIcon,
  EmojiHappyIcon,
  EmojiHappySolidIcon,
  ThumbUpIcon,
  ThumbUpSolidIcon,
} from '@/shared/components/ui/icons';
import type { ReactionCounts } from '@/shared/types';
import { useReactions } from '../hooks/useReactions';
import type { ReactionType } from '../types';
import { ReactionButton } from './ReactionButton';

interface ReactionButtonsProps {
  recipeId: string;
  initialStats: ReactionCounts;
  initialUserReaction?: ReactionType | null;
  compact?: boolean;
}

const ICON_SIZE = 'w-4 h-4';

export function ReactionButtons({
  recipeId,
  initialStats,
  initialUserReaction = null,
  compact = false,
}: ReactionButtonsProps): React.JSX.Element {
  const router = useRouter();
  const { status } = useSession();
  const { stats, userReaction, isPending, toggle } = useReactions({
    recipeId,
    initialStats,
    initialUserReaction,
  });

  const buttons: {
    type: ReactionType;
    label: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    count: number;
  }[] = [
    { type: 'LIKE', label: 'Me gusta', icon: <ThumbUpIcon className={ICON_SIZE} />, activeIcon: <ThumbUpSolidIcon className={ICON_SIZE} />, count: stats.like },
    { type: 'YUMMY', label: 'Delicioso', icon: <EmojiHappyIcon className={ICON_SIZE} />, activeIcon: <EmojiHappySolidIcon className={ICON_SIZE} />, count: stats.yummy },
    { type: 'TRIED_IT', label: 'La preparé', icon: <CheckCircleIcon className={ICON_SIZE} />, activeIcon: <CheckCircleSolidIcon className={ICON_SIZE} />, count: stats.triedIt },
  ];

  return (
    <div role="group" aria-label="Reacciones" className="flex items-center gap-2 sm:gap-1.5">
      {buttons.map((btn) => (
        <ReactionButton
          key={btn.type}
          icon={btn.icon}
          activeIcon={btn.activeIcon}
          label={btn.label}
          count={btn.count}
          active={userReaction === btn.type}
          disabled={isPending}
          compact={compact}
          onClick={() => (status === 'guest' ? router.push('/login') : toggle(btn.type))}
        />
      ))}
    </div>
  );
}
