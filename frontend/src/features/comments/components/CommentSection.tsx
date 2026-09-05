'use client';

import React from 'react';
import { useComments } from '../hooks/useComments';
import type { CommentData } from '../types';
import { CommentComposer } from './CommentComposer';
import { CommentThread } from './CommentThread';

interface CommentSectionProps {
  recipeId: string;
  initialComments: CommentData[];
}

export function CommentSection({
  recipeId,
  initialComments,
}: CommentSectionProps): React.JSX.Element {
  const {
    comments,
    replyingToId,
    setReplyingToId,
    addRootComment,
    addReply,
  } = useComments({ recipeId, initialComments });

  return (
    <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Comentarios comunitarios ({comments.length})
      </h3>

      <CommentComposer onSubmit={addRootComment} />

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            isReplying={replyingToId === comment.id}
            onToggleReply={() =>
              setReplyingToId(replyingToId === comment.id ? null : comment.id)
            }
            onSubmitReply={(content) => addReply(comment.id, content)}
          />
        ))}
      </div>
    </div>
  );
}
