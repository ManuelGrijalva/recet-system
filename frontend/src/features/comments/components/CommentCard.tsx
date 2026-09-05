import React from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import type { CommentData } from '../types';
import { formatCommentDate } from '../lib/formatCommentDate';

interface CommentCardProps {
  comment: CommentData;
  variant?: 'root' | 'reply';
  onReply?: () => void;
}

export function CommentCard({
  comment,
  variant = 'root',
  onReply,
}: CommentCardProps): React.JSX.Element {
  const isReply = variant === 'reply';

  return (
    <div className="flex items-start gap-2.5">
      <Avatar
        src={comment.author.avatarUrl}
        alt={comment.author.name}
        fallbackName={comment.author.name}
        size={isReply ? 'sm' : 'md'}
      />
      <div
        className={
          isReply
            ? 'flex-1 rounded-md p-2.5 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800'
            : 'flex-1 rounded-md p-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800'
        }
      >
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={
              isReply
                ? 'text-[11px] font-semibold text-zinc-900 dark:text-zinc-100'
                : 'text-xs font-semibold text-zinc-900 dark:text-zinc-100'
            }
          >
            {comment.author.name}
          </span>
          <span className={isReply ? 'text-[9px] text-zinc-400' : 'text-[10px] text-zinc-400'}>
            {formatCommentDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {comment.content}
        </p>
        {onReply && (
          <div className="mt-2">
            <button
              type="button"
              onClick={onReply}
              className="text-[11px] font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100"
            >
              Responder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
