'use client';

import React from 'react';
import { CommentCard } from './CommentCard';
import { ReplyComposer } from './ReplyComposer';
import { ReplyList } from './ReplyList';
import type { CommentData } from '../types';

interface CommentThreadProps {
  comment: CommentData;
  isReplying: boolean;
  onToggleReply: () => void;
  onSubmitReply: (content: string) => void;
}

export function CommentThread({
  comment,
  isReplying,
  onToggleReply,
  onSubmitReply,
}: CommentThreadProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <CommentCard comment={comment} variant="root" onReply={onToggleReply} />

      {isReplying && (
        <ReplyComposer toName={comment.author.name} onSubmit={onSubmitReply} />
      )}

      <ReplyList replies={comment.replies ?? []} />
    </div>
  );
}
