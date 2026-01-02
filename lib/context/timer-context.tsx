'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
  pausedTime: number;
  elapsedSeconds: number;
  category: string;
}

interface TimerContextType {
  state: TimerState;
  startTimer: (category: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => { duration: number; category: string } | null;
  resetTimer: () => void;
}

const initialState: TimerState = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  pausedTime: 0,
  elapsedSeconds: 0,
  category: '',
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TimerState>(initialState);

  // Update elapsed time every second when running
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isRunning && !state.isPaused && state.startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - state.startTime! + state.pausedTime) / 1000);
        setState(prev => ({ ...prev, elapsedSeconds: elapsed }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isRunning, state.isPaused, state.startTime, state.pausedTime]);

  const startTimer = useCallback((category: string) => {
    setState({
      isRunning: true,
      isPaused: false,
      startTime: Date.now(),
      pausedTime: 0,
      elapsedSeconds: 0,
      category,
    });
  }, []);

  const pauseTimer = useCallback(() => {
    if (state.isRunning && !state.isPaused) {
      const now = Date.now();
      const additionalTime = now - (state.startTime || now);
      setState(prev => ({
        ...prev,
        isPaused: true,
        pausedTime: prev.pausedTime + additionalTime,
        startTime: null,
      }));
    }
  }, [state.isRunning, state.isPaused, state.startTime]);

  const resumeTimer = useCallback(() => {
    if (state.isRunning && state.isPaused) {
      setState(prev => ({
        ...prev,
        isPaused: false,
        startTime: Date.now(),
      }));
    }
  }, [state.isRunning, state.isPaused]);

  const stopTimer = useCallback(() => {
    if (!state.isRunning) return null;

    const duration = state.elapsedSeconds;
    const category = state.category;

    setState(initialState);

    return { duration, category };
  }, [state.isRunning, state.elapsedSeconds, state.category]);

  const resetTimer = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <TimerContext.Provider value={{ state, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}

