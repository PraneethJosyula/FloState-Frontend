'use client';

import { useTimer } from '@/lib/context/timer-context';
import { useState } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SaveActivityModal } from './save-activity-modal';
import { cn } from '@/lib/utils';

export function ActiveTimer() {
  const { state, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activityData, setActivityData] = useState<{ duration: number; category: string } | null>(null);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    const data = stopTimer();
    if (data) {
      setActivityData(data);
      setShowSaveModal(true);
    }
  };

  const handleSaveComplete = () => {
    setShowSaveModal(false);
    setActivityData(null);
  };

  const handleDiscard = () => {
    setShowSaveModal(false);
    setActivityData(null);
  };

  return (
    <>
      {/* Timer Bar - only show when running */}
      {state.isRunning && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className={cn(
            "flex items-center gap-4 rounded-full px-6 py-3 shadow-lg border",
            "bg-card border-border",
            state.isPaused && "animate-pulse"
          )}>
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                state.isPaused ? "bg-yellow-500" : "bg-green-500 animate-pulse"
              )} />
              <span className="text-sm font-medium text-foreground">{state.category}</span>
            </div>

            {/* Timer Display */}
            <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-mono text-lg font-bold text-primary tabular-nums">
                {formatTime(state.elapsedSeconds)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {state.isPaused ? (
                <Button size="icon" variant="ghost" onClick={resumeTimer} className="h-9 w-9 rounded-full">
                  <Play className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" onClick={pauseTimer} className="h-9 w-9 rounded-full">
                  <Pause className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="icon" 
                variant="destructive" 
                onClick={handleStop}
                className="h-9 w-9 rounded-full"
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal - renders independently */}
      {showSaveModal && activityData && (
        <SaveActivityModal
          duration={activityData.duration}
          category={activityData.category}
          onClose={handleDiscard}
          onSave={handleSaveComplete}
        />
      )}
    </>
  );
}
