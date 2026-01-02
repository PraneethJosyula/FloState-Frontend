'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Play, Code, BookOpen, PenTool, Palette, GraduationCap, Dumbbell, MoreHorizontal, Zap } from 'lucide-react';
import { useTimer } from '@/lib/context/timer-context';
import { cn } from '@/lib/utils';

interface StartActivityModalProps {
  onClose: () => void;
}

const categories = [
  { name: 'Deep Work', icon: Zap, color: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/20' },
  { name: 'Coding', icon: Code, color: 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/20' },
  { name: 'Reading', icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20' },
  { name: 'Writing', icon: PenTool, color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20' },
  { name: 'Design', icon: Palette, color: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-500/20' },
  { name: 'Learning', icon: GraduationCap, color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/20' },
  { name: 'Exercise', icon: Dumbbell, color: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20' },
  { name: 'Other', icon: MoreHorizontal, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/20' },
];

export function StartActivityModal({ onClose }: StartActivityModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { startTimer } = useTimer();

  const handleStart = () => {
    if (selectedCategory) {
      startTimer(selectedCategory);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Start Focus Session</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            What are you working on?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    selectedCategory === cat.name
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-secondary/50"
                  )}
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", cat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-foreground">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 rounded-xl bg-secondary/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The timer will start immediately. You can pause or stop at any time. When you finish, you&apos;ll be able to add notes and evidence.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleStart} 
            disabled={!selectedCategory}
            className="flex-1"
          >
            <Play className="h-4 w-4" />
            Start Timer
          </Button>
        </div>
      </Card>
    </div>
  );
}
