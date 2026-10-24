import type { Metadata } from 'next';
import React from 'react';
import { UserProfileScreen } from '@/features/user-profile';
import { userMetadata } from '@/shared/lib/serverMetadata';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  return userMetadata(id);
}

export default async function UserProfilePage({ params }: UserProfilePageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <UserProfileScreen userId={id} />;
}
