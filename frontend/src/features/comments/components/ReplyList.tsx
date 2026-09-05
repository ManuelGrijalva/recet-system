import React from 'react';
import { CommentCard } from './CommentCard';
import type { CommentData } from '../types';

interface ReplyListProps {
  replies: CommentData[];
}

export function ReplyList({ replies }: ReplyListProps): React.JSX.Element | null {
  if (replies.length === 0) return null;

  return (
    <div className="ml-10 space-y-2.5 border-l-2 border-zinc-200 dark:border-zinc-800 pl-3">
      {replies.map((reply) => (
        <CommentCard key={reply.id} comment={reply} variant="reply" />
      ))}
    </div>
  );
}
