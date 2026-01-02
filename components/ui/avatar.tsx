import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        'bg-primary/10 text-primary',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt || name} 
          className="w-full h-full rounded-full object-cover" 
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
