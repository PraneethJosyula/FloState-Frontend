import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  children: ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]",
        {
          // Primary - high contrast, clear CTA
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md": variant === 'default',
          // Secondary - subtle but readable
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === 'secondary',
          // Ghost - minimal, for icons/nav
          "text-foreground hover:bg-secondary": variant === 'ghost',
          // Outline - clear border, good for secondary actions
          "border-2 border-border bg-transparent text-foreground hover:bg-secondary hover:border-secondary": variant === 'outline',
          // Destructive - clear warning
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === 'destructive',
        },
        {
          "h-8 px-3 text-sm": size === 'sm',
          "h-10 px-4 text-sm": size === 'default',
          "h-12 px-6 text-base": size === 'lg',
          "h-10 w-10 p-0": size === 'icon',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
