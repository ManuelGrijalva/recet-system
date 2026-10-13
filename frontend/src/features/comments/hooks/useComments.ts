'use client';

import { useCallback, useMemo, useState } from 'react';
import type { AuthorSummary } from '@/shared/types';
import { useSession } from '@/shared/session';
import { addComment } from '../api/addComment';
import type { CommentData } from '../types';

interface UseCommentsParams {
  recipeId: string;
  initialComments: CommentData[];
}

interface UseCommentsResult {
  comments: CommentData[];
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  addRootComment: (content: string) => void;
  addReply: (parentId: string, content: string) => void;
}

function draftComment(
  content: string,
  parentId: string | null,
  author: AuthorSummary,
): CommentData {
  return {
    id: `temp-${Date.now()}`,
    content,
    createdAt: new Date().toISOString(),
    parentId,
    author,
    replies: parentId ? undefined : [],
  };
}

export function useComments({
  recipeId,
  initialComments,
}: UseCommentsParams): UseCommentsResult {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const { user } = useSession();
  const author = useMemo<AuthorSummary | null>(
    () => (user ? { id: user.id, name: user.name, avatarUrl: user.avatarUrl } : null),
    [user],
  );

  const addRootComment = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !author) return;

      const optimistic = draftComment(trimmed, null, author);
      setComments((prev) => [...prev, optimistic]);

      addComment(recipeId, { content: trimmed })
        .then((saved) => {
          setComments((prev) =>
            prev.map((c) => (c.id === optimistic.id ? { ...saved, replies: [] } : c)),
          );
        })
        .catch(() => {
          setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
        });
    },
    [recipeId, author],
  );

  const addReply = useCallback(
    (parentId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !author) return;

      const optimistic = draftComment(trimmed, parentId, author);
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies ?? []), optimistic] }
            : c,
        ),
      );
      setReplyingToId(null);

      addComment(recipeId, { content: trimmed, parentId })
        .then((saved) => {
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? {
                    ...c,
                    replies: (c.replies ?? []).map((r) =>
                      r.id === optimistic.id ? saved : r,
                    ),
                  }
                : c,
            ),
          );
        })
        .catch(() => {
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? {
                    ...c,
                    replies: (c.replies ?? []).filter(
                      (r) => r.id !== optimistic.id,
                    ),
                  }
                : c,
            ),
          );
        });
    },
    [recipeId, author],
  );

  return {
    comments,
    replyingToId,
    setReplyingToId,
    addRootComment,
    addReply,
  };
}
