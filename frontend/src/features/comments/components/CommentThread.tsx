'use client';

import React from 'react';
import { CommentCard } from './CommentCard';
import { ReplyComposer } from './ReplyComposer';
import { ReplyList } from './ReplyList';
import type { CommentData } from '../types';

interface CommentThreadProps {
  comment: CommentData;
  isReplying: boolean;
  // Sin funcion (invitado) no se muestra el boton de responder
  onToggleReply?: () => void;
  onSubmitReply: (content: string) => void;
  canDelete?: (comment: CommentData) => boolean;
  onDelete?: (commentId: string) => void;
}

export function CommentThread({
  comment,
  isReplying,
  onToggleReply,
  onSubmitReply,
  canDelete,
  onDelete,
}: CommentThreadProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <CommentCard
        comment={comment}
        variant="root"
        onReply={onToggleReply}
        onDelete={onDelete && canDelete?.(comment) ? () => onDelete(comment.id) : undefined}
      />

      {isReplying && (
        <ReplyComposer toName={comment.author.name} onSubmit={onSubmitReply} />
      )}

      <ReplyList replies={comment.replies ?? []} canDelete={canDelete} onDelete={onDelete} />
    </div>
  );
}
