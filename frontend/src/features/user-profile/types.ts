import type { UserRole } from '@/shared/session';

// GET /users/:id con su actividad
export interface PublicProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  coverImageUrl: string | null;
  role: UserRole;
  createdAt: string;
  publishedRecipesCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface FollowState {
  isFollowing: boolean;
  followersCount: number;
}
