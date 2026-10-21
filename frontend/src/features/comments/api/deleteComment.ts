import { apiClient } from '@/shared/lib/apiClient';

// DELETE /interactions/comments/:id: el autor o el admin; borra tambien sus respuestas
export async function deleteComment(commentId: string): Promise<void> {
  await apiClient<Record<string, never>>(`interactions/comments/${commentId}`, { method: 'DELETE' });
}
