'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/lib/apiClient';
import { useToast } from '@/shared/components/ui/Toast';
import type { FeedRecipe } from '@/features/recipe-feed';
import { getAuthorRecipes } from '../api/getAuthorRecipes';
import { getPublicProfile } from '../api/getPublicProfile';
import { toggleFollow } from '../api/toggleFollow';
import type { PublicProfile } from '../types';

interface UsePublicProfileResult {
  profile: PublicProfile | null;
  recipes: FeedRecipe[];
  isLoading: boolean;
  error: string | null;
  isToggling: boolean;
  followError: string | null;
  follow: () => Promise<void>;
}

export function usePublicProfile(userId: string): UsePublicProfileResult {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const toast = useToast();
  const [recipes, setRecipes] = useState<FeedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([getPublicProfile(userId), getAuthorRecipes(userId)])
      .then(([profileData, recipesPage]) => {
        if (!active) return;
        setProfile(profileData);
        setRecipes(recipesPage.items);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof ApiError && err.status === 404 ? 'Este usuario no existe.' : 'No se pudo cargar el perfil.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const follow = useCallback(async () => {
    setIsToggling(true);
    setFollowError(null);
    try {
      const state = await toggleFollow(userId);
      setProfile((prev) => (prev ? { ...prev, ...state } : prev));
      const name = profile?.name.split(' ')[0] ?? 'este cocinero';
      toast.show(state.isFollowing ? `Ahora sigues a ${name}` : `Dejaste de seguir a ${name}`, state.isFollowing ? 'success' : 'neutral');
    } catch (err) {
      setFollowError(err instanceof ApiError && err.status === 401 ? 'Inicia sesión para seguir a otros cocineros.' : 'No se pudo actualizar. Intenta de nuevo.');
    } finally {
      setIsToggling(false);
    }
  }, [userId, profile, toast]);

  return { profile, recipes, isLoading, error, isToggling, followError, follow };
}
