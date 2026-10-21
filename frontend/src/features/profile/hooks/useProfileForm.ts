'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from '@/shared/session';
import { getPublicProfile, type ProfileHeaderStats } from '@/features/user-profile';
import { getMyProfile } from '../api/getMyProfile';
import { updateMyProfile } from '../api/updateMyProfile';
import { uploadProfileImage } from '../api/uploadProfileImage';
import type { ProfileFormValues, ProfileImageKind, UserProfile } from '../types';

interface Feedback {
  ok: boolean;
  message: string;
}

interface UseProfileFormResult {
  profile: UserProfile | null;
  stats: ProfileHeaderStats | null;
  values: ProfileFormValues;
  isLoading: boolean;
  isSaving: boolean;
  uploading: ProfileImageKind | null;
  feedback: Feedback | null;
  setValue: (field: keyof ProfileFormValues, value: string) => void;
  resetValues: () => void;
  save: () => Promise<boolean>;
  changeImage: (kind: ProfileImageKind, file: File) => Promise<void>;
}

const EMPTY_VALUES: ProfileFormValues = { name: '', bio: '', phone: '' };

function valuesFrom(profile: UserProfile): ProfileFormValues {
  return { name: profile.name, bio: profile.bio ?? '', phone: profile.phone ?? '' };
}

export function useProfileForm(): UseProfileFormResult {
  const { refresh } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileHeaderStats | null>(null);
  const [values, setValues] = useState<ProfileFormValues>(EMPTY_VALUES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState<ProfileImageKind | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setValues(valuesFrom(data));
        // Los contadores salen del perfil publico
        getPublicProfile(data.id)
          .then((p) => {
            if (active) setStats({ recipes: p.publishedRecipesCount, followers: p.followersCount, following: p.followingCount });
          })
          .catch(() => undefined);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const setValue = useCallback((field: keyof ProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetValues = useCallback(() => {
    if (profile) setValues(valuesFrom(profile));
  }, [profile]);

  const flashFeedback = useCallback((ok: boolean, message: string) => {
    setFeedback({ ok, message });
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3500);
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const updated = await updateMyProfile({
        name: values.name.trim(),
        bio: values.bio.trim(),
        phone: values.phone.trim() || undefined,
      });
      setProfile(updated);
      void refresh();
      flashFeedback(true, 'Tu perfil se actualizó.');
      return true;
    } catch (err) {
      flashFeedback(false, err instanceof Error ? err.message : 'No se pudo actualizar el perfil. Intenta de nuevo.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [values, flashFeedback, refresh]);

  const changeImage = useCallback(
    async (kind: ProfileImageKind, file: File) => {
      setUploading(kind);
      try {
        const url = await uploadProfileImage(kind, file);
        const updated = await updateMyProfile(kind === 'avatar' ? { avatarUrl: url } : { coverImageUrl: url });
        setProfile(updated);
        if (kind === 'avatar') void refresh();
        flashFeedback(true, kind === 'avatar' ? 'Foto de perfil actualizada.' : 'Portada actualizada.');
      } catch (err) {
        flashFeedback(false, err instanceof Error ? err.message : 'No se pudo cambiar la foto.');
      } finally {
        setUploading(null);
      }
    },
    [flashFeedback, refresh],
  );

  return { profile, stats, values, isLoading, isSaving, uploading, feedback, setValue, resetValues, save, changeImage };
}
