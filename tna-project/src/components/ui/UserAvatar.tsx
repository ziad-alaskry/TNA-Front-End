'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface UserAvatarProps {
  isVisitor?: boolean;
  user?: {
    name?: string;
    avatar?: string;
  };
  src?: string;
  alt?: string;
  className?: string;
}

export function UserAvatar({ isVisitor = true, user, src, alt, className }: UserAvatarProps) {
  const hasName = user?.name || alt;
  const userSrc = src || user?.avatar;

  if (isVisitor || !hasName) {
    return (
      <div className={cn('relative', className)}>
        <div className="h-8 w-8 rounded-full bg-surface-200 border border-divider flex items-center justify-center text-neutral-500">
          <User size={16} />
        </div>
        <div className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-[2px] border-surface bg-warning" />
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {userSrc ? (
        <img
          src={userSrc}
          alt={alt || 'User avatar'}
          className="h-8 w-8 rounded-full object-cover border border-divider"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold border border-divider">
          {hasName.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-[2px] border-surface bg-success" />
    </div>
  );
}