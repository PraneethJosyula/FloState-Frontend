import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

// Accessible category colors with good contrast
const categoryStyles: Record<string, string> = {
  'Deep Work': 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'Coding': 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  'Reading': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  'Writing': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'Design': 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
  'Learning': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
  'Exercise': 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  'Other': 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const category = typeof children === 'string' ? children : '';
  const style = categoryStyles[category] || 'bg-secondary text-secondary-foreground';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        style,
        className
      )}
    >
      {children}
    </span>
  );
}
