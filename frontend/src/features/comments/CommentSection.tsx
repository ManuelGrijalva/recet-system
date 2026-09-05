'use client';

import React, { useState } from 'react';
import { Avatar } from '../../shared/components/ui/Avatar';
import { Button } from '../../shared/components/ui/Button';

export interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  replies?: CommentData[];
}

interface CommentSectionProps {
  recipeId: string;
  initialComments: CommentData[];
}

export function CommentSection({
  recipeId: _recipeId,
  initialComments,
}: CommentSectionProps): React.JSX.Element {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddRootComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const optimisticComment: CommentData = {
      id: `temp-${Date.now()}`,
      content: newCommentText,
      createdAt: new Date().toISOString(),
      parentId: null,
      author: {
        id: 'me',
        name: 'Manuel Grijalva',
        avatarUrl: null,
      },
      replies: [],
    };

    setComments([...comments, optimisticComment]);
    setNewCommentText('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const optimisticReply: CommentData = {
      id: `temp-reply-${Date.now()}`,
      content: replyText,
      createdAt: new Date().toISOString(),
      parentId,
      author: {
        id: 'me',
        name: 'Manuel Grijalva',
        avatarUrl: null,
      },
    };

    setComments(
      comments.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), optimisticReply],
          };
        }
        return c;
      }),
    );

    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Comentarios comunitarios ({comments.length})
      </h3>

      {/* Formulario de comentario raiz */}
      <form onSubmit={handleAddRootComment} className="flex gap-3">
        <Avatar alt="Tú" fallbackName="Manuel Grijalva" size="md" />
        <div className="flex-1 space-y-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Añade un comentario sobre esta preparación..."
            rows={2}
            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!newCommentText.trim()}>
              Comentar
            </Button>
          </div>
        </div>
      </form>

      {/* Lista de comentarios e hilos */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Comentario Raiz */}
            <div className="flex items-start gap-3">
              <Avatar
                alt={comment.author.name}
                fallbackName={comment.author.name}
                size="md"
              />
              <div className="flex-1 rounded-md p-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {comment.author.name}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {new Date(comment.createdAt).toLocaleDateString('es-GT', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {comment.content}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setReplyingToId(
                        replyingToId === comment.id ? null : comment.id,
                      )
                    }
                    className="text-[11px] font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100"
                  >
                    Responder
                  </button>
                </div>
              </div>
            </div>

            {/* Formulario de Respuesta (1 solo nivel) */}
            {replyingToId === comment.id && (
              <div className="ml-10 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Responder a ${comment.author.name}...`}
                  className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] px-3 py-1 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Enviar
                </Button>
              </div>
            )}

            {/* Respuestas anidadas (Hilos de 1 nivel) */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-10 space-y-2.5 border-l-2 border-zinc-200 dark:border-zinc-800 pl-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-2.5">
                    <Avatar
                      alt={reply.author.name}
                      fallbackName={reply.author.name}
                      size="sm"
                    />
                    <div className="flex-1 rounded-md p-2.5 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">
                          {reply.author.name}
                        </span>
                        <span className="text-[9px] text-zinc-400">
                          {new Date(reply.createdAt).toLocaleDateString('es-GT', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
