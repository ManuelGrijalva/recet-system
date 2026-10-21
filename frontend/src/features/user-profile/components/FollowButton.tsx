import React from 'react';
import { Button } from '@/shared/components/ui/Button';

interface FollowButtonProps {
  isFollowing: boolean;
  isToggling: boolean;
  onToggle: () => void;
}

export function FollowButton({ isFollowing, isToggling, onToggle }: FollowButtonProps): React.JSX.Element {
  return (
    <Button size="sm" variant={isFollowing ? 'outline' : 'primary'} isLoading={isToggling} onClick={onToggle}>
      {isFollowing ? 'Siguiendo' : 'Seguir'}
    </Button>
  );
}
