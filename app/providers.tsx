'use client';

import { ReactNode } from 'react';
import { TimerProvider } from '@/lib/context/timer-context';
import { ActiveTimer } from '@/components/timer/active-timer';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TimerProvider>
      {children}
      <ActiveTimer />
    </TimerProvider>
  );
}

