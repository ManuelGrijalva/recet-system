'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getMyProfile } from '../api/getMyProfile';
import { updateMyProfile } from '../api/updateMyProfile';
import type { ProfileFormValues, UserProfile } from '../types';

interface UseProfileFormResult {
  profile: UserProfile | null;
  values: ProfileFormValues;
  isLoading: boolean;
  isSaving: boolean;
  feedback: { ok: boolean; message: string } | null;
  setValue: (field: keyof ProfileFormValues, value: string) => void;
  save: () => Promise<void>;
}

const EMPTY_VALUES: ProfileFormValues = { name: '', phone: '' };

export function useProfileForm(): UseProfileFormResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [values, setValues] = useState<ProfileFormValues>(EMPTY_VALUES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] =
    useState<{ ok: boolean; message: string } | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setValues({ name: data.name, phone: data.phone ?? '' });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const setValue = useCallback(
    (field: keyof ProfileFormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const flashFeedback = useCallback((ok: boolean, message: string) => {
    setFeedback({ ok, message });
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3000);
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const updated = await updateMyProfile(values);
      setProfile(updated);
      flashFeedback(true, 'Perfil y teléfono actualizados exitosamente.');
    } catch (err) {
      flashFeedback(
        false,
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el perfil. Intenta de nuevo.',
      );
    } finally {
      setIsSaving(false);
    }
  }, [values, flashFeedback]);

  return {
    profile,
    values,
    isLoading,
    isSaving,
    feedback,
    setValue,
    save,
  };
}
