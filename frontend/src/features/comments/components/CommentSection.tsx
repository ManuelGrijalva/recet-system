'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from '@/shared/session';
import { useComments } from '../hooks/useComments';
import type { CommentData } from '../types';
import { CommentComposer } from './CommentComposer';
import { CommentThread } from './CommentThread';

interface CommentSectionProps {
  recipeId: string;
  initialComments: CommentData[];
  // compact: dentro de la tarjeta del feed, sin titulo ni borde superior
  compact?: boolean;
}

export function CommentSection({
  recipeId,
  initialComments,
  compact = false,
}: CommentSectionProps): React.JSX.Element {
  const {
    comments,
    replyingToId,
    setReplyingToId,
    addRootComment,
    addReply,
    canDelete,
    removeComment,
  } = useComments({ recipeId, initialComments });
  const { user } = useSession();

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800'}>
      {!compact && (
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Comentarios comunitarios ({comments.length})
        </h3>
      )}

      {user ? (
        <CommentComposer
          authorName={user.name}
          authorAvatarUrl={user.avatarUrl}
          onSubmit={addRootComment}
        />
      ) : (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/login" className="font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-2">
            Inicia sesión
          </Link>{' '}
          para comentar o responder.
        </p>
      )}

      {compact && comments.length === 0 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Sé la primera persona en comentar esta receta.</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            isReplying={replyingToId === comment.id}
            onToggleReply={
              user
                ? () => setReplyingToId(replyingToId === comment.id ? null : comment.id)
                : undefined
            }
            onSubmitReply={(content) => addReply(comment.id, content)}
            canDelete={canDelete}
            onDelete={removeComment}
          />
        ))}
      </div>
    </div>
  );
}
