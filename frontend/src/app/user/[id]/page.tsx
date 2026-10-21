import React from 'react';
import { UserProfileScreen } from '@/features/user-profile';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  return <UserProfileScreen userId={id} />;
}
